const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const { transport, generateEmail } = require("../mail");
const { hasPermission } = require("../utils");
const stripe = require("../stripe");

const TOKEN_AGE_ONE_HOUR = 1000 * 60 * 60;
const TOKEN_AGE_ONE_YEAR = TOKEN_AGE_ONE_HOUR * 24 * 365;

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const user = ctx.request.user;

    if (!user) {
      throw new Error("Login to create items");
    }

    // Verify user has permission to create items
    hasPermission(user, ["ADMIN", "ITEMCREATE"]);

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          // This is how relationships are created between Item and User
          user: {
            connect: {
              id: ctx.request.userId
            }
          }
        }
      },
      info
    );
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const user = ctx.request.user;
    if (!user) {
      throw new Error("Login to update items");
    }

    // verify the item exists
    const item = await ctx.db.query.item({ where: { id: args.id } }, "{ id user { id } }");
    if (!item) {
      throw new Error("Item doesn't exist");
    }

    const userOwnsItem = item.user.id === user.id;
    const hasPermissions = user.permissions.some(permission => ["ADMIN", "ITEMUPDATE"].includes(permission));
    if (!userOwnsItem && !hasPermissions) {
      throw new Error("You can't edit this item");
    }

    // take a copy of the updates
    const updates = { ...args };

    // remove unique id from updates
    delete updates.id;

    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    // find the item
    const item = await ctx.db.query.item({ where: { id: args.id } }, `{ id title user { id } }`);
    if (!item) {
      throw new Error("Item doesn't exist");
    }

    // check if they own the item, or have the permissions to delete it
    if (!ctx.request.userId) {
      throw new Error("Login to delete items");
    }

    const userOwnsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => ["ADMIN", "ITEMDELETE"].includes(permission));
    if (!userOwnsItem && !hasPermissions) {
      throw new Error("You can't delete this item");
    }

    // Delete all cart items which contain the item we're about to delete
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        item: { id: args.id }
      }
    });

    // delete the actual item
    return ctx.db.mutation.deleteItem({ where: { id: args.id } }, info);
  },
  async signup(parent, args, ctx, info) {
    if (!args.email || !args.name || !args.password) {
      throw new Error("All fields are required for signup");
    }

    // normalize email address
    args.email = args.email.toLowerCase();

    // hash the password
    const password = await bcrypt.hash(args.password, 10);

    // create user in database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password: password, // overwrite password field with password hash
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    // create JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // set JWT token as a cookie in the response
    ctx.response.cookie("token", token, {
      httpOnly: true, // prevent javascript from having access to the cookie
      maxAge: TOKEN_AGE_ONE_YEAR
    });

    // return user to the client
    return user;
  },
  async signin(parent, args, ctx, info) {
    if (!args.email || !args.password) {
      throw new Error("All fields are required for signin");
    }

    // Check if user with corresponding email exists
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`Invalid user: '${args.email}'`);
    }

    // Check that password is correct
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
      throw new Error("Wrong password");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: TOKEN_AGE_ONE_YEAR
    });

    // Return the user
    return user;
  },
  async signout(parent, args, ctx, info) {
    // Delete the cookie
    ctx.response.clearCookie("token");
    return { message: "Cookie clear" };
  },
  async requestReset(parent, args, ctx, info) {
    if (!args.email) {
      throw new Error("Email field is required");
    }

    // check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found with email '${args.email}'`);
    }

    // set a reset token and expiry on that user
    const randomBytesPromise = await promisify(randomBytes)(20);
    const resetToken = randomBytesPromise.toString("hex");
    const resetTokenExpiry = Date.now() + TOKEN_AGE_ONE_HOUR;
    await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken: resetToken, resetTokenExpiry: resetTokenExpiry }
    });

    // email the user the reset token
    await transport.sendMail(
      {
        from: "password-reset@react-demo-store.com",
        to: user.email,
        subject: "React Demo Store Password Reset",
        html: generateEmail(`Reset your account password: \n\n
          <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>Click here to reset</a>`)
      },
      (err, info) => {
        if (err) {
          throw new Error(`Failed to send password reset email to ${user.email}`);
        }
      }
    );

    return { message: "Reset email sent" };
  },
  async resetPassword(parent, args, ctx, info) {
    if (!args.password || !args.confirmPassword) {
      throw new Error("Both password fields are required");
    }

    // check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Provided passwords don't match");
    }

    // check if user has unexpired reset token
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - TOKEN_AGE_ONE_HOUR
      }
    });
    if (!user) {
      throw new Error("Reset token is either invalid or expired");
    }

    // hash new password
    const password = await bcrypt.hash(args.password, 10);

    // save new hash to user, remove old reset fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { resetToken: null, resetTokenExpiry: null, password: password }
    });

    // generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // Set JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: TOKEN_AGE_ONE_YEAR // token doesn't expire for 1 year
    });

    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // check if user is logged in
    if (!ctx.request.userId) {
      throw new Error("Login to change permissions");
    }

    // query current user
    const user = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );

    // check if user has permission to make the change
    hasPermission(user, ["ADMIN", "PERMISSIONUPDATE"]);

    // update the permissions
    return ctx.db.mutation.updateUser(
      {
        where: { id: args.userId },
        data: { permissions: { set: args.permissions } }
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    // 1. Check if user is logged in
    const userId = await ctx.request.userId;
    if (!userId) {
      throw new Error("You must be signed in to modify your cart");
    }

    // 2. Query the user's current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });

    // 3. Check if item is already in user's cart.
    // If it is, increment quantity by 1.
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }

    // 4. If not, create a new CartItem for the user
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          item: {
            connect: { id: args.id }
          }
        }
      },
      info
    );
  },
  async removeFromCart(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("Must be logged in to remove cart items");
    }

    // 1. Find cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id: args.id
        }
      },
      `{ id, user { id }}`
    );

    if (!cartItem) {
      throw new Error("No cart item found");
    }

    // 2. Ensure user owns cart item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error("Calling user doesn't have item in cart");
    }

    // 3. Delete the cart item
    return ctx.db.mutation.deleteCartItem(
      {
        where: {
          id: cartItem.id
        }
      },
      info
    );
  },
  async createOrder(parent, args, ctx, info) {
    // Ensure user is signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("Sign in to checkout");
    }

    const user = await ctx.db.query.user(
      {
        where: {
          id: userId
        }
      },
      `{
          id
          name
          email
          cart {
            id
            quantity
            item {
              title
              price
              id
              description
              image
              largeImage
            }
          }
        }`
    );

    // Recalculate the cart total price server-side
    const amount = user.cart.reduce((tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0);

    // Create Stripe charge (turn token into $$$)
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "USD",
      source: args.token
    });

    // Convert CartItems to OrderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } }
      };
      delete orderItem.id;
      return orderItem;
    });

    // Create the Order
    const order = await ctx.db.mutation
      .createOrder({
        data: {
          total: charge.amount,
          charge: charge.id,
          items: { create: orderItems }, // instruct prisma to create all the OrderItems in the db for us
          user: { connect: { id: userId } }
        }
      })
      .catch(err => {
        throw new Error("Failed to create order");
      });

    // Clear users cart, delete CartItems
    const currentCartIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: currentCartIds
      }
    });

    // Return the Order to the client
    return order;
  }
};

module.exports = Mutations;

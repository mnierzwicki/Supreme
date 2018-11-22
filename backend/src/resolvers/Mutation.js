const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const { transport, generateEmail } = require("../mail");
const { hasPermission } = require("../utils");

const TOKEN_AGE_ONE_HOUR = 1000 * 60 * 60;
const TOKEN_AGE_ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to create items");
    }

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
  updateItem(parent, args, ctx, info) {
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
      throw new Error("Must be logged in to delete items");
    }

    const userOwnsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => ["ADMIN", "ITEMDELETE"].includes(permission));

    if (!userOwnsItem && !hasPermissions) {
      throw new Error("You don't have permission to do that");
    }

    // all checks passed, delete the item
    return ctx.db.mutation.deleteItem({ where: { id: args.id } }, info);
  },
  async signup(parent, args, ctx, info) {
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
    // Check if user with corresponding email exists
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found with email '${args.email}'`);
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
    // check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found with email '${args.email}'`);
    }

    // set a reset token and expiry on that user
    const randomBytesPromise = await promisify(randomBytes)(20);
    const resetToken = randomBytesPromise.toString("hex");
    const resetTokenExpiry = Date.now() + TOKEN_AGE_ONE_HOUR;
    const resp = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken: resetToken, resetTokenExpiry: resetTokenExpiry }
    });

    // email the user the reset token
    await transport.sendMail(
      {
        from: "supreme@reset.com",
        to: user.email,
        subject: "Supreme Store Password Reset",
        html: generateEmail(`Reset your account password: \n\n
          <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>Click here to reset</a>`)
      },
      (err, info) => {
        if (err) {
          throw new Error(`Failed to send password reset email to ${user.email}`);
        }
      }
    );

    return { message: "Password reset email sent successfully" };
  },
  async resetPassword(parent, args, ctx, info) {
    // check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Provided passwords do not match");
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
  }
};

module.exports = Mutations;

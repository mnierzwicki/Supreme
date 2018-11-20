const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
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
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item({ where }, `{ id title }`);

    // TODO check if they own the item, or have the permissions

    // delete it
    return ctx.db.mutation.deleteItem({ where }, info);
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
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    // return user to the client
    return user;
  }
};

module.exports = Mutations;

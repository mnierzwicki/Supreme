const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me: function(parent, args, ctx, info) {
    // check if request contains a userId
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  users: async function(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("Must be logged in");
    }

    // Check if user has permission to query all permissions
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    // If they do have permissions, query all the users
    const empty_where = {};
    return ctx.db.query.users(empty_where, info);
  }
};

module.exports = Query;

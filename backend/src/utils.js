function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave => permissionsNeeded.includes(permissionTheyHave));
  if (!matchedPermissions.length) {
    throw new Error("You're not allowed to do that");
  }
}

exports.hasPermission = hasPermission;

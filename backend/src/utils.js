function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave => permissionsNeeded.includes(permissionTheyHave));
  if (!matchedPermissions.length) {
    throw new Error("Insufficient permissions");
  }
}

exports.hasPermission = hasPermission;

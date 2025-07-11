exports.authorizeRoleOrPermission = (roleName, permissionName) => {
    return (req, res, next) => {
        const user = req.user;

        const hasRole = user.roles.some((role) => role.name === roleName);
        const hasPermission = user.roles.some((role) =>
            role.permissions.some((perm) => perm.name === permissionName)
        );

        if (hasRole || hasPermission) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};

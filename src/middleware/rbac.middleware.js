exports.authorize = (requiredPermissions = []) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            // Check if user has admin role
            const isAdmin = user.roles.some(role => role.name === 'admin');
            if (isAdmin) return next();

            // Check for required permissions
            const userPermissions = user.roles.reduce((perms, role) => {
                return perms.concat(role.permissions.map(p => p.name));
            }, []);

            const hasPermission = requiredPermissions.every(perm =>
                userPermissions.includes(perm)
            );

            if (!hasPermission) throw new Error();

            next();
        } catch (error) {
            res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
        }
    };
};
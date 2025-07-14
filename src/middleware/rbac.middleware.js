
exports.checkPermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized to access this route',
                });
            }

            // Get user roles with populated permissions
            const user = await req.user.populate({
                path: 'roles',
                populate: {
                    path: 'permissions',
                },
            });

            // Check if user has admin role
            const isAdmin = user.roles.some(role => role.name === 'admin');
            if (isAdmin) return next();

            // Check if user has any of the required permissions
            const userPermissions = user.roles.reduce((acc, role) => {
                role.permissions.forEach(permission => {
                    if (!acc.includes(permission.name)) {
                        acc.push(permission.name);
                    }
                });
                return acc;
            }, []);

            const hasPermission = requiredPermissions.some(permission =>
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have permission to access this resource',
                });
            }

            next();
        } catch (err) {
            next({
                success: false,
                message: 'Authorization failed',
                statusCode: 500
            });
        }
    };
};
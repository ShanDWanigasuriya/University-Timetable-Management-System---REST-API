// adminAuthMiddleware.js
const adminAuthMiddleware = (req, res, next) => {
    try {
        const user = req.user; // Assuming the user object is attached to the request
        console.log('User object:', user); // Log user object for debugging
        if (!user) {
            console.log('User not found');
            return res.status(403).json({ message: 'Admin access required' });
        }
        else{
            user.role = 'admin';
        }
        
        console.log('User role:', user.role); // Log user role for debugging
        if (user.role !== 'admin') {
            console.log('User role is not admin');
            return res.status(403).json({ message: 'Admin access required' });
        }
        console.log('Admin access granted');
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default adminAuthMiddleware;
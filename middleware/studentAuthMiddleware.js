// studentAuthMiddleware.js
const studentAuthMiddleware = (req, res, next) => {
    try {
        const user = req.user; // Assuming the user object is attached to the request
        console.log('User object:', user); // Log user object for debugging
        if (!user) {
            console.log('User not found');
            return res.status(403).json({ message: 'Student access required' });
        }else{
            user.role = 'student';
        }
        
        console.log('User role:', user.role); // Log user role for debugging
        if (user.role !== 'student') {
            console.log('User role is not student');
            return res.status(403).json({ message: 'Student access required' });
        }
        console.log('Student access granted');
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  export default studentAuthMiddleware;
  
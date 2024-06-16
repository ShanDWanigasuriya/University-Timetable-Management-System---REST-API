import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        if(req.headers && req.headers.authorization && req.headers.authorization.startsWith('bearer'))
        {
            const token = req.headers.authorization.split(' ')[1];
            if(token == null) {
                return res.sendStatus(401);
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if(err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default authMiddleware;

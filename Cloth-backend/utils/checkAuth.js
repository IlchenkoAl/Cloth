import jsonWebToken from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET || 'default_secret');
            req.userId = decoded._id;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Нет доступа' });
        }
    } else {
        return res.status(403).json({ message: 'Нет доступа' });
    }
};

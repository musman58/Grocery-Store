import jwt from 'jsonwebtoken';

export default function auth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      res.status(401).json({ success: false, error: 'Please authenticate' });
    }
  };
}


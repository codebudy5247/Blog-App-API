import jwt from "jsonwebtoken";


const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
      return res.status(401).json({ msg: "no token found...." });
  }
  try {
      const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodetoken;
      console.log(req.user);
      next();
  } catch {
      res.status(401).json({ msg: "Token is invalid" });
  }
};

export default auth;

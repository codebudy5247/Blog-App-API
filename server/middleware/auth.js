import jwt from "jsonwebtoken";
import User from "../models/userModel.js"


const auth = async (req, res, next) => {
    // const token = req.header('x-auth-token');
    // if (!token) {
    //     return res.status(401).json({ msg: "no token found...." });
    // }
    // try {
    //     const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = decodetoken;
    //     console.log(req.user);
    //     next();
    // } catch {
    //     res.status(401).json({ msg: "Token is invalid" });
    //  }
    let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (err) {
      console.log(err)
      res.status(401).json({msg: err.message})
      
    }
  }

  if (!token) {
    res.status(401).json({msg: "Invalid Authentication."})
   
  }
}

export default auth;

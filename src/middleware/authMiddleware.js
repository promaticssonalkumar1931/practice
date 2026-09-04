const jwt = require('jsonwebtoken');
const User = require('../models/User');
const tokenblacklistedModel=require('../models/tokenBlacklisting')
const protect = async (req, res, next) => {
  let token;

  // Support token from Authorization header or cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const isblacklisted=await tokenblacklistedModel.findOne({token:token});

  if(isblacklisted){
    return res.status(401).json({
      message: "Unauthorized",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
    req.user = await User.findById(decoded.id).select('-password');
    console.log(req.user)

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const protectMainUser = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Otherwise get token from cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // No token
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("+mainuser");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (!user.mainuser) {
      return res.status(403).json({
        message: "You are unauthorized to access this resource"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
};

module.exports = { protect ,protectMainUser};

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const tokenBlackListModel=require('../models/tokenBlacklisting');

// Helper to convert expiry like '7d' into milliseconds for cookie maxAge
const getMaxAge = (expiresIn) => {
  if (!expiresIn) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const match = String(expiresIn).match(/(\d+)d/);
  if (match) return parseInt(match[1], 10) * 24 * 60 * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    const token = generateToken(user._id);
    const maxAge = getMaxAge(process.env.JWT_EXPIRES_IN || '7d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    const maxAge = getMaxAge(process.env.JWT_EXPIRES_IN || '7d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

async function logOut(req,res){
  const token=req.cookies.token||req.headers.authorizarion.split(" ")[1];

  if(!token){
    return res.status(200).json({
      message:"user logOut Sucessffully"
    })
  }

res.cookie("token","");

const blacklisted=await tokenBlackListModel.create({token:token});
blacklisted.save()


return res.status(200).json({
  message:"user logOut sucessfully"
})
}

module.exports = { registerUser, loginUser, getMe,logOut };

import asyncHandler from 'express-async-handler';
import { type Request, type Response } from 'express';
import generateToken from '../utils/generateToken';
import {
  findUserById,
  authenticateUser,
  findUser,
  findAllUsers,
  createUser,
} from '../services/user.service';
import { type UserDocument } from '../models/userModel';

interface CustomRequest extends Request {
  user?: UserDocument | null;
}

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (user === null) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await findUser(email);

  if (userExists !== null) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await createUser(name, email, password);
  if (user === null) {
    res.status(401);
    throw new Error('Invalid user data');
  }
  const token: string = generateToken(user._id.toString());

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { user } = req;
    if (user === undefined || user === null) throw new Error('User not found');
    const singleUser = await findUserById(user?._id);

    if (singleUser === null) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({
      _id: singleUser?._id,
      name: singleUser.name,
      email: singleUser.email,
      isAdmin: singleUser.isAdmin,
    });
  },
);

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await findAllUsers();
  res.json(users);
});

export { authUser, getUserProfile, getUsers, registerUser };

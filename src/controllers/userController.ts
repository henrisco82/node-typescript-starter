import asyncHandler from 'express-async-handler';
import { type Request, type Response } from 'express';
import generateToken from '../utils/generateToken';
import {
  findUserById,
  authenticateUser,
  findUser,
  findAllUsers,
  createUser,
  deleteUserById,
  update,
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const { name, email, password } = req.body;
    if (user === undefined || user === null) throw new Error('User not found');
    const updatedUser = await update(user?._id, name, email, password);
    if (updatedUser === null) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  },
);

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await findAllUsers();
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user !== null) {
    await deleteUserById(user._id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await findUserById(req.params.id);
  if (user !== null) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, isAdmin } = req.body;
  const updatedUser = await update(req.params.id, name, email, isAdmin);
  if (updatedUser !== null) {
    res.json(updatedUser);
  }
  res.status(404);
});

export {
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  registerUser,
  deleteUser,
  getUserById,
  updateUser,
};

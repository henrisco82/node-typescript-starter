import express from 'express';
import {
  authUser,
  getUserProfile,
  getUsers,
  registerUser,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/all').get(getUsers);
router.route('/profile').get(protect, getUserProfile);

export default router;

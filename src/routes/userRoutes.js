import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', verifyToken, getUsers); // list users (protected)
router.get('/:id', verifyToken, getUserById); // get user by id (protected)
router.put('/:id', verifyToken, updateUser); // edit profile (owner only)
router.delete('/:id', verifyToken, deleteUser); // delete profile (owner only)
router.post('/avatar', verifyToken, upload.single('file'), uploadAvatar); // upload avatar (auth user)
export default router;

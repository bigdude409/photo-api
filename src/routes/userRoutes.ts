import express from 'express';
import { UserController } from '../controllers/UserController.js';

const router = express.Router();
const userController = new UserController();

// GET /api/v1/users
router.get('/', userController.getAllUsers);

// POST /api/v1/users
router.post('/', userController.createUser);

// GET /api/v1/users/:id
router.get('/:id', userController.getUserById);

// PUT /api/v1/users/:id
router.put('/:id', userController.updateUser);

// DELETE /api/v1/users/:id
router.delete('/:id', userController.deleteUser);

export { router as userRoutes };

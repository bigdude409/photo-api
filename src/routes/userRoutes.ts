import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { AuthController } from '../controllers/AuthController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';

const router = express.Router();
const userController = new UserController();
const authController = new AuthController();

// GET /api/v1/users
router.get('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  userController.getAllUsers(req, res);
});

// POST /api/v1/users
router.post('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  userController.createUser(req, res);
});

// GET /api/v1/users/:id
router.get('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  userController.getUserById(req, res);
});

// PUT /api/v1/users/:id
router.put('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  userController.updateUser(req, res);
});

// DELETE /api/v1/users/:id
router.delete('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  userController.deleteUser(req, res);
});

// POST /api/v1/users/register
router.post('/register', authController.registerUser);

// POST /api/v1/users/login
router.post('/login', authController.loginUser);


export { router as userRoutes };

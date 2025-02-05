import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';

export class AuthController {
  // Register a new user
  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' });
    }
  }

  // Login a user
  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000 // 1 hour in milliseconds
      });
      res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  }

  logoutUser(req: AuthenticatedRequest, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).send({ message: 'User logged out successfully' });
  }
}

export default AuthController; 
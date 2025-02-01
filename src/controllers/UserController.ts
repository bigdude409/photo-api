// src/controllers/UserController.ts
import User from '../models/user.js';
import { Request, Response } from 'express';
import Media from '../models/media.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import express from 'express';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error creating user', error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      // Ensure the update object is correctly formatted
      const updateData = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  async getUserMedia(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = req.user.userId;
      const media = await Media.find({ userId });
      res.status(200).json(media);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving media', error });
    }
  }

  async addMedia(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = req.user.userId;
      const { images } = req.body;
      const media = new Media({ userId, images });
      await media.save();
      res.status(201).json(media);
    } catch (error) {
      res.status(400).json({ message: 'Error adding media', error });
    }
  }
}
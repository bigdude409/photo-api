// src/controllers/UserController.ts
import { Request, Response } from 'express';
import Media from '../models/media.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import express from 'express';

export class MediaController {
  

  async getUserMedia(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = req.user.userId;
      const media = await Media.find({ userId }).sort({ "images.exifData.dateTaken": 1 });
      // const media = await Media.find({ userId });
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
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes.js';
import cluster from 'cluster';
import os from 'os';

// Load environment variables
dotenv.config();

// Check if the current process is the master process
if (cluster.isPrimary) {
  const numCPUs = os.availableParallelism();
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker processes have a HTTP server
  const app = express();
  const PORT = process.env.PORT || 3000;
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/photo-api';

  // Middleware
  app.use(express.json());

  // Connect to MongoDB
  type ConnectDB = () => Promise<void>;
  const connectDB: ConnectDB = async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };

  // Use user routes
  app.use('/api/v1/users', userRoutes);
  
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
} 
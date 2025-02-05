import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes.js';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Check if the current process is the master process
if (cluster.isPrimary) {
  const numCPUs = isProduction ? os.availableParallelism() : 1;
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

  // CORS configuration
  app.use(cors({
    origin: ['http://localhost:3010', 'http://localhost:3000'],
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
  }));

  // Middleware
  app.use(express.json());
  app.use(cookieParser());


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
  app.use('/api/v1/user', userRoutes);

  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
} 
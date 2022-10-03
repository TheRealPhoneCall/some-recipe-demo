import http from 'http';
import express from 'express';
import mongoose from 'mongoose'
import logging from './config/logging';
import config from './config/config';
import userRoutes from './modules/user/route';
import recipeRoutes from './modules/recipes/route';
import recipeStepRoutes from './modules/recipe-steps/route';
import uploadRoutes from './modules/uploads/route';

const NAMESPACE = 'Server';
const router = express();

/** Connect to MongoDB */
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then(result => {
    logging.info(NAMESPACE, 'Connected to MongoDB')
  })
  .catch(error => {
    logging.error(NAMESPACE, error.message, error)
  })

/** Log the request */
router.use((req, res, next) => {
  /** Log the req */
  logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
    /** Log the res */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  })

  next();
});

/** Configure file uploads */
router.use('/uploads', express.static('uploads'))

/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Rules of our API */
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

/** Routes go here */
router.use('/auth', userRoutes);
router.use('/recipes', recipeRoutes);
router.use('/recipe-steps', recipeStepRoutes);
router.use('/upload', uploadRoutes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error('Not found');

  res.status(404).json({
    message: error.message
  });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));
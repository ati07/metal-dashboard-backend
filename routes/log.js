// routes/logRoutes.js
import express from 'express';
import { getLogs } from '../controllers/log.js';

const logRouter = express.Router();

logRouter.get('/', getLogs);

export default logRouter;

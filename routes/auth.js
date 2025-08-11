import { Router } from 'express';
import { login } from '../controllers/auth.js';
// import logUserAction from '../middleware/logUserAction.js';
// logUserAction('user Logged In'),
const authRouter = Router();

authRouter.post('/login',  login);


export default authRouter;

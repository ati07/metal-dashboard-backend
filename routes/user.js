import { Router } from 'express';
import { deleteUser, getUsers, editUserDetails, addUser } from '../controllers/user.js';
import auth from '../middleware/auth.js';
import authenticateRoles from '../middleware/authenticateRole.js';
import logUserAction from '../middleware/logUserAction.js';

const allowedRoles = ["Admin", "Client", "Super Admin", "CRM_Admin"]

const userRouter = Router();
// auth, authenticateRoles(allowedRoles),
// auth, authenticateRoles(allowedRoles)
// userRouter.post('/',  addUser)
userRouter.post('/', auth, logUserAction('Created a User'), addUser)
userRouter.get('/', auth, logUserAction('Fetched User'), getUsers);
userRouter.patch('/:userId', auth, logUserAction('Deleted a User'), deleteUser);
userRouter.put('/:userId', auth, logUserAction('Updated a User'), editUserDetails);
// userRouter.patch('/status/:userId', auth, editUserDetails);


export default userRouter;

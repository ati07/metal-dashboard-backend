import { Router } from "express";
import auth from "../middleware/auth.js";
import { createCustomer, deleteCustomer, getCustomer, updateCustomer } from "../controllers/customer.js";
import logUserAction from "../middleware/logUserAction.js";

const CustomerRouter = Router();

CustomerRouter.post('/', auth,  logUserAction('Created Customer'),createCustomer);
CustomerRouter.get('/', auth,  logUserAction('Fetched Customeries'),getCustomer);
CustomerRouter.patch('/:customerId', auth, logUserAction('Deleted Customer'),deleteCustomer);
CustomerRouter.put('/:customerId', auth,  logUserAction('Updated Customer'),updateCustomer);

export default CustomerRouter;
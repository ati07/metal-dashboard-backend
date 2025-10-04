import { Router } from "express";
import auth from "../middleware/auth.js";
import { createVendor, deleteVendor, getVendor, updateVendor } from "../controllers/vendor.js";
import logUserAction from "../middleware/logUserAction.js";

const VendorRouter = Router();

VendorRouter.post('/', auth,  logUserAction('Created Vendor'),createVendor);
VendorRouter.get('/', auth,  logUserAction('Fetched Vendories'),getVendor);
VendorRouter.patch('/:vendorId', auth, logUserAction('Deleted Vendor'),deleteVendor);
VendorRouter.put('/:vendorId', auth,  logUserAction('Updated Vendor'),updateVendor);

export default VendorRouter;
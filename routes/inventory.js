import { Router } from "express";
import auth from "../middleware/auth.js";
import { createInventory, deleteInventory, getInventory, updateInventory } from "../controllers/inventory.js";
import logUserAction from "../middleware/logUserAction.js";

const InventoryRouter = Router();

InventoryRouter.post('/', auth,  logUserAction('Created Inventory'),createInventory);
InventoryRouter.get('/', auth,  logUserAction('Fetched Inventories'),getInventory);
InventoryRouter.patch('/:inventoryId', auth, logUserAction('Deleteded Inventory'),deleteInventory);
InventoryRouter.put('/:inventoryId', auth,  logUserAction('Updated Inventory'),updateInventory);

export default InventoryRouter;
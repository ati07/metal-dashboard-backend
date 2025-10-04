import { Router } from "express";
import auth from "../middleware/auth.js";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/category.js";
import logUserAction from "../middleware/logUserAction.js";

const CategoryRouter = Router();

CategoryRouter.post('/', auth,  logUserAction('Created Category'),createCategory);
CategoryRouter.get('/', auth,  logUserAction('Fetched Inventories'),getCategory);
CategoryRouter.patch('/:categoryId', auth, logUserAction('Deleteded Category'),deleteCategory);
CategoryRouter.put('/:categoryId', auth,  logUserAction('Updated Category'),updateCategory);

export default CategoryRouter;
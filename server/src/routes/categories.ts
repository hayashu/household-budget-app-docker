import {Router} from "express";
import { getAllCategories, getCategoryById,createCategory, updateCategory, deleteCategory } from "../controllers/categoriesController";

const router = Router();
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export const categoriesRouter = router;
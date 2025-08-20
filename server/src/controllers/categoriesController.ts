import {getAllCategories as getAllCategoriesModel, getCategoryById as getCategoryByIdModel,createCategory as createCategoryModel, updateCategory as updateCategoryModel, deleteCategory as deleteCategoryModel} from '../models/categoriesModel';
import { Request, Response } from 'express';

const getAllCategories = async (req: Request, res: Response):Promise<void> => {
  try {
    const categories = await getAllCategoriesModel();
    res.status(200).json(categories);
    return;
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
};

const getCategoryById = async (req: Request, res: Response):Promise<void> => {
  const {id} = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({error: 'Invalid category ID'});
    return;
  }
  try {
    const category = await getCategoryByIdModel(parseInt(id, 10));
    if (!category) {
      res.status(404).json({error: 'Category not found'});
      return;
    }
    res.status(200).json(category);
    return;
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}

const createCategory = async (req: Request, res: Response):Promise<void> => {
  const {name} = req.body;
  if (!name){
    res.status(400).json({error: 'Category name is required'});
    return;
  }
  try {
    const createdCategory = await createCategoryModel(name);
    res.status(201).json(createdCategory);
    return;
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}

const updateCategory = async (req: Request, res: Response):Promise<void> => {
  const {id} = req.params;
  const {name} = req.body;
  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({error: 'Invalid category ID'});
    return;
  }
  const findCategory = await getCategoryByIdModel(parseInt(id, 10));
  if (!findCategory) {
    res.status(404).json({error: 'Category not found'});
    return;
  }
  
  if (!name){
    res.status(400).json({error: 'Category name is required'});
    return;
  }
  try {
    const updatedCategory = await updateCategoryModel(parseInt(id, 10), name);
    if (!updatedCategory) {
      res.status(404).json({error: 'Category not found'});
      return;
    }
    res.status(200).json(updatedCategory);
    return;
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}

const deleteCategory = async (req: Request, res: Response):Promise<void> => {
  const {id} = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({error: 'Invalid category ID'});
    return;
  }
  try {
    const deletedCategory = await deleteCategoryModel(parseInt(id, 10));
    if (!deletedCategory) {
      res.status(404).json({error: 'Category not found'});
      return;
    }
    res.status(200).json(deletedCategory);
    return;
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}

export {getAllCategories, getCategoryById,createCategory, updateCategory, deleteCategory};
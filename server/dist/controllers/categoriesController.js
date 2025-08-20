"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categoriesModel_1 = require("../models/categoriesModel");
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, categoriesModel_1.getAllCategories)();
        res.status(200).json(categories);
        return;
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id, 10))) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
    }
    try {
        const category = yield (0, categoriesModel_1.getCategoryById)(parseInt(id, 10));
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.status(200).json(category);
        return;
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.getCategoryById = getCategoryById;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Category name is required' });
        return;
    }
    try {
        const createdCategory = yield (0, categoriesModel_1.createCategory)(name);
        res.status(201).json(createdCategory);
        return;
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    if (!id || isNaN(parseInt(id, 10))) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
    }
    const findCategory = yield (0, categoriesModel_1.getCategoryById)(parseInt(id, 10));
    if (!findCategory) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    if (!name) {
        res.status(400).json({ error: 'Category name is required' });
        return;
    }
    try {
        const updatedCategory = yield (0, categoriesModel_1.updateCategory)(parseInt(id, 10), name);
        if (!updatedCategory) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.status(200).json(updatedCategory);
        return;
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id, 10))) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
    }
    try {
        const deletedCategory = yield (0, categoriesModel_1.deleteCategory)(parseInt(id, 10));
        if (!deletedCategory) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.status(200).json(deletedCategory);
        return;
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.deleteCategory = deleteCategory;

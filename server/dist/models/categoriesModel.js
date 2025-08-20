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
const app_1 = require("../app");
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('SELECT id, name FROM categories');
    return result.rows;
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('SELECT id, name FROM categories WHERE id = $1;', [id]);
    return result.rows[0];
});
exports.getCategoryById = getCategoryById;
const createCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('insert into categories (name) values ($1) returning *;', [name]);
    return result.rows[0];
});
exports.createCategory = createCategory;
const updateCategory = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('update categories set name= $2 where id = $1 returning *;', [id, name]);
    return result.rows[0];
});
exports.updateCategory = updateCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('delete from categories where id = $1 returning *;', [id]);
    return result.rows[0];
});
exports.deleteCategory = deleteCategory;

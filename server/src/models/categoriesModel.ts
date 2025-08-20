import {client} from '../app';

const getAllCategories = async () => {
  const result = await client.query('SELECT id, name, type, color FROM categories ORDER BY type, name');
  return result.rows;
};

const getCategoryById = async (id: number) => {
  const result = await client.query('SELECT id, name, type, color FROM categories WHERE id = $1;', [id]);
  return result.rows[0];
}

const createCategory = async(name: string, type: string, color: string) =>{
  const result = await client.query('INSERT INTO categories (name, type, color) VALUES ($1, $2, $3) RETURNING *;', [name, type, color]);
  return result.rows[0];
}

const updateCategory = async(id: number, name: string, type: string, color: string) => {
  const result = await client.query('UPDATE categories SET name = $2, type = $3, color = $4 WHERE id = $1 RETURNING *;',[id, name, type, color]);
  return result.rows[0];
}

const deleteCategory = async(id: number) => {
  const result = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *;', [id]);
  return result.rows[0];
}

export { getAllCategories,getCategoryById, createCategory, updateCategory, deleteCategory };
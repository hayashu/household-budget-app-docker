import {client} from '../app';

const getAllCategories = async () => {
  const result = await client.query('SELECT id, name FROM categories');
  return result.rows;
};

const getCategoryById = async (id: number) => {
  const result = await client.query('SELECT id, name FROM categories WHERE id = $1;', [id]);
  return result.rows[0];
}

const createCategory = async(name: string) =>{
  const result = await client.query('insert into categories (name) values ($1) returning *;', [name]);
  return result.rows[0];
}

const updateCategory = async(id: number, name: string) => {
  const result = await client.query('update categories set name= $2 where id = $1 returning *;',[id, name]);
  return result.rows[0];
}

const deleteCategory = async(id: number) => {
  const result = await client.query('delete from categories where id = $1 returning *;', [id]);
  return result.rows[0];
}

export { getAllCategories,getCategoryById, createCategory, updateCategory, deleteCategory };
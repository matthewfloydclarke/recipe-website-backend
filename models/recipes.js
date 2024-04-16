const db = require('../helpers/database');


exports.getById = async function getById (id) {
  const query = "SELECT * FROM recipes WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}


exports.getAll = async function getAllRecipes () {
  const query = "SELECT * FROM recipes;";
  const data = await db.run_query(query);
  return data;
}


exports.add = async function add (recipe) {
  const query = "INSERT INTO recipes SET ?;";
  const data = await db.run_query(query, recipe);
  return data;
}


exports.delById = async function delById (id) {
  const query = "DELETE FROM recipes WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}


exports.update = async function update (recipe) {
  const query = "UPDATE recipes SET ? WHERE ID = ?;";
  const values = [recipe, recipe.ID];
  const data = await db.run_query(query, values);
  return data;
}

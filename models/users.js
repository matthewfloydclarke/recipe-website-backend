const db = require('../helpers/database');
const bcrypt = require('bcrypt');


exports.getById = async function getById (id) {
  const query = "SELECT * FROM users WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}


exports.findByUsername = async function getByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ?;";
  const user = await db.run_query(query, username);
  return user;
}


exports.getAll = async function getAll () {
  const query = "SELECT * FROM users;";
  const data = await db.run_query(query);
  return data;
}


exports.add = async function add (user) {
  const query = "INSERT INTO users SET ?;";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  const data = await db.run_query(query, user);
  return data;
}


exports.delById = async function delById (id) {
  const query = "DELETE FROM users WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}


exports.update = async function update (user) {
  const query = "UPDATE users SET ? WHERE ID = ?;";
  if (user.password) {
    const password = user.password;
    const hash = bcrypt.hashSync(password, 10);
    user.password = hash;  
  }
  const values = [user, user.ID];
  const data = await db.run_query(query, values);
  return data;
}
const mysql = require('promise-mysql');  
const info = require('../config');


exports.run_query = async function run_query(query, values) {
  try {
    const connection = await mysql.createConnection(info.config);
    let data = await connection.query(query, values);
    await connection.end();
    return data;
  } catch (error) {
    console.error(error, query, values);
    throw error
  }
}

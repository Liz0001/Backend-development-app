const sqlite3 = require("sqlite3").verbose()
const file = "./db/users-database.db"
const db = new sqlite3.Database(file)



function getAllUsers() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`
    db.all(sql, [], (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}


// just to see the contents of database
async function checkDatabase() {
  let uuu = await getAllUsers()
  console.log(await uuu)
  console.log("Nr of users in database:", uuu.length)
}


module.exports = { checkDatabase, getAllUsers }

const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const file = "../db/users-database.db"
const db = new sqlite3.Database(path.resolve(__dirname, file))


function getAllUsers() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`
    db.all(sql, [], (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}



async function data() {
  console.log(await getAllUsers())
  let uuu = await getAllUsers()
  console.log(uuu.length)
}



data()
const sqlite3 = require("sqlite3").verbose()
const file = "./db/users-database.db"
const db = new sqlite3.Database(file)
let nextId = generateId()


function getAllUsers() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`
    db.all(sql, [], (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}


async function userExists(user, role) {
  const sql = `SELECT * FROM users WHERE name=? AND role=?`

  return new Promise((resolve, reject) => {
    db.all(sql, [user, role], (error, result) => {
      if (error) reject(error)
      else resolve(result.length > 0)
    })
  })
}


async function createUser(id, user, role, pass) {
  console.log(id, user, role, pass)
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (userID, name, role, password) VALUES (?, ?, ?, ?)`,
      [id, user, role, pass],
      (err, rows) => {
        if (err) reject(err)
        else {
          resolve(rows)
        }
      })
  })
}


async function generateId() {
  let nr = await getAllUsers()
  let id = await nr.length
  return "id" + id
}

// just to see the users in db
async function checkDatabase() {
  let uuu = await getAllUsers()
  console.log(await uuu)
  console.log("Nr of users in database:", uuu.length)
}


module.exports = { checkDatabase, getAllUsers, userExists, createUser, generateId }

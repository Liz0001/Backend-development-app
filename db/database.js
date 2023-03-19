const sqlite3 = require("sqlite3").verbose()
const file = "./db/users-database.db"
const db = new sqlite3.Database(file)
let nextId = generateId()


// for admin to see users in database
function getAllUsers() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`
    db.all(sql, [], (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}

// for login and for create account
async function userExists(user) {
  const sql = `SELECT * FROM users WHERE name=?`

  return new Promise((resolve, reject) => {
    db.all(sql, [user], (error, result) => {
      if (error) reject(error)
      else resolve(result.length > 0)
    })
  })
}

// for login, get the user
async function getUser(user) {
  const sql = `SELECT * FROM users WHERE name=?`

  return new Promise((resolve, reject) => {
    db.all(sql, [user], (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}


// create the new user
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

// generate id for new user
async function generateId() {
  let nr = await getAllUsers()
  let id = await nr.length
  return "id" + id
}


module.exports = { getAllUsers, userExists, createUser, generateId, getUser }

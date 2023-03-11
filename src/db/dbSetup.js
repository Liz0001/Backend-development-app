const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const file = "../db/users-database.db"
const db = new sqlite3.Database(path.resolve(__dirname, file))


let seedData = [
  { userID: "id1", name: "user1", role: "student", password: "password" },
  { userID: "id2", name: "user2", role: "student", password: "password2" },
  { userID: "id3", name: "user3", role: "teacher", password: "password3" },
  { userID: "admin", name: "admin", role: "admin", password: "admin" }
]


let errors = 0

function setupDB() {
  db.serialize(() => {

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        userID    TEXT PRIMARY KEY NOT NULL,
        name      TEXT NOT NULL,
        role      TEXT NOT NULL,
        password  TEXT NOT NULL
  )`, {}, error => { errors++ })


    seedData.forEach(user => {
      // console.log("Adding user =>", user.name)
      db.run(`
      INSERT INTO users (userID, name, role, password) 
      VALUES ($userID, $name, $role, $password)`,
        { $userID: user.userID, $name: user.name, $role: user.role, $password: user.password }, error => { errors++ })
    })

    if (errors > 0)
      console.log("Number of errors", errors)
    else {
      console.log("Database Setup")
    }
  })
}


module.exports = { setupDB }


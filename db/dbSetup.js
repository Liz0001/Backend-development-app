// const path = require("path")
// const db = new sqlite3.Database(path.resolve(__dirname, file))
const sqlite3 = require("sqlite3").verbose()
const file = "./db/users-database.db"
const db = new sqlite3.Database(file)



let seedData = [
  {
    userID: "id1", name: "user1", role: "student1", password:
      "$2b$10$.UW1KbuNQVUX6SJQPms2GOKViw948pFO//i0sMU9Fomt6g8YyeiBG"
  },
  {
    userID: "id2", name: "user2", role: "student2", password:
      "$2b$10$7gDqgnie7kztkCyszEGqDuDBtiQrk5GF8GkKEosczgiTeLGpZc5m."
  },
  {
    userID: "id3", name: "user3", role: "teacher", password:
      "$2b$10$PZltbt/uqVQnLPWGVLbHRe/EgRgzlAhoTFtwSRIV1c5yxLBS4kDpK"
  },
  {
    userID: "admin", name: "admin", role: "admin", password: "$2b$10$qIkhD7VqfWpdhqF6uuXhLexOJC2kVd0OBzbWPS82CwkOFn3cpXW3O"
  }
]


let errors = 0

function setupDB() {
  db.serialize(() => {

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        userID    TEXT PRIMARY KEY NOT NULL UNIQUE,
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

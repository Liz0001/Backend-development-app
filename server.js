///////////////////////////////////
///////////////////////////////////
// server setup etc
const { databaseSetup } = require("./db/dbSetup.js")
const { getAllUsers,
  userExists,
  createUser,
  generateId,
  getUser,
  getAllStudents } = require("./db/database.js")

const cookieParser = require("cookie-parser")
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()

// .env file access for token
require("dotenv").config()

// for ejs view files to render
app.set("view-engine", "ejs")

///////////////////////////////////
// middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`, req.body)
//   next()
// })


///////////////////////////////////
///////////////////////////////////
// All routes

app.get("/", (req, res) => {
  res.redirect("/identify")
})

// login
app.get("/identify", (req, res) => {
  res.render("identify.ejs")
})

// register
app.get("/register", (req, res) => {
  res.render("register.ejs")
})


///////////////////////////////////
app.get("/start", authorizeToken, (req, res) => {
  res.render("start.ejs")
})


app.get("/student1", authorizeToken, authorizeRole(["student1", "teacher", "admin"]), async (req, res) => {
  res.render("student1.ejs")
})

app.get("/student2", authorizeToken, authorizeRole(["student2", "teacher", "admin"]), async (req, res) => {
  res.render("student2.ejs")
})

app.get("/teacher", authorizeToken, authorizeRole(["teacher", "admin"]), async (req, res) => {
  const users = await getAllStudents()
  res.render("teacher.ejs", { users: users })
})

app.get("/student", authorizeToken, authorizeRole(["student", "teacher", "admin"]), async (req, res) => {
  res.render("student.ejs")
})

app.get("/admin", authorizeToken, authorizeRole(["admin"]), async (req, res) => {
  const users = await getAllUsers()
  res.render("admin.ejs", { users: users })
})


app.get("/", authorizeToken, (req, res) => {
  res.render("start.ejs")
})



// Dynamic route that responds to requests with the user's ID
app.get("/users/:userID", authorizeToken, async (req, res) => {
  const token = req.cookies.jwt
  const decryptedToken = jwt.verify(token, process.env.TOKEN_KEY)
  let user = await getUser(decryptedToken.name)
  user = user[0]

  if (req.params.userID !== decryptedToken.userID) {
    return res.status(401).redirect(`/users/${user.userID}`)
  }

  res.render("profile.ejs", { name: user.name, role: user.role })
  return
})


///////////////////////////////////
///////////////////////////////////
// POST METHODS

// register new user
app.post("/register", async (req, res) => {

  const { name, role, password } = req.body
  let userInDB = await userExists(name)

  if (!userInDB && password != " ") {
    let id = await generateId()
    try {
      const encryptedPwd = await bcrypt.hash(password, 10)
      await createUser(id, name, role, encryptedPwd)
    }
    catch {
      req.method = "GET"
      res.redirect("/register")
      return
    }
  }
  else {
    req.method = "GET"
    res.redirect("/register")
    return
  }
  req.method = "GET"
  res.redirect("/identify")
})


// login user
app.post("/identify", async (req, res) => {

  const { name, password } = req.body
  let userInDB = await userExists(name)

  const encryptedPwd = await bcrypt.hash(password, 10)

  if (userInDB) {
    let user = await getUser(name)
    user = user[0]
    try {
      if (await bcrypt.compare(password, user.password)) {

        const userIn = {
          userID: user.userID,
          name: user.name,
          role: user.role
        }
        const token = jwt.sign(userIn, process.env.TOKEN_KEY)
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 }).status(200)

        req.method = "GET"
        res.redirect(`/users/${user.userID}`)

        return

      } else {
        res.status(401).render("fail.ejs")
        return
      }

    } catch (error) {
      console.log(error)
      res.status(401).render("fail.ejs")
      return
    }
  }
  res.status(401).render("fail.ejs")
})


///////////////////////////////////
// logout and all other routes

app.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.method = "GET"
  res.redirect("/identify");
});


app.all("*", (req, res) => { res.status(404).render("error.ejs") })


///////////////////////////////////
///////////////////////////////////
// Server listening
app.listen(process.env.PORT, async () => {
  databaseSetup()
  console.log("Server listening on PORT " + process.env.PORT)
})


///////////////////////////////////
///////////////////////////////////
// Auth functions
async function getUserFromToken(req) {
  const token = req.cookies.jwt
  const decryptedToken = jwt.verify(token, process.env.TOKEN_KEY)
  let user = await getUser(decryptedToken.name)
  user = user[0]
  return user
}


function authorizeRole(requiredRoles) {
  return async (req, res, next) => {
    try {
      const user = await getUserFromToken(req)
      if (requiredRoles.includes(user.role)) {
        next()
      } else {
        res.status(401).redirect("/identify")
      }
    }
    catch (error) {
      console.log(error)
      res.status(401).redirect("/identify")
    }
  }
}


function authorizeToken(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    // 401 - unauthorized
    return res.status(401).redirect("/identify");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    // 403 - forbidden
    return res.status(403).redirect("/identify");
  }
}

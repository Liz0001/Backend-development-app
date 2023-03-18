///////////////////////////////////
// server setup etc
const { setupDB } = require("./db/dbSetup.js")
const { checkDatabase, getAllUsers, userExists, createUser, generateId } = require("./db/database.js")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const express = require("express")
const app = express()

// .env file access for token
require("dotenv").config()

// for ejs view files to render
app.set("view-engine", "ejs")

///////////////////////////////////
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body)
  next()
})

// body-parser and/or cookie-parser?? ...
// app.use(cookieParser());

let currentKey = ""
let currentPassword = ""


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



// app.use("/student1", authenticateUser, authorizeStudent, studentRoute1)
// app.use("/student2", authenticateUser, authorizeStudent, studentRoute2)
// app.use("/teacher", authenticateUser, authorizeTeacher, teacherRoute)
// app.use("/admin", authenticateUser, authorizeAdmin, adminRoute)



app.post("/identify", (req, res) => {
  const username = req.body.password
  const token = jwt.sign(username, process.env.SECRET_ACESS_TOKEN)
  currentKey = token
  currentPassword = username
  res.redirect("/granted")
})

app.get("/granted", authenticateToken, (req, res) => {
  res.render("start.ejs")
})




app.get("/student1", (req, res) => {
  res.render("student1.ejs")
})

app.get("/student2", (req, res) => {
  res.render("student2.ejs")
})

app.get("/teacher", (req, res) => {
  res.render("teacher.ejs")
})

app.get("/admin", async (req, res) => {
  let users = await getAllUsers()
  res.render("admin.ejs", {
    users: users
  })
})






///////////////////////////////////
///////////////////////////////////
// POST METHODS
app.post("/register", async (req, res) => {

  const { name, role, password } = req.body
  let userInDB = await userExists(name, role)
  let id = await generateId()
  console.log("userInDB", userInDB)
  if (!userInDB && password != " ") {
    try {
      const encryptedPwd = await bcrypt.hash(password, 10)
      await createUser(id, name, role, encryptedPwd)
      console.log("Yeei")
    }
    catch {
      console.log("Here")
      req.method = "GET"
      res.redirect("/register")
      return
    }

  } else {
    req.method = "GET"
    res.redirect("/register")
    return
  }
  req.method = "GET"
  res.redirect("/identify")
})


// TODO:  login
app.post("/identify", async (req, res) => {
  const username = req.body.username
  const pass = req.body.password
  let userInDB = await isUserInDatabase(username)

  if (userInDB && pass != ' ') {
    let dbEncryption = await getPwd(username)

    if (await bcrypt.compare(pass, dbEncryption)) {

      const user = { user: username }
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

      console.log("Token:", accessToken)
      // res.json({ accessToken: accessToken })

      req.method = "GET"
      res.redirect(`/start/${username}`)
      return

    } else {

      res.status(401).render("fail.ejs")
      return
    }
  }

  res.status(401).render("fail.ejs")
})


///////////////////////////////////
///////////////////////////////////
// Server listening
app.listen(process.env.PORT, async () => {
  // setupDB()
  // checkDatabase()
  console.log("Server listening on PORT " + process.env.PORT)
})



///////////////////////////////////
///////////////////////////////////
// functions and other
function authenticateToken(req, res, next) {

  if (currentKey == "")
    res.redirect("/identify")
  else if (jwt.verify(currentKey, process.env.SECRET_ACESS_TOKEN))
    next()
  else
    res.redirect("/identify")
}


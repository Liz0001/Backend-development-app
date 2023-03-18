///////////////////////////////////
// server setup etc
const { setupDB } = require("./db/dbSetup.js")
const { checkDatabase, getAllUsers } = require("./db/database.js")

const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

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

// body-parser and/or cookie-parser??
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

// admin
app.get("/admin", async (req, res) => {

  let users = await getAllUsers()
  // console.log(users)
  res.render("admin.ejs", {
    users: users
  })
})

// app.use("/student1", authenticateUser, authorizeStudent, studentRoute1)
// app.use("/student2", authenticateUser, authorizeStudent, studentRoute2)
// app.use("/teacher", authenticateUser, authorizeTeacher, teacherRoute)
// app.use("/admin", authenticateUser, authorizeAdmin, adminRoute)

// app.use("/student1", studentRoute1)
// app.use("/student2", studentRoute2)
// app.use("/teacher", teacherRoute)


// app.use("/identify", identifyRoute)
// app.use("/granted", grantedRoute)


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










///////////////////////////////////
// Server listening
app.listen(process.env.PORT, async () => {
  // setupDB()
  // checkDatabase()
  console.log("Server listening on PORT " + process.env.PORT)
})





///////////////////////////////////
// functions
function authenticateToken(req, res, next) {

  if (currentKey == "")
    res.redirect("/identify")
  else if (jwt.verify(currentKey, process.env.SECRET_ACESS_TOKEN))
    next()
  else
    res.redirect("/identify")

}
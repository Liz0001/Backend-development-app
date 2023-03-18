///////////////////////////////////
// server setup etc
const { setupDB } = require("./db/dbSetup.js")
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
// const cookieParser = require('cookie-parser');

// ...


const { authorizeAdmin, authorizeTeacher, authorizeStudent } = require("./basicAuth")

const studentRoute1 = require("./routes/student1.js")
const studentRoute2 = require("./routes/student2.js")
const teacherRoute = require("./routes/teacher.js")
const adminRoute = require("./routes/admin.js")

// const identifyRoute = require("./routes/identify.js")
// const grantedRoute = require("./routes/granted.js")



// .env file access 
require("dotenv").config()

// for ejs view files to render
// app.set('views', './src/views');
app.set("view-engine", "ejs")

///////////////////////////////////
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body)
  next()
})

// body-parser ??
// cookie-parser ??


app.get("/", (req, res) => {
  res.redirect("/identify")
})



// app.use("/student1", authenticateUser, authorizeStudent, studentRoute1)
// app.use("/student2", authenticateUser, authorizeStudent, studentRoute2)
// app.use("/teacher", authenticateUser, authorizeTeacher, teacherRoute)
// app.use("/admin", authenticateUser, authorizeAdmin, adminRoute)

app.use("/student1", studentRoute1)
app.use("/student2", studentRoute2)
app.use("/teacher", teacherRoute)
app.use("/admin", adminRoute)


// app.use("/identify", identifyRoute)
// app.use("/granted", grantedRoute)


let currentKey = ""
let currentPassword = ""


app.get("/identify", (req, res) => {
  res.render("identify.ejs")
})


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










app.listen(process.env.PORT, async () => {
  // setupDB()
  console.log("Server listening on PORT " + process.env.PORT)
})





///////////////////////////////////

function authenticateToken(req, res, next) {

  if (currentKey == "")
    res.redirect("/identify")
  else if (jwt.verify(currentKey, process.env.SECRET_ACESS_TOKEN))
    next()
  else
    res.redirect("/identify")

}
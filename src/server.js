///////////////////////////////////
// server setup
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

// .env file access 
require("dotenv").config()

// for ejs view files to render
app.set('views', './src/views');
app.set("view-engine", "ejs")

// for bcrypt and JSON
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


let currentKey = ""
let currentPassword = ""


app.get("/", (req, res) => {
  res.redirect("/identify")
})


app.post("/identify", (req, res) => {
  const username = req.body.password
  const token = jwt.sign(username, process.env.SECRET_ACESS_TOKEN)
  currentKey = token
  currentPassword = username
  res.redirect("/granted")
})


app.get("/identify", (req, res) => {
  res.render("identify.ejs")
})


app.get("/granted", authenticateToken, (req, res) => {
  res.render("start.ejs")
})


app.listen(process.env.PORT, () => {
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
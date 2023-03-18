const express = require("express")
const router = express.Router()

require("dotenv").config()


router.get("/", (req, res) => {
  res.render("student1.ejs")

})


module.exports = router
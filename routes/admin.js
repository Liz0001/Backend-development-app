const express = require("express")
const router = express.Router()

require("dotenv").config()


router.get("/", (req, res) => {
  res.render("admin.ejs")
})


module.exports = router
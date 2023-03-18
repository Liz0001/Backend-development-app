const express = require("express")
const router = express.Router()

require("dotenv").config()


router.get("/", (req, res) => {
  res.render("student2.ejs")

})


module.exports = router
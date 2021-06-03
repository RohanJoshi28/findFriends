var express = require('express');
var fs = require("fs");
var router = express.Router();

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
})

/* GET users listing. */
router.get('/:person', function(req, res, next) {
  var person = req.params.person;
  var bio = user_data[person].Bio;
  var phone = user_data[person].Phone;
  
  res.render("users", {name: person, bio: bio, phone: phone});
});

module.exports = router;

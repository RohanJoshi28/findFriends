var express = require("express");
var router = express.Router(); 

router.get('/', function(req, res, next){
    //render login page where user can login
    res.render("login", {invalid: false});
});

module.exports=router;
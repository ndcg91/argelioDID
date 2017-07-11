var express = require("express");
var router = express.Router();
var authentication = require("../../helpers/authentication.js");





/*======================================
=            GENERAL ROUTES            =
======================================*/

router.get("/", (req,res) => res.render("login_register") )
router.get("/template", (req, res) => res.render("template") )

/*=====  End of GENERAL ROUTES  ======*/



/*===========================================================
=            LOGIN AND LOGIN CONFIRMATION ROUTES            =
===========================================================*/
router.post("/login", authentication.login)
router.post("/register/resend/link", authentication.resendActivation)
router.get("/registration/completed", (req,res) => res.render("registration_check_email"))
router.get("/register/:token", authentication.confirmRegister)
router.post("/reset", authentication.reset)
router.get("/forgot/:id", authentication.forgot)
/*=====  End of LOGIN AND LOGIN CONFIRMATION ROUTES  ======*/






module.exports = router;

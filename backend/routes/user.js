const express = require('express');
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const UserController = require("../controllers/user");
const router = express.Router();


router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("", UserController.userGetAll);

router.delete("", UserController.userDelete);

module.exports = router;

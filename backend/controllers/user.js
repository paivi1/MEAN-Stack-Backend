const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
          message: "Invalid authentication credentials!",
          originalError: err
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    console.log(user);
    if(!user) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {

    if(!result) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    const token = jwt.sign({email:fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_KEY, {expiresIn: "1h"});
    res.status(200).json({
      token: token,
      expiresIn: "3600", // Duration in seconds
      userId: fetchedUser._id
    })
  })
  .catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!",
      error: err
    });
  });
}

exports.userDelete = (req, res, next) => {
  User.deleteOne({email: req.body.uemail})
  .then(result => {
    console.log(result);
    res.status(200).json({message: "User deleted"});
  });
}

exports.userGetAll = (req, res, next) => {
  User.find()
  .then(users => {
    if(!user) {
      return res.status(404).json({
        message: "No users"
      });
    }
    res.status(200).json({
      response: users
    });
  })
}

const path = require('path') // Allows us to construct safe & correct paths
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user")

mongoose.connect("mongodb+srv://ryuji:" + process.env.MONGO_ATLAS_PW + "@cluster0.opz9d.mongodb.net/MEANStackLearning?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to Database');
  console.log("Ryuji Process Env MONGO_ATLAS_PW=" + process.env.MONGO_ATLAS_PW);
})
.catch(() => {
  console.log('Connection Failed');
  console.log("Ryuji Process Env MONGO_ATLAS_PW=" + process.env.MONGO_ATLAS_PW);
})

const app = express();
//Cluster access user : ryuji
//Cluster access pwd : fSkqLnJtS6CM0Mwm

app.use(bodyParser.json()); // Process using json parser before moving forward
app.use(bodyParser.urlencoded({ extended: false })); // parse urlencoded data
app.use("/images", express.static(path.join("images"))); // requests targetting '/images' will be routed to 'backend/images'. Once again, path is relative to 'server.js'

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Note: Adding our created 'authorization' header capitalized as it is case insensitive
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT,  DELETE, OPTIONS")
  next();
})


app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;

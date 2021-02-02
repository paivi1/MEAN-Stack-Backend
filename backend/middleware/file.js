const multer = require("multer");

const MIME_TYPE_MAP = { // Since we filter on the frontend form, we should only receive these three MIME types
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

// Where to store things and how to store them
const storage = multer.diskStorage({ // Configure storage options
  destination: (req, file, cb) => { // Function fires whenever multer tries to save a file
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid MIME type");
    if(isValid) { // If not a valid MIME type, the map above should return null (as it isn't in the map)
      error = null;
    }
    cb(error, "images") // Seen relative to the SERVER file (server.js)
  },
  filename: (req, file, cb) => {
    console.log("Name: " + file.originalname);
    const name = file.originalname.toLowerCase().split(' ').join('-'); // Normalize name (That we passed when calling through post.service using the title)
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext); // Ex 'myImage-1640123.jpg'
  }
});

module.exports = multer({storage: storage}).single("image");

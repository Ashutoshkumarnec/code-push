const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./storage",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.body.app}_${req.body.platform}_${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });
module.exports = upload;

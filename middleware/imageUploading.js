const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    return cb(new Error("Only image files are accepted!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "nigerianmb",
  api_key: "525649129531963",
  api_secret: "QMdrtHjmqK7lIUq1IkNWeuGtydA",
});

module.exports = {
  upload,
  cloudinary,
};

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { errorResponse } = require("../utils/response");
exports.multerStorage = (destination, allowedTypes = /jpg|jpeg| png |webp/) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const uniq = Date.now() * Math.floor(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniq}${ext}`);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed !!"));
    }
  };

  const uploader = multer({
    storage,
    limits: {
      fileSize: 512_000_000, // 5 mb
    },
    fileFilter,
  });

  return uploader;
};

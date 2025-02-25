const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const postController = require("../controllers/postController");
const multer = require("multer");
const path = require("path");


// Set up Multer for image uploads
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Images will be saved in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// File filter to allow only JPG and PNG
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG files are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Define routes
router.post("/", authMiddleware,upload.single("image"), postController.createPost);
router.get("/", authMiddleware ,postController.getAllPosts);
router.post("/:id/like", authMiddleware, postController.likeUnlikePost);
router.post("/:id/unlike", authMiddleware, postController.unlikePost);

module.exports = router;

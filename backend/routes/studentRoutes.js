const express = require("express");
const router = express.Router();
const { createStudent, getStudents, updateStudentStatus, checkDuplicate } = require("../controllers/studentController");

router.post("/", createStudent);
router.get("/", getStudents);
router.post("/check-duplicate", checkDuplicate);
router.patch("/:id/status", updateStudentStatus);

module.exports = router;

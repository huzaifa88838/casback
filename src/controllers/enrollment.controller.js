// controllers/paymentController.js
import Enrollment from "../models/enrollement.model.js";

export const enrollStudent = async (req, res) => {
  let { studentId, instructorId, paymentMethod } = req.body;

  try {
    // 🔁 Parse if studentId is string
    if (typeof studentId === "string") {
      studentId = JSON.parse(studentId);
    }

    const enrollment = new Enrollment({
      studentId,         // Now proper object
      instructorId,
      paymentMethod
    });

    await enrollment.save();
    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ error: "Enrollment failed" });
  }
};

export const getAllEnrolledStudents = async (req, res) => {
  try {
    const { instructorId } = req.query;

    if (!instructorId) {
      return res.status(400).json({ error: "instructorId is required" });
    }

    const enrollments = await Enrollment.find({ instructorId });  // ❌ REMOVE .populate()
    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error in getAllEnrolledStudents:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};
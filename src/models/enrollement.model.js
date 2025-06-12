// models/Enrollment.js
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
 studentId: {
    type: Object,  // ✅ Pure object store karna ho to type: Object
    required: true,
  },
  instructorId: String,
  paymentMethod: String,
  timestamp: { type: Date, default: Date.now }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;

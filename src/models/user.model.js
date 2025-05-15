import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String, // Store image URL
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Educational Background
    qualification: { type: String, required: false },
    university: { type: String, required: false },
    graduationYear: { type: Number, required: false },
    specialization: { type: String, required: false },

    // Professional Information
    experience: { type: String, required: false },
    subjects: [{ type: String }], // List of subjects
    teachingLevel: [{ type: String }], // E.g. Primary, Secondary, College
    previousInstitutions: [{ type: String }],
    references: [{ type: String }],

    // Teaching Preferences
    availableTimings: [{ type: String }], // E.g. Morning, Evening
    // preferredMode: {
    //   type: String,
    //   enum: ["Online", "Physical", "Both"],
    //   required: false,
    // },
    expectedSalary: { type: String, required: false },
    teachingMethodology: { type: String, required: false },

    // Documents
    cnicFront: { type: String, required: false },
    cnicBack: { type: String, required: false },
    lastDegree: { type: String, required: false },

    // Additional Information
    languages: [{ type: String }],
    skills: [{ type: String }],
    achievements: [{ type: String }],
    isApproved: {
        type: Boolean,
        default: false // 👈 By default, user will be pending
    },

    // Watch History
  

    // Authentication
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check Password
userSchema.methods.ispasswordcorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateaccesstoken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
userSchema.methods.generaterefreshtoken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);

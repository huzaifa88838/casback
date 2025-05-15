import mongoose, { Schema } from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
    },
    thumbnail: {
      type: String, // Thumbnail image URL
      required: false,
    },
    price: {
      type: Number,
      required: false,
      default: 0, // By default, free course
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
    whatYouWillLearn: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model for user references
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    courseType: {
      type: String,
      enum: ["Video", "Online", "InPerson"],
      required: true,
    },
    videoFile: {
      type: String, // File URL
    },
    classTime: {
      type: String, // Example: "6 PM to 7 PM"
    },
    classDaysPerWeek: {
      type: String, // Example: "3 days/week"
    },
    courseDuration: {
      type: String, // Example: "2 months"
    },
    inPersonDetails: {
      type: String, // e.g., "Classes will be held at ABC Academy, Lahore"
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);

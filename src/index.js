import dotenv from 'dotenv';
import connectdb from './db/index.js';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import messageModel from './models/message.model.js';
import lunr from "lunr"
import fs from "fs"
import multer from 'multer';

dotenv.config({ path: './.env' });

const userSocketMap = {}; // 🔐 userId → socket.id

connectdb()
  .then(() => {
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "https://azadealfrontend.vercel.app", 
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    console.log("✅ MongoDB connected");

    io.on("connection", (socket) => {
      console.log("🔗 User connected:", socket.id);

      // ✅ Register user with userId
      socket.on("register", (userId) => {
        userSocketMap[userId] = socket.id;
        console.log(`✅ Registered user ${userId} with socket ${socket.id}`);
      });

      // ✉️ Private Message Handling
      socket.on("sendMessage", async ({ senderId, receiverId, message, fileUrl }) => {
        try {
          const newMessage = new messageModel({
            senderId,
            receiverId,
            message,
            fileUrl // store file URL
          });
      
          const savedMessage = await newMessage.save();
      
          const receiverSocketId = userSocketMap[receiverId];
          const senderSocketId = userSocketMap[senderId];
      
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", savedMessage);
          }
      
          if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", savedMessage);
          }
      
        } catch (error) {
          console.error("❌ Error saving message:", error);
        }
      });
      

      // 🔌 Handle disconnect
      socket.on("disconnect", () => {
        console.log("🚪 User disconnected:", socket.id);
        // Cleanup: remove from userSocketMap
        for (const userId in userSocketMap) {
          if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            break;
          }
        }
      });
    });

    const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public');  // Define the folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Ensure unique file names
  }
});

// Set up multer upload middleware to handle single image uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // Limit file size to 10MB
}).single('image');  // 'image' is the name of the file input field in the frontend


    const content = fs.readFileSync("knowledge.txt", "utf-8");
const docs = content.split(".").map((t, i) => ({ id: i, content: t.trim() }));

const index = lunr(function () {
  this.ref("id");
  this.field("content");
  docs.forEach((doc) => this.add(doc));
});

// API to receive chat queries
app.post("/chat",upload, (req, res) => {
   const query = req.body.message.toLowerCase();
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;  // URL of the uploaded file if present

  // Check if the message contains an image and keywords like "scam", "fraud", or "report"
  if (fileUrl && (query.includes("scam") || query.includes("fraud") || query.includes("report"))) {
    return res.json({
      reply: "✅ We have received your scam report. Our support team will review the attached image and take appropriate action. Thank you for helping us stay safe.",
      imageUrl: fileUrl  // Return the image URL in the response
    });
  }
  // Greeting handling
  const greetings = ["hello", "hi", "hey","hy","kese ho" ,"hola", "good morning", "good evening"];
  if (greetings.some((greeting) => query.includes(greeting))) {
    return res.json({ reply: "Hello! Please let me know your issue or question, and I’ll assist you." });
  }

  // Course-related queries
  const courseKeywords = ["courses", "offer", "course categories"];
  if (courseKeywords.some((keyword) => query.includes(keyword))) {
    return res.json({ reply: "We offer online courses in over 30 categories, including Web Development, Python, Data Science, Digital Marketing, Graphic Design, and many more." });
  }

  // About Azad Education (custom handling)
  
    // About Azad Education (custom handling)
// About Azad Education (custom handling)
if (
  query.includes("about azad education") ||
  query.includes("what is azad education") ||
  query.includes("tell me about azad education") ||
  query.includes("azad education ke bare mein batao") ||
  query.includes("azad education kya hai") ||
  query.includes("azad education kya cheez hai") ||
  (query.includes("azad education") && query.includes("batao")) // 👈 ye line parantheses mein hona chahiye
) {
  return res.json({
    reply: `Azad Education is a leading platform offering professional courses in over 30 categories including Web Development, Python, Data Science, Digital Marketing, and more. We aim to empower students and professionals across 250 cities with access to high-quality, flexible, and affordable education. Our platform hosts expert instructors, real-world projects, certifications, and live mentorship sessions. Whether you're starting out or upgrading your skills — Azad Education supports your learning journey.`
  });
}

const q = query.toLowerCase(); // safer short form

if (
  q.includes("buy") ||
  q.includes("purchase") ||
  q.includes("kaise kharide") ||
  q.includes("kharidna") ||
  q.includes("kaise buy karo") ||
  q.includes("how to buy") ||
  q.includes("how can i buy") ||
  q.includes("kese buy karo") ||
  q.includes("course buy karna hai") ||
  q.includes("course kharidna hai")
) {
  return res.json({
    reply: `To buy a course on Azad Education:\n1. Login to your account.\n2. Browse or search for the course you want (e.g., Physics).\n3. Click on the course to open its details page.\n4. Click the "Buy Now" button.\n5. Complete the payment process securely.\n\nOnce purchased, the course will appear in your dashboard under "My Courses".`
  });
}

// Course recommendation handling
if (
  query.includes("recommend") ||
  query.includes("suggest") ||
  query.includes("recommendation") ||
  query.includes("suggestion") ||
  query.includes("koi course") ||
  query.includes("course batao") ||
  query.includes("course recommend karo") ||
  query.includes("konsa course") ||
  query.includes("course chahiye")
) {
  return res.json({
    reply: `Here are some top course recommendations:\n\n🧑‍💻 **Web Development (Full Stack)** – Perfect for beginners who want to build websites & apps.\n📊 **Data Science with Python** – Ideal for those interested in data, AI, and analytics.\n📱 **Digital Marketing** – Best for students and professionals looking to grow a business online.\n💡 **Graphic Design** – Learn designing with tools like Photoshop, Illustrator.\n\nLet me know your interest area (e.g., coding, design, business) and I’ll personalize more!`
  });
}


// Lunr fallback
const results = index.search(query);
if (results.length > 0) {
  const match = docs.find((doc) => doc.id == results[0].ref);
  return res.json({ reply: match.content });
} else {
  return res.json({ reply: "Hello! Please let me know your issue or question, and I’ll assist you." });
}

})


    server.listen(5000, '0.0.0.0', () => {
      console.log("🚀 Server running on port", 5000);
    });
  

  })
  .catch((err) => {
    console.log("❌ Error:", err);
  });



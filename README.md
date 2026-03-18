🚀 InterviewSense

An AI-powered mock interview platform that helps users practice, improve, and analyze their interview performance.

📌 Overview

InterviewSense is a smart web application designed to simulate real interview experiences. It uses AI to ask dynamic questions, analyze responses, and provide feedback to improve confidence, communication, and technical skills.

This project focuses on helping students and job seekers prepare effectively for interviews through interactive and intelligent practice sessions.

✨ Features

🎤 AI Mock Interviews – Simulates real-time interview scenarios

🧠 Smart Question Generation – Questions based on skills/topics

📊 Performance Analysis – Feedback on answers and communication

💬 Behavioral & Technical Questions – Covers multiple interview types

📈 Progress Tracking – Track improvement over time

🌐 Responsive UI – Works across devices

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Backend

Firebase

Authentication

Firestore Database

Hosting

AI / Logic

AI-based question generation

Response evaluation system

📂 Project Structure
InterviewSense/
│
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Main pages
│   ├── firebase/       # Firebase config
│   ├── utils/          # Helper functions
│
├── public/             # Static assets
├── package.json
├── vite.config.js
└── README.md
⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/dharshuvani13-source/InterviewSense.git
cd InterviewSense
2. Install Dependencies
npm install
3. Setup Firebase

Create a Firebase project

Enable Authentication & Firestore

Add your Firebase config in:

// src/firebase/config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
4. Run the Project
npm run dev

App will run at:
👉 http://localhost:5173

🚀 Deployment (Firebase Hosting)
npm run build
firebase login
firebase init
firebase deploy
🎯 Use Case

Students preparing for placements

Freshers practicing interview skills

Developers improving communication

Anyone preparing for job interviews

📸 Screenshots (Add Later)

Home Page

Interview Page

Feedback Dashboard

🤝 Contributing

Contributions are welcome!

Fork the repo

Create a new branch

Make changes

Submit a Pull Request

📜 License

This project is open-source and available under the MIT License.

👨‍💻 Author

Dharshu
GitHub: https://github.com/skillQuanta

💡 Future Improvements

Voice-based interviews

AI emotion detection

Resume-based question generation

Real-time speech analysis

⭐ Support

If you like this project, give it a ⭐ on GitHub!

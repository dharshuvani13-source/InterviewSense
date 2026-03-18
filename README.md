

# 🚀 InterviewSense

**Practice interviews smarter, not harder.**

---

## 📖 About the Project

InterviewSense is a simple and practical web app built to help people prepare for interviews with more confidence. Instead of just reading questions, users can actually *experience* a mock interview environment.

The idea is straightforward:
give users realistic questions, let them respond, and help them understand how they can improve.

It’s especially useful for students, freshers, and anyone getting ready for placements or job interviews.

---

## ✨ What It Does

* Simulates mock interviews in a simple, user-friendly way
* Generates questions based on skills or topics
* Helps users reflect on their answers
* Covers both technical and HR-style questions
* Tracks progress over time
* Works smoothly on both desktop and mobile

---

## 🛠️ Built With

* **React (Vite)** for a fast and modern frontend
* **Tailwind CSS** for clean and responsive UI
* **Firebase** for backend services

  * Authentication
  * Firestore Database
  * Hosting

---

## 📂 Project Structure

```bash
InterviewSense/
│
├── src/
│   ├── components/     # Reusable UI parts
│   ├── pages/          # Main screens
│   ├── firebase/       # Firebase setup
│   ├── utils/          # Helper logic
│
├── public/
├── package.json
└── vite.config.js
```

---

## ⚙️ Getting Started

### 1. Clone the project

```bash
git clone https://github.com/dharshuvani13-source/InterviewSense.git
cd InterviewSense
```

### 2. Install dependencies

```bash
npm install
```

### 3. Connect Firebase

Create a Firebase project and enable Authentication + Firestore.

Then add your config:

```js
// src/firebase/config.js
const firebaseConfig = {
  apiKey:"YOUR_API_KEY",
  authDomain:"YOUR_DOMAIN",
  projectId:"YOUR_PROJECT_ID",
  appId:"YOUR_APP_ID"
};
```

---

### 4. Run the app

```bash
npm run dev
```

Open:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment

```bash
npm run build
firebase login
firebase init
firebase deploy
```

---

## 🎯 Why This Project

Preparing for interviews can feel overwhelming.
InterviewSense tries to make it easier by giving a space to practice, make mistakes, and improve — without pressure.

---

## 🔮 What’s Next

* Voice-based interviews
* Smarter AI feedback
* Resume-based questions
* Better analytics dashboard

---

## 🤝 Contributing

If you have ideas or improvements, feel free to contribute.
Small changes are welcome too.

---

## 👨‍💻 Author

**Dharshini**
GitHub: [https://github.com/skillQuanta](https://github.com/skillQuanta)

---

## ⭐ Support

If you found this useful, consider giving it a star ⭐



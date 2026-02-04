# 🚀 Job Application Tracker - Complete Project

A **production-ready, full-stack job application tracking system** built with React, Node.js, Express, and MongoDB. Perfect for managing your job search efficiently and impressing recruiters.

## 📸 Features

### ✅ Phase 1 - Core Features (Live)
- **User Authentication** - Register/Login with JWT
- **Job Management** - Add, edit, delete job applications
- **Dashboard** - Real-time stats and analytics
- **Kanban Board** - Drag-and-drop status updates
- **Search & Filter** - Find applications by company, role, status
- **Responsive Design** - Works on desktop and mobile

### 🔥 Phase 2 - Advanced Features (NEW)
- **Interview Scheduling** - Schedule and track interviews
- **Upcoming Reminders** - See next interviews at a glance
- **Advanced Analytics** - Interview rate, offer rate, conversion metrics
- **CSV Import/Export** - Bulk import from spreadsheets, export data
- **Dark Mode** - Eye-friendly UI toggle
- **Email Notifications** (Ready - needs Gmail config)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool (fast)
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React DnD** - Drag & drop
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Server framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free)
- npm or yarn

### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB connection string and JWT secret to .env
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your-secret-key

# Start server
npm run dev
```

Server runs on `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs on `http://localhost:3000`

---

## 📖 How to Use

### 1. Create Account
- Sign up at `http://localhost:3000/register`
- Add your email and password

### 2. Add Job Applications
- Click "Add Application" on Jobs page
- Fill in company, role, date applied, etc.

### 3. Track Progress
- **Dashboard** - See stats (total, interviews, offers)
- **Jobs** - Manage all applications
- **Kanban** - Drag cards between status columns
- **Interviews** - Schedule interview dates

### 4. Analytics
- View interview rate, offer rate
- See application status breakdown
- Track conversion metrics

### 5. Export/Import
- Export to CSV for backup
- Import bulk applications from spreadsheet

---

## 📊 Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### JobApplication
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  company: String,
  role: String,
  link: String,
  location: String,
  appliedDate: Date,
  status: ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
  notes: String,
  createdAt: Date
}
```

### Interview (NEW)
```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref: JobApplication),
  userId: ObjectId (ref: User),
  type: ['Phone Screen', 'Technical', 'Onsite', 'System Design', 'HR'],
  date: Date,
  time: String,
  meetingLink: String,
  location: String,
  interviewer: String,
  notes: String,
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Job Applications
```
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
GET    /api/jobs/stats
GET    /api/jobs/export/csv
POST   /api/jobs/import/csv
```

### Interviews
```
GET    /api/interviews
GET    /api/interviews/upcoming
POST   /api/interviews
PUT    /api/interviews/:id
DELETE /api/interviews/:id
```

---

## 🎨 Folder Structure

```
project/
├── backend/
│   ├── config/              # Database config
│   ├── controllers/         # Business logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── utils/               # Email, helpers
│   ├── server.js            # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # State management
    │   ├── pages/           # Page components
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🔐 Security Features

✅ JWT-based authentication  
✅ Password hashing with bcryptjs  
✅ Protected routes  
✅ Input validation & sanitization  
✅ CORS enabled  
✅ Environment variables  
✅ User authorization checks  

---

## 📈 Key Metrics Tracked

- **Total Applications** - Count of all applications
- **Interview Rate** - (Interviews / Total) %
- **Offer Rate** - (Offers / Total) %
- **Rejection Rate** - (Rejections / Total) %
- **Application Status** - Breakdown by status
- **Upcoming Interviews** - Next 10 interviews

---

## 🚀 Deployment

### Frontend
```bash
cd frontend
npm run build
```

### Backend (Render)
```bash
# Push to GitHub
# Connect to Render
# Set environment variables
# Deploy
```

---

## 🎓 Interview Talking Points

> "I built a full-stack job application tracking system using React, Node.js, Express, and MongoDB. It features JWT authentication, Kanban workflow visualization with drag-and-drop, comprehensive statistics dashboard, and interview scheduling. The application is production-ready with input validation, error handling, and scalable architecture."

### System Design Discussion
- Explain architecture (3-tier)
- Database schema design
- API design (RESTful)
- Authentication flow (JWT)
- Scalability considerations

### Technical Skills Demonstrated
- Full-stack development
- Database design & ODM
- REST API design
- Frontend state management
- Authentication & security
- Responsive UI/UX
- Git & version control

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify IP whitelist in MongoDB Atlas
- Check connection string in .env
- Ensure network access enabled

### CORS Errors
- Verify frontend URL in backend CORS config
- Check proxy settings in vite.config.js

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📝 Future Enhancements

🔹 Email reminders for follow-ups  
🔹 Google Calendar integration  
🔹 Browser extension  
🔹 Resume version tracking  
🔹 Interview notes/questions  
🔹 Salary negotiation tracker  
🔹 Feedback collection  
🔹 Advanced search filters  
🔹 Mobile app (React Native)  
🔹 Real-time notifications  

---

## 📜 License

MIT

---

## 🤝 Contributing

Pull requests welcome! This is your personal project but great for portfolio.

---

## 📞 Support

For issues or questions, check the logs:
```bash
# Backend logs
npm run dev

# Frontend logs
npm run dev
```

---

**Built with ❤️ for your job search success!** 🚀

Ready for production and interviews!

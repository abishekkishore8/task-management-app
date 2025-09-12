# 📋 TaskFlow - Task Management Application

A beautiful and intuitive task management application built with modern web technologies. Organize your tasks efficiently with a clean, user-friendly interface.

## ✨ Features

### 🔐 Authentication
- ✅ User Registration & Login
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based session management
- ✅ Protected routes and API endpoints

### 📝 Task Management (Full CRUD)
- ✅ Create new tasks with title, description, and status
- ✅ View all tasks in a beautiful dashboard
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ Real-time status updates

### 🔍 Advanced Features
- ✅ Search tasks by title or description
- ✅ Filter tasks by status (All/Pending/Done)
- ✅ Combined search and filter functionality
- ✅ Pagination for better performance
- ✅ Responsive design for all devices

### 🎨 User Experience
- ✅ Beautiful animations and transitions
- ✅ Loading states and error handling
- ✅ Intuitive user interface
- ✅ Optimistic UI updates
- ✅ Clean, modern design

## 🛠️ Tech Stack

- Frontend: Next.js 14, React 18, Custom CSS
- Backend: Next.js API Routes
- Database: MongoDB with Mongoose ODM
- Authentication: NextAuth.js with JWT
- Data Fetching: React Query
- Deployment: Vercel + MongoDB Atlas

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB
- Git installed

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/task-management-app.git
cd task-management-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=YourAppName

# Authentication
NEXTAUTH_SECRET=your_very_secure_random_string_here
NEXTAUTH_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=another_very_secure_random_string_here
```

4. Run the development server
```bash
npm run dev
```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

| Variable        | Description                      | Example                                      |
| --------------- | -------------------------------| --------------------------------------------|
| MONGODB_URI     | MongoDB connection string       | mongodb+srv://user:pass@cluster.mongodb.net/dbname |
| NEXTAUTH_SECRET | Secret for NextAuth.js encryption | Random 32+ character string                 |
| NEXTAUTH_URL    | Your application URL            | http://localhost:3000                        |
| JWT_SECRET      | Secret for JWT token signing    | Random 32+ character string                  |

### 🔒 Generating Secure Secrets

Use the following commands to generate secure random strings:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

## 📁 Project Structure

```
task-management-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   └── tasks/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── tasks/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── AuthForm.js
│   ├── TaskForm.js
│   └── TaskList.js
├── lib/
│   ├── auth.js
│   ├── db.js
│   └── models.js
└── public/
```

## 🎯 API Endpoints

| Method | Endpoint               | Description                      |
|--------|------------------------|---------------------------------|
| POST   | /api/register          | User registration               |
| POST   | /api/auth/[...nextauth]| Authentication                  |
| GET    | /api/tasks             | Get tasks (with search/filter/pagination) |
| POST   | /api/tasks             | Create new task                 |
| PUT    | /api/tasks/[id]        | Update task                    |
| DELETE | /api/tasks/[id]        | Delete task                    |

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Deploy to Vercel
- Go to vercel.com
- Import your GitHub repository
- Add environment variables in Vercel dashboard
- Deploy!

### MongoDB Atlas Setup

- Create a new cluster in MongoDB Atlas
- Whitelist Vercel IP addresses (0.0.0.0/0 for all)
- Get your production connection string
- Update MONGODB_URI in Vercel environment variables

### Environment Variables for Production

Update these in your Vercel dashboard:

```env
MONGODB_URI=your_production_mongodb_connection_string
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
JWT_SECRET=your_production_jwt_secret
```

## 🎨 Customization

### Changing Colors and Styling

The app uses custom CSS with CSS variables. Modify the colors in `app/globals.css`:

```css
:root {
  --primary-color: #3b82f6;
  --danger-color: #ef4444;
  --success-color: #10b981;
  /* Add more variables as needed */
}
```

### Adding New Features

- New Task Fields: Update the Task model in `lib/models.js`
- Additional Filters: Modify the API route in `app/api/tasks/route.js`
- New Pages: Create new directories in the `app/` folder

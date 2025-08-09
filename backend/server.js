import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js'; // Import application routes
import errorHandler from './middleware/errorHandler.js';
import collegeRoutes from './routes/collegeRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';



const app = express();
const PORT = process.env.PORT || 3000;

// Connect database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to Internsaathi API');
});

// Use authentication routes
app.use('/api/auth', authRoutes);
// Use internship routes
app.use('/api/internships', internshipRoutes);
// Use application routes
app.use('/api/applications', applicationRoutes); 
// Use college routes
// This will handle college-related API requests
app.use('/api/colleges', collegeRoutes);
// Use company routes
// This will handle company-related API requests
app.use('/api/companies', companyRoutes);
// Use upload routes for image uploads
// This will handle image uploads to Cloudinary
app.use('/api/upload', uploadRoutes);

// Error handling middleware (MUST be last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

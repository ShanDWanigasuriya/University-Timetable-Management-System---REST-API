import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import studentRoute from './routes/studentRoute.js';
import facultyRoute from './routes/facultyRoute.js';
import adminRoute from './routes/adminRoute.js';
import loginRoutes from './routes/loginRoute.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoData = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

//connecting to database
mongoose.connect(mongoData)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api', loginRoutes);
app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use('/admin', adminRoute);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app;

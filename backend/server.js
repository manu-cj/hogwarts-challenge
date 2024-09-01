import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const mongo_user = process.env.MONGO_USER;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_db = process.env.MONGO_DB;
const mongo_app_name = process.env.MONGO_APP_NAME


const mongo_url = `mongodb+srv://${mongo_user}:${mongo_password}@cluster0.su39j.mongodb.net/${mongo_db}?retryWrites=true&w=majority&appName=${mongo_app_name}`
mongoose.connect(mongo_url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5173', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
import Routes from './routes/Routes.js'; 
Routes(app);


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});
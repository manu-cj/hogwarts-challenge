import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});
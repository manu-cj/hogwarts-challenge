import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';



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


const server = createServer(app); 


const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
  }
});


app.use(cors({
  origin: 'http://127.0.0.1:5173', // URL du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true // Autorise les cookies et les en-têtes d'autorisation
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
import Routes from './routes/Routes.js'; 
Routes(app);

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');


  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });

 


  socket.on('joinLobby', ({ lobby_id }) => {
    socket.join(lobby_id);
    console.log(`L'utilisateur a rejoint le lobby ${lobby_id}`);
    socket.emit('joinLobby', { lobby_id });
  });
});

export { io };


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cors({credentials: true, origin: process.env.FRONTEND_URI}));
app.use(cookieParser());
const spotify = require('./spotify');
app.use('/spotify', spotify);
console.log(process.env.SESSION_SECRET);
// app.use(express.static(path.resolve(__dirname, 'build')));

/*
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient(process.env.REDIS_URI);
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});
*/

/*
app.use(session({
  genid: (req) => {
    return uuidv4();
  },
  store : new RedisStore({host: 'localhost', port: 6379, client: redisClient}),
  name: 'redisDemoCookie',
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {secure: false, maxAge:1500000}, // cookie is set to secure:false and expires in five minutes for development only
  saveUninitialized: true
  })
);
*/
let pool = [];
let currentlyPlaying = null;
let timeStarted = null;


app.get('/api/pool', (req, res) => {
  res.json(pool);
})

app.get('/api/currentSong', (req, res) => {
  res.json(currentlyPlaying);
})

app.get('/api/elapsedTime', (req, res) => {
  const elapsedTime = Date.now() - timeStarted;
  res.json(elapsedTime);
})

app.delete('/api/songs/:id', (req, res) => {
  const id = req.params.id;
  songs = songs.filter(song => song.id !== id);
  res.status(204).end();
})

app.post('/api/pool', (req, res) => {
  const body = req.body;
  addSong(body);
  res.status(204).end();
})

function songEnded() {
  currentlyPlaying = pool.shift();
  console.log('next song', currentlyPlaying);
  if(currentlyPlaying){
    io.emit('play song', currentlyPlaying);
    setTimeout(songEnded, currentlyPlaying.duration);
  }
  else console.log('No song up next');
  io.emit('pool update', pool);
}

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('song add', (song, callback) => {
    if(!currentlyPlaying){
      io.emit('play song', song);
      currentlyPlaying = song;
      timeStarted = Date.now();
      console.log('set time started', timeStarted);
      setTimeout(songEnded, song.duration);
      return
    }
    const error = addSong(song);
    if(error) return callback(error);
    sortPool();
    io.emit('pool update', pool);
  })

  socket.on('vote change', (id, vote) =>{
    updateVote(id, vote);
    sortPool();
    io.emit('pool update', pool);
  })
})



function addSong(song) {
  const duplicate = pool.some(s => s.id === song.id);
  if(duplicate){
    return 'Error: song already exists in pool';
  }

  const newSong = {
    id: song.id,
    title: song.title,
    artist: song.artist,
    duration: song.duration,
    cover: song.cover,
    voteCount: 0,
    dateAdded: Date.now()
  };
  pool.push(newSong);
}

function updateVote(id, vote) {
  pool = pool.map(song => {return (song.id === id) ? {...song, voteCount: (song.voteCount + vote)} : song});
}

function sortPool() {
  pool.sort(function(a,b) {
    const voteA = a.voteCount,
      voteB = b.voteCount,
      dateA = a.dateAdded,
      dateB = b.dateAdded;
    return (voteA > voteB) ? -1 : (voteA < voteB) ? 1 : (dateA > dateB) ? 1 : -1;
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

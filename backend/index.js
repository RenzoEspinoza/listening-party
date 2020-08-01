const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const app = express()
const io = require('socket.io')(app)
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3001

if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

}
else{

app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve(__dirname, 'build')))



const client_id = '8044283a858a43218c09deb9403590a1'
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:3001/auth/spotify/callback/'

console.log('secret', client_secret);
console.log('redirect', redirect_uri);

let token = ''
getClientCredToken()


let pool = []
let currentlyPlaying = null
let timeStarted = null

function getClientCredToken(){
  axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    params: {
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret
    },
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    token = res.data.access_token
    console.log('token', token)
    setTimeout(getClientCredToken, res.data.expires_in * 1000)
    
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status)
    console.log(error.response.headers)
}) 
}

app.get('/auth/spotify', (req,res) => {
  const scopes = 'user-modify-playback-state user-read-playback-state'
  res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + client_id +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + encodeURIComponent(redirect_uri))
})

app.get('/auth/spotify/callback', (req, res) => {
  const code = req.query.code || null
  axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri
    },
    headers : {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + ( Buffer.from(
        client_id+ ':' + client_secret
      ).toString('base64'))
    }
  }).then(response => {
    const accessToken = response.data.access_token
    const refreshToken = response.data.refresh_token
    const uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + accessToken + '&refresh_token=' + refreshToken)
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status)
    console.log(error.response.headers)
  })
})

app.get('/api/refreshToken/:refreshToken', (req, res) => {
  const refreshToken = req.params.refreshToken
  console.log('refresh token', refreshToken);
  axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + ( Buffer.from(
        client_id+ ':' + client_secret
      ).toString('base64'))
    }
  }).then(response => {
    console.log(response.data.access_token);
    res.json(response.data.access_token)
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status)
    console.log(error.response.headers)
  })
})

app.get('/api/search/:query', (req, res) => {
  const query = encodeURIComponent(req.params.query)
  axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {headers: {'Authorization': `Bearer ${token}`}})
  .then(response => {
    res.json(response.data.tracks.items)})
  .catch(error =>{
    console.log(error.response.data);
    console.log(error.response.status)
    console.log(error.response.headers)
  })
})

app.get('/api/pool', (req, res) => {
  res.json(pool)
})

app.get('/api/currentSong', (req, res) => {
  res.json(currentlyPlaying)
})

app.get('/api/elapsedTime', (req, res) => {
  const elapsedTime = Date.now() - timeStarted
  res.json(elapsedTime)
})

app.delete('/api/songs/:id', (req, res) => {
  const id = req.params.id
  songs = songs.filter(song => song.id !== id)
  res.status(204).end()
})

app.post('/api/pool', (req, res) => {
  const body = req.body
  addSong(body)
  res.status(204).end()
})

function songEnded() {
  currentlyPlaying = pool.shift()
  console.log('next song', currentlyPlaying)
  if(currentlyPlaying){
    io.emit('play song', currentlyPlaying)
    setTimeout(songEnded, currentlyPlaying.duration)
  }
  else console.log('No song up next');
  io.emit('pool update', pool)
}

io.on('connection', socket => {
  console.log('a user connected')

  socket.on('song add', (song, callback) => {
    if(!currentlyPlaying){
      io.emit('play song', song)
      currentlyPlaying = song
      timeStarted = Date.now()
      console.log('set time started', timeStarted);
      setTimeout(songEnded, song.duration)
      return
    }
    const error = addSong(song)
    if(error) return callback(error)
    sortPool()
    io.emit('pool update', pool)
  })

  socket.on('vote change', (id, vote) =>{
    updateVote(id, vote)
    sortPool()
    io.emit('pool update', pool)
  })
})



function addSong(song) {
  const duplicate = pool.some(s => s.id === song.id)
  if(duplicate){
    return 'Error: song already exists in pool'
  }

  const newSong = {
    id: song.id,
    title: song.title,
    artist: song.artist,
    duration: song.duration,
    cover: song.cover,
    voteCount: 0,
    dateAdded: Date.now()
  }
  pool.push(newSong)
}

function updateVote(id, vote) {
  pool = pool.map(song => {return (song.id === id) ? {...song, voteCount: (song.voteCount + vote)} : song})
}

function sortPool() {
  pool.sort(function(a,b) {
    const voteA = a.voteCount
    const voteB = b.voteCount
    const dateA = a.dateAdded
    const dateB = b.dateAdded
    return (voteA > voteB) ? -1 : (voteA < voteB) ? 1 : (dateA > dateB) ? 1 : -1
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
}
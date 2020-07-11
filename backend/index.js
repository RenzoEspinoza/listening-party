const express = require('express')
const cors = require('cors')
const { callbackify } = require('util')
const axios = require('axios')
const { response } = require('express')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const client_id = '8044283a858a43218c09deb9403590a1'
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
let token = ''

if(!token) axios({
  url: 'https://accounts.spotify.com/api/token',
  method: 'post',
  params: {
    grant_type: 'client_credentials',
    client_id: client_id,
    client_secret: client_secret
  },
  headers : {
    "Content-Type": "application/x-www-form-urlencoded"
  }
}).then(res => {
  token = res.data.access_token
  console.log(token)
}).catch(error => {
  console.log(error)
})
let pool = []

app.get('/api/search/:query', (req, res) => {
  const query = encodeURIComponent(req.params.query)
  console.log(query)
  axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {headers: {'Authorization': `Bearer ${token}`}})
  .then(response => {
    res.json(response.data.tracks.items)})
  .catch(error =>{
    console.log(error);;
  })
})
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/pool', (req, res) => {
  res.json(pool)
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

io.on('connection', socket => {
  console.log('a user connected')
  socket.on('song add', (song, callback) => {
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

const addSong = song => {
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

const updateVote = (id, vote) => {
  pool = pool.map(song => {return (song.id === id) ? {...song, voteCount: (song.voteCount + vote)} : song})
}

const sortPool = () =>{
  pool.sort(function(a,b) {
    const voteA = a.voteCount
    const voteB = b.voteCount
    const dateA = a.dateAdded
    const dateB = b.dateAdded
    return (voteA > voteB) ? -1 : (voteA < voteB) ? 1 : (dateA > dateB) ? 1 : -1
  })
}

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
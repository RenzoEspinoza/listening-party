const express = require('express')
const cors = require('cors')
const { callbackify } = require('util')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let songs = [
  {
    "id": "song-jYmHSg4GElhDEjcwZp3Tn",
    "title": "hello",
    "artist": "artist",
    "duration": "1:11",
    "dateAdded": 1592941124347
  },
  {
    "id": "song-r06dKEZDE8uY9k4fQApGf",
    "title": "world",
    "artist": "artist",
    "duration": "2:22",
    "dateAdded": 1592941128725
  },
  {
    "id": "song-ODs_wmon0Xweg0-d2cxxC",
    "title": 'hello world',
    "artist": "artist",
    "duration": "1:11",
    "dateAdded": 1592941136073
  }
]

let pool = []

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/songs', (req, res) => {
  res.json(songs)
})

app.get('/api/pool', (req, res) => {
  res.json(pool)
})

app.get('/api/songs/:query', (req, res) => {
  const query = req.params.query
  const song = songs.find(song => song.title === query)
  if (song) {res.json(song)} 
  else {res.status(404).end()}
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
  console.log(pool)
  const duplicate = pool.some(s => s.id === song.id)
  console.log('duplicate:', duplicate)
  if(duplicate){
    return 'Error: song already exists in pool'
  }

  const newSong = {
    id: song.id,
    title: song.title,
    artist: song.artist,
    duration: song.duration,
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
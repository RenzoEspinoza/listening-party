const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

let songs = [
  {
    "id": "song-jYmHSg4GElhDEjcwZp3Tn",
    "title": "1",
    "artist": "artist",
    "duration": "1:11",
    "dateAdded": 1592941124347,
    "voteCount": 1
  },
  {
    "id": "song-r06dKEZDE8uY9k4fQApGf",
    "title": "2",
    "artist": "artist",
    "duration": "2:22",
    "dateAdded": 1592941128725,
    "voteCount": 2
  },
  {
    "id": "song-ODs_wmon0Xweg0-d2cxxC",
    "title": "3",
    "artist": "artist",
    "duration": "1:11",
    "dateAdded": 1592941136073,
    "voteCount": 3
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/songs', (req, res) => {
  res.json(songs)
})

app.get('/api/songs/:id', (req, res) => {
  const id = req.params.id
  const song = songs.find(song => song.id === id)
  if (song) {res.json(song)} 
  else {res.status(404).end()}
})

app.delete('/api/songs/:id', (req, res) => {
  const id = req.params.id
  songs = songs.filter(song => song.id !== id)
  res.status(204).end()
})

app.post('/api/songs', (req, res) => {
  const body = req.body
  
  const duplicate = songs.some(song => song.id === body.id)
  console.log('duplicate:', duplicate)
  if(duplicate){
    return res.status(400).json({
      error: 'song already exists in pool'
    })
  }

  const song = {
    id: body.id,
    title: body.title,
    artist: body.artist,
    duration: body.duration,
    voteCount: 0,
    dateAdded: Date.now()
  }

  songs = songs.concat(song)
  res.json(song)
})

app.patch('/api/songs/:id', (req, res) => {
  const id = req.params.id
  songs = songs.map(song => {return (song.id === id) ? {...song, voteCount: (song.voteCount + req.body.vote)} : song})
  res.status(204).end()
})

// fix the patch for updating votes and add sorting

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
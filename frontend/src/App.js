import React, {useState, useEffect} from 'react'
import SongSearch from './components/SongSearch'
import SongPool from './components/SongPool'
import {PoolSong, SearchResultSong} from './components/Song'
import axios from 'axios'
import io from 'socket.io-client'

const baseUrl = 'http://localhost:3001/api/'
let socket;

const App = () => {
  const [poolList, setPoolList] = useState([])
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    getSongPool()
    socket = io('http://localhost:3001')
    socket.on('pool update', pool => {
      setPoolList(pool)
    })
  }, [])

  const addSong = songData => {
    setSearchResult(searchResult => searchResult.filter(song => song.id !== songData.id))
    socket.emit('song add', songData, error => {
      if(error) {
        alert(error)
      }
    })
  }

  function getSongPool(){
    axios.get(baseUrl + 'pool')
    .then(response => {
      setPoolList(response.data)})
  }
  
  const search = input => {
    axios.get(baseUrl + `search/${input}`)
    .then(res => {
      console.log(res.data)
      const searchResult = res.data.map(song => {
        return ({id : song.id, title: song.name, artist: song.artists[0].name, duration: song.duration_ms, cover: song.album.images[1].url})
      })
      console.log('search result', searchResult)
      setSearchResult(searchResult)
    })
    
  }

  const voteUpdate = (id,vote) =>{
    socket.emit('vote change', id, vote)
  }

  const poolComponentList = poolList.map(song => (
      <PoolSong id={song.id} title={song.title} artist={song.artist} duration={song.duration} voteCount={song.voteCount} voteUpdate={voteUpdate} cover = {song.cover} key={song.id} />))

  const searchComponentList = searchResult.map(song => (
        <SearchResultSong id={song.id} title={song.title} artist={song.artist} duration={song.duration} key={song.id} addSong={addSong} cover={song.cover} />))
  
  return (
    <div className="App" class="bg-gray-200 grid">
      <div class="p-2">
        <SongSearch search={search} componentList={searchComponentList}/>
      </div>
      <div class="p-2">
        <SongPool componentList={poolComponentList}/>
      </div>
      
    </div>
  )
}


export default App;

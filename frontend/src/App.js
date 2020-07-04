import React, {useState, useEffect} from 'react'
import SongSearch from './components/SongSearch'
import SongPool from './components/SongPool'
import {PoolSong, SearchResultSong} from './components/Song'
import {nanoid} from 'nanoid'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/songs'


const App = () => {
  const [poolList, setPoolList] = useState([])
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    getSongPool()
  }, [])

  const addSong = songData => {
    console.log(songData.id);
    let duplicate = poolList.some(song => song.id === songData.id)   //later on replace songData.id with the id of a song given by the Spotify API
    if(!duplicate) {
      setSearchResult(searchResult => searchResult.filter(song => song.id !== songData.id))

      axios.post(baseUrl, songData)
      .then(response => {
        console.log(response)
        getSongPool()
      })
    }
  }

  function getSongPool(){
    axios.get(baseUrl)
    .then(response => {
      response.data.sort(function(a,b) {
        const voteA = a.voteCount
        const voteB = b.voteCount
        const dateA = a.dateAdded
        const dateB = b.dateAdded
        return (voteA > voteB) ? -1 : (voteA < voteB) ? 1 : (dateA > dateB) ? 1 : -1
      })
      setPoolList(response.data)})
  }
  
  const search = input => {
    console.log(input)
    getSearchResult({id:"song-" + nanoid(), title:input, artist:"artist", duration:"1:11"})
  }

  const getSearchResult = songData => {
    setSearchResult(searchResult => searchResult.concat(songData))
  }

  const voteUpdate = (id,vote) =>{
    const url = baseUrl + `/${id}`
    console.log(url)
    axios.patch(url, {vote})
    .then(response =>{
      getSongPool()
    })
  }

  const poolComponentList = poolList.map(song => (
      <PoolSong id={song.id} title={song.title} artist={song.artist} duration={song.duration} voteCount={song.voteCount} voteUpdate={voteUpdate} key={song.id} />))

  const searchComponentList = searchResult.map(song => (
        <SearchResultSong id={song.id} title={song.title} artist={song.artist} duration={song.duration} key={song.id} addSong={addSong} />))
  
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

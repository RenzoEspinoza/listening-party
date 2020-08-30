import React, {useState, useEffect, useRef} from 'react';
import SongSearch from './components/SongSearch';
import SongPool from './components/SongPool';
import {PoolSong, SearchResultSong} from './components/Song';
import NowPlaying from './components/NowPlaying';
import AvailableDevices from './components/AvailableDevices';
import axios from 'axios';
import io from 'socket.io-client';

const backendURL = process.env.NODE_ENV === 'production' ? 'http://listening-party-backend.herokuapp.com/'
  : "http://localhost:3001/";
let socket;

const App = () => {
  const [poolList, setPoolList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [deviceList, setDeviceList] = useState([]);
  const [modalIsOpen,setIsOpen] = useState(false);

  const activeDevice = useRef(null);
  const loggedIn = useRef(false);
  
  const port = process.env.PORT;

  useEffect(() => {
    getSongPool();
    getCurrentSong();
    console.log(port);
    socket = io(backendURL, {transports: ['websocket'],
    upgrade: false, secure:false})
    socket.on('pool update', pool => {
      setPoolList(pool);
    });

    const params = new URLSearchParams(window.location.search)
    console.log('params', params);
    loggedIn.current= params.get('loggedIn');
    console.log(loggedIn.current);

    socket.on('play song', song => {
      if(activeDevice.current){
        console.log('attempting to play')
        playSong(song.id,0, activeDevice.current)
      }
      setCurrentSong(song)
      sessionStorage.removeItem(song.id)
    });
    
    return () => socket.disconnect();
  }, []);

  function addSong(songData){
    setSearchResult(searchResult => searchResult.filter(song => song.id !== songData.id));
    socket.emit('song add', songData, error => {
      if(error) {
        alert(error)
      }
    });
  }
  function getSongPool(){
    axios.get(backendURL + 'api/pool')
    .then(res => {
      setPoolList(res.data);
    })
    .catch(error => {
      printError(error);
    })
  }

  function getCurrentSong(){
    axios.get(backendURL + 'api/currentSong')
    .then(res => {
      if(res.data) {
        console.log(res.data);
        setCurrentSong(res.data);
      }
    }).catch(error => {
      printError(error);
    });
  }

  function search(input){
    axios.get(backendURL + 'spotify/' + `search/${input}`)
    .then(res => {
      const searchResult = res.data.map(song => {
        return ({id : song.id, title: song.name, artist: song.artists[0].name, duration: song.duration_ms, cover: song.album.images[0].url})
      });
      console.log('search result', searchResult);
      setSearchResult(searchResult);
    }).catch(error => {
      printError(error);
    });
  }

  function voteUpdate(id,vote){
    socket.emit('vote change', id, vote);
  }

  function getAvailableDevices(){
    axios.get(backendURL + 'spotify/device', {withCredentials: true})
    .then(res => {
      console.log('available devices:', res.data);
      setDeviceList(res.data);
      setIsOpen(true);
    }).catch(error => {
      printError(error);
    })
  }

  async function playSong(songId, position = 0, deviceId) {
    console.log(deviceId);
    let deviceParam;
    if(deviceId) deviceParam = {device_id : deviceId};
    else (deviceParam = {});
    const res = await axios.post(backendURL + 'spotify/play', {songId, position, deviceParam}, {withCredentials: true}).then(res => {console.log(res.data);}).catch(error => printError(error));
  }

  function startListening(deviceId){
    activeDevice.current = deviceId;
    axios.get(backendURL + 'api/elapsedTime')
    .then(res => {
      console.log(res.data);
      playSong(currentSong.id, res.data, activeDevice.current);
    }).catch(error => {
      printError(error);
    });
  }

  function printError(error){
    if(error.response){
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  }

  const poolComponentList = poolList.map(song => (
      <PoolSong id={song.id} title={song.title} artist={song.artist} duration={song.duration} voteCount={song.voteCount} voteUpdate={voteUpdate} cover = {song.cover} key={song.id} />));

  const searchComponentList = searchResult.map(song => (
        <SearchResultSong id={song.id} title={song.title} artist={song.artist} duration={song.duration} key={song.id} addSong={addSong} cover={song.cover} />));
  
  return (
    <div class="flex justify-center">
      <div class="grid grid-cols-1 gap-4 w-full my-2 px-8 md:grid-cols-2 md:w-9/12 lg:w-8/12 xl:w-7/12">
      <div class="h-auto w-full md:col-span-2">
        <NowPlaying 
          connect={loggedIn.current ?
            (
              <AvailableDevices modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} deviceList={deviceList} getDevices={getAvailableDevices} startListening={startListening} ></AvailableDevices>
            ) : 
            (
              <button onClick={() => {window.location.href= backendURL + 'spotify/auth'}} class="focus:outline-none outline-none bg-transparent text-green-600 border border-green-600 font-bold py-2 px-4 rounded inline-flex justify-center items-center hover:bg-green-600 hover:border-transparent hover:text-white">
                <svg class="fill-current sm:w-8 sm:h-8  mr-2 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"/></svg>
                <p class="">Login with Spotify Premium to start listening</p>
              </button>
            )
          } currentSong={currentSong}>
        </NowPlaying>
      </div>
      <div class="h-72 md:h-96 lg:h-112 xl:h-128 w-full">
        <SongPool componentList={poolComponentList}/>
      </div>
      <div class="h-72 md:h-96 lg:h-112 xl:h-128 w-full">
        <SongSearch search={search} componentList={searchComponentList}/>
      </div>
    </div>
    </div>
    
  )
}


export default App;

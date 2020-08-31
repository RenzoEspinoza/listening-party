const express = require('express');
const Router = express.Router;
const axios = require('axios');
require('dotenv').config();
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const frontendUri = process.env.FRONTEND_URI;
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
const index = require('./index');
const { response } = require('express');

let spotify = Router();
spotify.use('/device/', expiredTokenCheck);
spotify.use('/play', expiredTokenCheck);

function expiredTokenCheck(req, res, next){
  if(req.cookies.accessToken == undefined && req.cookies.refreshToken){
    refreshAccessToken(req.cookies.refreshToken).then(newToken => {
      console.log('new access token generated:', newToken);
      req.cookies.accessToken = cryptr.encrypt(newToken);
      next();
    });
  }
  else{
    next();
  }
}

let clientToken = '';
const getClientCredToken = () =>{
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
      clientToken = res.data.access_token
      console.log('client cred token', clientToken)
      setTimeout(getClientCredToken, res.data.expires_in * 1000)
      
    }).catch(error => {
      printError(error);
  });
  }

getClientCredToken();

spotify.get('/auth', (req,res) => {
  const scopes = 'user-modify-playback-state user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + client_id +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + encodeURIComponent(redirect_uri)
  );
})

spotify.get('/auth/callback', (req, res) => {
  const code = req.query.code || null;
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
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    const expiresIn = response.data.expires_in;
    
    console.log('user access token:', accessToken);
    console.log('user refresh token:', refreshToken);
    console.log('access token expires in:', expiresIn);

    const encryptedAccessToken = cryptr.encrypt(accessToken)
    const encryptedRefreshToken = cryptr.encrypt(refreshToken)
    console.log('encrypted access token:', encryptedAccessToken);
    console.log('encrypted refresh token:', encryptedRefreshToken);

    const dayToMilliSeconds = 24*60*60*1000;
    res.cookie('accessToken', encryptedAccessToken,
      {maxAge: expiresIn * 1000, httpOnly: true,  // expiresIn * 1000
      secure: true, sameSite: 'none'} //process.env.NODE_ENV === 'production' ? true : false
    );
    res.cookie('refreshToken', encryptedRefreshToken,
      {maxAge: dayToMilliSeconds * 7, httpOnly: true,
      secure: true, sameSite: 'none'} //process.env.NODE_ENV === 'production' ? true : false
    );
    res.redirect(frontendUri + '?loggedIn=true');
  }).catch(error => {
    printError(error);
  });
})

spotify.get('/search/:query', (req, res) => {
  const query = encodeURIComponent(req.params.query);
  console.log('search query:', query);
  axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {headers: {'Authorization': `Bearer ${clientToken}`}})
  .then(response => {
    console.log('search response', response.data);
    res.json(response.data.tracks.items);
  })
  .catch(error =>{
    printError(error);
  });
})

spotify.get('/device/', (req,res) => {
  console.log('request headers', req.headers);
  console.log('get device cookies:', req.cookies);
  console.log('access token:',req.cookies.accessToken);
  const accessToken = cryptr.decrypt(req.cookies.accessToken);
  console.log('decrypted token:', accessToken);
  getAvailableDevices(accessToken).then(deviceList =>{
    console.log('list of devices:', deviceList);
    res.json(deviceList);
  }).catch(error => {
    printError(error);
    res.status(500).send('Something broke!')
  });
})

async function getAvailableDevices(accessToken){
  return axios({
    url: 'https://api.spotify.com/v1/me/player/devices',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then(res => res.data.devices)
}

async function refreshAccessToken(encryptedRefreshToken){
  const refreshToken = cryptr.decrypt(encryptedRefreshToken);
  console.log('refresh token:', refreshToken);
  return axios({
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
  }).then(res => 
    res.data.access_token
  ).catch(error => {
    printError(error);
  });
}

spotify.post('/play/', (req, res) => {
  const token = cryptr.decrypt(req.cookies.accessToken);
  axios({
    url: 'https://api.spotify.com/v1/me/player/play',
    method: 'PUT',
    data: {
      uris : [`spotify:track:${req.body.songId}`],
      position_ms : req.body.position
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: req.body.deviceParam
  }).then(response =>{
    console.log(response.data);
    res.end('success')
  }).catch(error => {
    printError(error);
    console.log('Request data:', req.body);
    res.status(500).send('Something broke!')
  });
})

function printError(error){
  console.log(error.response.data);
  console.log(error.response.status);
  console.log(error.response.headers);
}

module.exports = spotify;
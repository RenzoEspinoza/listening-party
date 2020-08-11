const express = require('express');
const Router = express.Router;
const axios = require('axios');
require('dotenv').config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const frontendUri = process.env.FRONTEND_URI;

let spotify = Router();

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
      console.log(error.response.data);
      console.log(error.response.status)
      console.log(error.response.headers)
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
    
    const dayToMilliSeconds = 24*60*60*1000;
    res.cookie('accessToken', accessToken,
      {maxAge: expiresIn}
    );
    res.cookie('refreshToken', refreshToken,
      {maxAge: dayToMilliSeconds * 14}
    );
    res.redirect(frontendUri);
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status)
    console.log(error.response.headers)
  });
})

spotify.get('/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
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
    res.json(response.data.access_token);
  }).catch(error => {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  });
})

spotify.get('/search/:query', (req, res) => {
  const query = encodeURIComponent(req.params.query);
  axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {headers: {'Authorization': `Bearer ${clientToken}`}})
  .then(response => {
    res.json(response.data.tracks.items);})
  .catch(error =>{
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  });
})

module.exports = spotify;
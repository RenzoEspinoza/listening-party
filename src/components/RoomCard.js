import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import placeholder from '../placeholder.jpg';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import PersonIcon from '@material-ui/icons/Person';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import Chip from '@material-ui/core/Chip';


const useStyles = makeStyles({
  card: {
    maxWidth: 450,
    backgroundColor: '#fafafa',
  },
  content:{
    
  },
  details:{
    display: 'flex',

  },
  cover: {
    width: 150,
    height: 150,
    marginLeft: 'auto',
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  gutter: {
    marginTop: 5,
    marginLeft: 15,
    marginBottom: 5,
    display: 'flex',
  },
  gutterChildren: {
    marginRight: 10,
  },
  join: {
    marginTop: 35,
  }
});

const roomName = "Rooom_Name";
const roomHost = "Host_Username"
const userCount = 10;
const votingSystem = "Queue";
const genre = "Any";

export default function RoomCard() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            roomName
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            hosted by roomHost
          </Typography>
          <Button variant="outlined" color="primary" className={classes.join}>
            Join Room
          </Button>
          
        </CardContent>
      
        <CardMedia
          className={classes.cover}
          image={placeholder}
          title="Album cover of the currently playing track"
        />
      </div>
      <Divider></Divider>
      <div className={classes.gutter}>
        <Chip className={classes.gutterChildren} variant="outlined" color="primary" icon={<PersonIcon />} label={userCount}/>
        <Chip className={classes.gutterChildren} variant="outlined" color="primary" icon={<HowToVoteIcon />} label={votingSystem}/>
        <Chip className={classes.gutterChildren} variant="outlined" color="primary" icon={<MusicNoteIcon />} label={genre}/>
      </div>
    </Card>
  );
}

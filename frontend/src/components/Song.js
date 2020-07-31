import React from "react"
import { useState } from "react"

function millisToMin(millis) {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return (seconds === 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds)
}

function Song(props){
    return(
        <div class="flex py-2 items-center border-t">
            <img src={props.cover} alt="album cover" class=" w-20 mr-4"/>
            <div class="antialised mr-8 text-sm" style={{overflow:'hidden', whiteSpace:'nowrap'}}>
                <p class="text-gray-900 font-semibold pb-1" >{props.title} </p>
                <p class="text-gray-600 pb-1">{props.artist}</p>
                <p class="text-gray-400 pb-1">{millisToMin(props.duration)}</p>
            </div>
            {props.button}
        </div>
    )
}

export function QueueSong(props){
    return(
        <Song title={props.title} artist={props.artist} duration={props.duration} cover = {props.cover}
        button = 
        {
        <button class="ml-auto mr-3 focus:outline-none">
            <svg class="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
        </button>
        }
        />
    )
}

export function PoolSong(props){
    const [isClicked, setClicked] = useState(() => JSON.parse(sessionStorage.getItem(props.id)) || false)

    React.useEffect(() => {
        sessionStorage.setItem(props.id, JSON.stringify(isClicked))
      }, [isClicked]
    );

    const handleClick = e =>{
        if(isClicked){
            props.voteUpdate(props.id, -1)
            setClicked(false)
        }
        else{
            props.voteUpdate(props.id, 1)
            setClicked(true)
        }
    }

    return(
        <Song title={props.title} artist={props.artist} duration={props.duration} cover = {props.cover}
        button = 
        {<div class="flex ml-auto mr-3 items-center">
            <button onClick={(e) => handleClick(e)} class="mr-1 focus:outline-none">
                <svg class={isClicked ? 'h-5 w-5 fill-current text-blue-400' : 'h-5 w-5 fill-current text-gray-500'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 10v8h6v-8h5l-8-8-8 8h5z"/>
                </svg>
            </button>
            <p class="font-semibold text-gray-600">{props.voteCount}</p>
        </div>
        }
        />
    )
    
}

export function SearchResultSong(props){
    const handleClick= e => {
        const songData={id:props.id, title:props.title, artist:props.artist, duration:props.duration, cover: props.cover}
        props.addSong(songData)
    }
    
    

    return(
        <Song title={props.title} artist={props.artist} duration={props.duration} cover = {props.cover}
        button = 
        {<button onClick={handleClick} class=" ml-auto mr-3 focus:outline-none">
        <svg class="h-4 w-4 fill-current text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
        </svg>
        </button>
        }
        />
    )
    
} 

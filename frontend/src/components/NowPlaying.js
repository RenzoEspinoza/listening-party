import React from 'react'

export default function NowPlaying(props){
    const song = props.currentSong;
    
    function DisplaySong(){
        if(song){
            return (
                <div class="flex items-center">
                    <div class="w-1/3 mr-4">
                        <img src={song.cover} alt="album cover" class="w-32 md:w-48 lg:w-56" />
                    </div>
                    <div class="w-2/3">
                        <div class="antialised" style={{overflow:'hidden', whiteSpace:'nowrap'}}>
                            <p class="text-gray-900 font-semibold pb-1 text-2xl md:text-3xl lg:text-4xl" >{song.title} </p>
                            <p class="text-gray-600 pb-1 text-xl md:text-2xl lg:text-3xl">{song.artist}</p>
                        </div>
                        {props.connect}
                        
                    </div>
                </div>
        )
        }
        else return <div class="h-24 md:h-32 lg:h-40 xl:h-48">
        </div>
    }

    return(
        <div class="bg-white p-6 h-full shadow-lg rounded-lg flex items-center">
            <DisplaySong></DisplaySong>
        </div>
        
    )
    
}
import React from 'react'

export default function NowPlaying(props){
    const song = props.currentSong;
    
    function DisplaySong(){
        if(song){
            return (
                <div class="grid grid-flow-col gap-0" style={{gridTemplateColumns: '25% auto 10%'}}>
                    <img src={song.cover} alt="album cover" class="row-span-3 w-40"/>
                    <div class="antialised mr-8 text-4xl row-span-2" style={{overflow:'hidden', whiteSpace:'nowrap'}}>
                        <p class="text-gray-900 font-semibold pb-1" >{song.title} </p>
                        <p class="text-gray-600 pb-1">{song.artist}</p>
                    </div>
                    {props.connect}
                </div>
        )
        }
        else return <div style={{height: '10rem'}}>
        </div>
    }

    return(
        <div class="bg-white p-6 " style={{width: '48rem'}}>
            <DisplaySong></DisplaySong>
        </div>
        
    )
    
}
import React from "react"
import Scrollbars from "react-custom-scrollbars"

export default function SongPool(props){
    function isEmpty(songList) {
            if(songList.length===0){
                return(
                    <div class="m-10 align-middle">
                        <svg class="h-20 w-20 fill-current text-gray-500 m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16 17a3 3 0 0 1-3 3h-2a3 3 0 0 1 0-6h2a3 3 0 0 1 1 .17V1l6-1v4l-4 .67V17zM0 3h12v2H0V3zm0 4h12v2H0V7zm0 4h12v2H0v-2zm0 4h6v2H0v-2z"/>
                        </svg>
                        <p class="text-center antialiased text-gray-700 text-2xl font-bold">
                            Song Pool Empty
                        </p>
                        <p class="text-center antialiased text-gray-700 text-lg">
                            Get the party started by searching for a song to add!
                        </p>
                    </div>
                )
            }
            else{
                return songList;
            }
    }
    
    return(
            <div class="shadow-lg rounded-lg bg-white h-full">   
                <Scrollbars autoHide>
                    {isEmpty(props.componentList)}
                </Scrollbars>
            </div>
    )
    
}
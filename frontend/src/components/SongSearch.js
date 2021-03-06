import React from "react"
import Scrollbars from "react-custom-scrollbars"
import { useState } from "react"

export default function SongSearch(props){
    const [query, setQuery] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if(query.length > 0) props.search(query);
    }

    function handleChange(e) {
        setQuery(e.target.value);
    }
    return(
        <div class="h-full shadow-lg rounded-lg bg-white">
            <div class="flex items-center relative justify-center h-8 md:h-10 overflow-hidden" >
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Search for a song" class="rounded-lg focus:outline-none" onChange={handleChange}></input>
                    <button type="submit" class="focus:outline-none " >
                        <svg class="h-4 w-4 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                    </button>
                </form>
                
            </div>
            <div class="h-56 pb-4 md:h-88 lg:h-104 xl:h-120">
                <Scrollbars autoHide >
                    {props.componentList}
                </Scrollbars>
            </div>
        </div>
    );
    

    
}


import React from "react"
import Scrollbars from "react-custom-scrollbars"

export default function SongPool(props){
    function isEmpty(obj) {
            if(obj.length===0){
                return(
                    <p class="text-center antialiased text-gray-900 text-3xl font-semibold">
                    The song pool is currently empty, search for a song and add it to the pool to get started
                    </p>
                )
            }
    }
    
    return(
            <div class="max-w-sm shadow rounded-lg bg-white p-4 pt-6" style={{height: '28.5rem'}}>   
                <Scrollbars autoHide>
                    {isEmpty(props.componentList)}
                    {props.componentList}
                </Scrollbars>
            </div>
    )
    
}
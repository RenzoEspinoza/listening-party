import React from "react";
import Scrollbars from "react-custom-scrollbars";

export default function SongPool(props){
    return(
        <div class=" max-w-sm py-4 shadow rounded-lg bg-white">

            <div class="px-4 pt-2" style={{height: '26rem'}}>   
                <Scrollbars autoHide>
                    {isEmpty(props.componentList)}
                    {props.componentList}
                </Scrollbars>
                
            </div>
            
            
        </div>
        
    )
    function isEmpty(obj) {
            if(obj.length===0){
                return(
                    <p class="text-center antialiased text-gray-900 text-3xl font-semibold">
                    The song pool is currently empty, search for a song and add it to the pool to get started
                    </p>
                )
            }
    }
}
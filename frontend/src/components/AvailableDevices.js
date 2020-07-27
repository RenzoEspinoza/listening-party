import React, {useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  },
  overlay: {
      backgroundColor: 'rgba(26, 32, 44, 0.5)'
  }
};

Modal.setAppElement('body')

export default function AvailableDevices(props) {
  
  function openModal() {
      props.setIsOpen(true)
  }
  function closeModal(){
      props.setIsOpen(false)
  }
  
  function getDevices(){
      props.getDevices()
  }

  return (
    <div>
      <button onClick={getDevices} class=" focus:outline-none outline-none bg-transparent text-green-600 border border-green-600 font-bold py-2 px-4 rounded inline-flex items-center justify-center hover:bg-green-600 hover:border-transparent hover:text-white">
          <span>Start listening with Spotify Connect</span> 
      </button>
      <Modal
        isOpen={props.modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
      <div>
          <div class="px-6 border-gray-600 border-b">
              <p class="text-gray-700 font-bold text-xl">Choose a device to listen on</p>
          </div>
          <ul class=" my-2 border">
              {props.deviceList.map(device => (<Device closeModal={closeModal} startListening={props.startListening} id={device.id} name={device.name} type={device.type}></Device>))}
          </ul>
      </div>
      </Modal>
    </div>
  );
}
function Device(props){
  function handleClick(){
    props.closeModal()
    props.startListening(props.id)
  }

  return(
    <li key={props.id} onClick={handleClick}>Name: {props.name} Type: {props.type}</li>
  )
}
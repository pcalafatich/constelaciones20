import React, { useState, useEffect, useRef } from "react";
//import classNames from 'classnames';

const socket  = require('../connection/socket').socket
// import "../App.css";

const Chat = ({ nombre }) => {
  const miNombre = nombre;
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    console.log('Chat: Usuario conectado');
    socket.emit("conectado", nombre);
  }, [nombre]);

  useEffect(() => {
    socket.on("mensajes", (mensaje) => {
      console.log('Chat: Mensaje recibido');
      setMensajes([...mensajes, mensaje]);
    });
  }, [mensajes]);

  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  
  const submit = (e) => {
    e.preventDefault();
    console.log('Chat: Mensaje enviado');
    socket.emit("mensaje", nombre, mensaje);
    setMensaje("");
  };

  return (
    <div >
      <div id="messages" className = "flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {mensajes.map((e, i) => (
        <div key={i}>
        <React.Fragment>
          <div className={miNombre === e.nombre ? 'flex items-end justify-end' : 'flex items-start justify-start' }>
            <div>
              <span className={miNombre === e.nombre ? 'px-4 py-2 rounded-lg inline-block rounded-bl-none bg-green-400 text-white items-end' :
              'px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white '} >{e.nombre}: {e.mensaje}</span>
            </div>
          </div>
        </React.Fragment>
        </div>
        ))}
        <div ref={divRef}></div>
      </div>

      <div className="border-t-2 border-gray-300 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <form onSubmit={submit}>
            <input type="text" value={mensaje} placeholder="Escriba mensaje" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-200 rounded-full py-3" onChange={(e) => setMensaje(e.target.value)}></input> 
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button type="submit" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 transform rotate-90">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Chat;
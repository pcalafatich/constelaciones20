import io from 'socket.io-client'

// const URL = 'localhost:8000/'
const URL = 'https://auth-mini-api.herokuapp.com/'
const socket = io(URL)
let mySocketId = null

socket.on("createNewSesion", statusUpdate => {
    console.log("(socket.js) Se ha creado una NUEVA sesion! ID Sesion: " +
        statusUpdate.sesionId + " Socket id: " + statusUpdate.mySocketId)
    mySocketId = statusUpdate.mySocketId
})

export {
    socket,
    mySocketId
}

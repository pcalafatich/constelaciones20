import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const socket  = require('../connection/socket').socket
/**
 * 'Join Sesion' es donde nos unimos a la sesion creada
 */

const JoinSesionRoom = (sesionid, userName, isAdmin) => {
    /**
     * Para esta instancia del navegador, queremos unirnos a la Sala.
     * Por ahora asumimos que la Sala existe en el Backend.
     * Pasamos los datos de sesionId, userName y isCreator al objeto idData
     * para emitirlo a traves del socket al Backend
     * TO-DO: manejar el caso de que la Sala no exista.
     */
    const idData = {
        sesionId : sesionid,
        userName : userName,
        isAdmin: isAdmin
    }
    console.log("joinsesion - IDdATA", idData);
    socket.emit("userJoinSesion", idData)
}

const JoinSesion = () => {
    
    const auth = useContext(AuthContext);
    const { authState } = auth;
    const userName = authState.userInfo.firstName;
    const isAdmin = auth.isAdmin();
    const sesionid  = 'sesion-name';
    console.log("(JoinSesion) userName:", userName);
    console.log("(JoinSesion) sesionid:", sesionid);
    console.log("(JoinSesion) isAdmin: ", isAdmin);

    JoinSesionRoom(sesionid, userName, isAdmin)

    return <div></div>
}

export default JoinSesion

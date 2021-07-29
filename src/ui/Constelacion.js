import React, {
    useContext
} from 'react';
import GradientBar from '../components/common/GradientBar';
import Navbar from '../components/Navbar';
import Chat from '../components/Chat';
// import FiguraDropdown from '../components/FiguraDropdown';
import { AuthContext } from '../context/AuthContext';
import Sesion from '../models/Sesion';
import Cuadro from '../models/Cuadro';
import { Stage, Layer } from 'react-konva';
import useSound from 'use-sound'
import chessMove from '../sounds/moveSoundEffect.mp3'
import Figura from './Figura'
import piecemap from './Piecemap'
const socket  = require('../connection/socket').socket

class Constelacion extends React.Component {
    constructor(props) {
    super(props);
        this.state = {
            sesionState: new Sesion(),
            cantFiguras: 0,
            draggedPieceTargetId: ""
        }
    }

    componentDidMount() {

    socket.on('movimiento_ajeno', move => {
          console.log("movimiento ajeno: " + move.selectedId + ", " + move.finalPosition);
          this.moverFigura(move.selectedId, move.finalPosition, this.state.sesionState, false)
        })

     socket.on('agrega_figura_ajeno', agrega => {
         console.log("agrega figura ajeno: ",  agrega.cantFiguras);
         this.agregarFigura(agrega.cantFiguras, this.state.sesionState,  false)
         })
    
   }

    
    startDragging = (e) => {
        this.setState({
            draggedPieceTargetId: e.target.attrs.id
        })
    }


    moverFigura = (selectedId, finalPosition, actualSesion, isMyMove) => {
      console.log("Constelacion moverfigura selectedId:", selectedId)
      console.log("Constelacion moverfigura finalPosition:", finalPosition)
      console.log("Constelacion moverfigura actualSesion:", actualSesion)
      console.log("Constelacion moverfigura isMyMove:", isMyMove)

        actualSesion.moverFigura(selectedId, finalPosition, isMyMove)

        // notificamos a los otros que hicimos un movimiento
        if (isMyMove) {
            console.log("Constelacion isMyMove", isMyMove);
            socket.emit('new move', {
                selectedId: selectedId,
                finalPosition: finalPosition,
                sesionId: this.props.sesionId
            })
        }


        // this.props.playAudio()

        // establecemos el state.
        this.setState({
            draggedPieceTargetId: "",
            sesionState: actualSesion
        })
    }

    agregarFigura = (cantFiguras, actualSesion, isMyMove) => {
        
        console.log('Cantidad Figuras antes:', cantFiguras);
        
        actualSesion.agregarFigura(cantFiguras)

        // notificamos a los otros que agregamos una figura
        if (isMyMove) {
            console.log("Constelacion isMyMove", isMyMove);
            socket.emit('agrega figura', {
                cantFiguras: cantFiguras,
                // finalPosition: finalPosition,
                sesionId: this.props.sesionId
            })
        }


    // this.props.playAudio()

    // establecemos el state.

        this.setState({
            sesionState: actualSesion,
            cantFiguras: cantFiguras + 1,
        })
        console.log('Cantidad Figuras despues:', this.state.cantFiguras);
    }

    endDragging = (e) => {
        const actualSesion = this.state.sesionState
        const actualTablero = actualSesion.getTablero()
        const selectedId = this.state.draggedPieceTargetId
        const finalPosition = this.inferCoord(e.target.x() + 90, e.target.y() + 90, actualTablero)

        this.moverFigura(selectedId, finalPosition, actualSesion, true)
    }

    inferCoord = (x, y, tablero) => {
        // console.log("coordenadas actuales del mouse: " + x + ", " + y)
        /*
            Para saber la estimación más cercana de la nueva posicion.
        */
        var hashmap = {}
        var menorDistancia = Infinity
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                const canvasCoord = tablero[i][j].getCanvasCoord()
                // calcular distancia
                const delta_x = canvasCoord[0] - x
                const delta_y = canvasCoord[1] - y
                const nuevaDistancia = Math.sqrt(delta_x**2 + delta_y**2)
                hashmap[nuevaDistancia] = canvasCoord
                if (nuevaDistancia < menorDistancia) {
                    menorDistancia = nuevaDistancia
                }
            }
        }

        return hashmap[menorDistancia]
    }

    render() {
        return (
        <React.Fragment>
            <div className = "flex gap-4 p-4" > 
                <div className = "flex flex-col h-720 w-48 items-center gap-4 rounded border-2">
                    <div className = "bg-gray-400 w-full mx-auto text-center" >OPCIONES</div>
                        <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => this.agregarFigura(this.state.cantFiguras, this.state.sesionState, true)}>
                        <div className="px-3">
                        <p className="text-white">
                            Agregar Figura
                        </p>
                        </div>
                        </button>
                        <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => false}>
                        <div className="px-3">
                        <p className="text-white">
                             Quitar Figura
                        </p>
                        </div>
                    </button>
                    <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => false }>
                        <div className="px-3">
                        <p className="text-white">
                            Agregar Flecha
                        </p>
                        </div>
                    </button>
                    <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => false }>
                        <div className="px-3">
                        <p className="text-white">
                            Etiqueta Figura
                        </p>
                        </div>
                    </button>

                  </div>
                <div className = " h-720 w-72 bg-gray-400 rounded border-2">
                <Stage width = {720} height = {720}>
                    <Layer>
                    {this.state.sesionState.getTablero().map((row, index) => {
                    return (<React.Fragment key = {index}>
                            {row.map((Cuadro) => {
                                if (Cuadro.isOccupied()) {
                                    return (
                                        <Figura
                                            key = {Cuadro.getFiguraIdEnEsteCuadro()}
                                            x = {Cuadro.getCanvasCoord()[0]}
                                            y = {Cuadro.getCanvasCoord()[1]}
                                            //imgurls = {figuras[Cuadro.getFigura().name]}
                                            imgurls = {piecemap[Cuadro.getFigura().name]}
                                            draggedPieceTargetId = {this.state.draggedPieceTargetId}
                                            onDragStart = {this.startDragging}
                                            onDragEnd = {this.endDragging}
                                            id = {Cuadro.getFiguraIdEnEsteCuadro()}
                                            />)
                                }
                                return true
                            })}
                        </React.Fragment>)
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    </React.Fragment>)
    }
}



const ConstelacionWrapper = () => {
    //const domainName = 'https://auth-mini-api.herokuapp.com/'

    // Recuperamos el usuario y el rol de usuario
    const auth = useContext(AuthContext);
    const { authState } = auth;
    const userName = authState.userInfo.firstName

    const sesionId = 'sesion-name';
    const [play] = useSound(chessMove);
    const [newUserSocketId, setNewUserSocketId] = React.useState('')
    const [newUserDidJoinTheGame, didJoinGame] = React.useState(false)
    const [newUserName, setUserName] = React.useState('')
//    const [sessionDoesNotExist, doesntExist] = React.useState(false)

    React.useEffect(() => {

        /* SOCKET: INGRESO NUEVO USUARIO  */
        socket.on("userJoinedRoom", statusUpdate => {
          console.log("socket.id: ", socket.id);
          console.log("Ha ingresado un nuevo participante! Nombre: " + statusUpdate.userName + ", Sesion Id: " + statusUpdate.sesionId + " Socket id: " + statusUpdate.mySocketId)
            // VERIFICAR QUE EL USUARIO NUEVO NO EXISTE EN LA LISTA DE USUARIOS DE USUARIOS 
            // SI NO EXISTE EN LA LISTA AGREGARLO A LA LISTA DE USUARIOS Y ACTUALIZR PANTALLA
            // ACTIVAR NOTIFICACION TOAST DE USUARIO NUEVO
            // ACTIVAR CAJA DE VIDEO
            // ENVIAR SOLICITUD DE PEER
            //  

            // if (socket.id !== statusUpdate.mySocketId) {
            //     setNewUserSocketId(statusUpdate.mySocketId)
            // }
          didJoinGame(true)
        })

        // socket.on("status", statusUpdate => {
        //     console.log(statusUpdate)
        //     alert(statusUpdate)
        //     if (statusUpdate === 'Esta sesion no existe.' || statusUpdate === 'Hay al menos dos personas conectadas en la Sala.') {
        //         doesntExist(true)
        //     }
        // })


        socket.on('start sesion', (newUserName) => {
            console.log("newUserDidJoinTheGame: ", newUserDidJoinTheGame);
            console.log("START!")
            console.log("newUserName: ", newUserName);
            console.log("userName: ", userName);
            if (newUserName !== userName) {
                setUserName(newUserName)
                didJoinGame(true)
            } else {
                // en Constelacion, pasamos los userName como propiedad y  label it as the enemy.
                // en Constelacion, usamos reactContext para guardar nuestro userName
                // socket.emit('userName')
                socket.emit('request username', sesionId)
            }
        })


        socket.on('give userName', (socketId) => {
            if (socket.id !== socketId) {
                console.log("give userName stage: " + userName)
                socket.emit('recieved userName', {userName: userName, sesionId: sesionId})
            }
        })

        socket.on('get Other UserName', (data) => {
            if (socket.id !== data.socketId) {
                console.log("entro uno nuevo");
                setUserName(data.userName)
                //console.log('data.socketId: data.socketId')
                setNewUserSocketId(data.socketId)
                didJoinGame(true)
            }
        })
    }, [])


    return (
    <React.Fragment>
        <GradientBar />
        <div className="flex flex-col w-full border-l border-gray-200">
          <div className="p-4 border-b border-gray-300 bg-white">
            <Navbar />
          </div>



        <div>
            <div className = "flex">
              <Constelacion
                playAudio={play}
                sesionId={sesionId}
              />
                <div className = "flex flex-col p-2 mt-2 w-full h-full border-2" >
                    <div className = "h-720 border-2 border-gray-400">
                        <div className = "bg-gray-400 w-full mx-auto text-center" >CHAT</div>
                    </div>
                    <Chat nombre={userName}/>
                </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
};

export default ConstelacionWrapper
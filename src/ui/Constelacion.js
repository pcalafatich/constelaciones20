import React, {
    useContext
} from 'react';
import GradientBar from '../components/common/GradientBar';
import Tablero from '../images/tablero.png';
import Navbar from '../components/Navbar';
import MiniChat from '../components/MiniChat';
import uniqid from 'uniqid';
//import classNames from 'classnames';
import { AuthContext } from '../context/AuthContext';
import Sesion from '../models/Sesion';
import Cuadro from '../models/Cuadro';
import { Stage, Layer, Text, Arrow } from 'react-konva';
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
            cantFigurasH: 0,
            cantFigurasM: 0,
            flechas: [],
            draggedPieceTargetId: "",
            borderedId: "",
            selectedId: "",
            position: [],
            selectedId2: "",
            position2: []

        }
    }

    componentDidMount() {

        socket.on('movimiento_ajeno', move => {
            console.log("movimiento ajeno: " + move.selectedId + ", " + move.finalPosition);
            this.moverFigura(move.selectedId, move.finalPosition, this.state.sesionState, false)
            })

        socket.on('agrega_figura_ajeno', agrega => {
            // console.log("agrega figura ajeno: ",  agrega.cantFiguras);
            // console.log("agrega figura, tipo:", agrega.tipo);
            this.agregaFigura(agrega.cantFiguras, this.state.sesionState, agrega.tipo, false)
            })

        socket.on('elimina_figura_ajeno', elimina => {
            // ELIMINAR FLECHAS ANTES DE ELIMINAR FIGURAS
            this.eliminarFigura(elimina.eliminarFiguraId, this.state.sesionState,  false)
            })
                
        
        socket.on('agregar_flecha_ajena', flecha_ajena => {
            const idFlecha = flecha_ajena.idFlecha
            const desdeId = flecha_ajena.desdeId
            const hastaId = flecha_ajena.hastaId
            const isMyMove = flecha_ajena.isMyMove

            console.log('mimovimientoajeno:', isMyMove)


                
                this.agregarFlechaAjena(idFlecha, desdeId, hastaId)

        })

        socket.on('remover_flechas_ajena', () => {

            //console.log("isMyMove:", isMyMove)
            this.eliminarFlechas(false)
        })


   }


    startDragging = (e) => {
        this.setState({
            draggedPieceTargetId: e.target.attrs.id
        })
    }

    endDragging = (e) => {
        const actualSesion = this.state.sesionState
        const actualTablero = actualSesion.getTablero()
        const selectedId = this.state.draggedPieceTargetId
        const finalPosition = this.inferCoord(e.target.x() + 90, e.target.y() + 90, actualTablero)

        this.moverFigura(selectedId, finalPosition, actualSesion, true)
        //this.posicionActualFigura(selectedId, actualSesion)
    }

    onDblClickFigura = (e) => {

        // Si esta seleccionado quita la seleccion
        if (this.state.borderedId === e.target.attrs.id) {
            this.setState({
                borderedId: ""
            })

        // Si no está seleccionado guarda el objeto seleccionado en el estado
        } else {
            this.setState({
                borderedId: e.target.attrs.id
            })
        }
        
    }

    onClickFigura = (e) => {

       // console.log("posicion x:", e.target.x())
       // console.log("posicion y:", e.target.y())
        // Si esta seleccionado la figura 1 la deselecciona
        if (this.state.selectedId === e.target.attrs.id ) {
            this.setState({
                selectedId: "",
                position: []
            })
            return    
        }
        // Si esta seleccionado la figura 2 la deselecciona
        if (this.state.selectedId2 === e.target.attrs.id ) {
            this.setState({
                selectedId2: "",
                position2: []
            })
            return    
        }
        
        if (this.state.selectedId === "") {
            
            this.setState({
                selectedId: e.target.attrs.id

            })
            // const actualSesion = this.state.sesionState
            // const actualTablero = actualSesion.getTablero()
            const position = [e.target.x() + 30, e.target.y() + 50]
            this.setState({
                position: position

            })


        } else {

            this.setState({
                selectedId2: e.target.attrs.id
            })
            // const actualSesion = this.state.sesionState
            // const actualTablero = actualSesion.getTablero()
            const position2 = [e.target.x() + 30, e.target.y() + 50]
            this.setState({
                position2: position2

            })
        }
        
    }

    eliminarSeleccion = () => {

        this.setState({
            borderedId: "",
            selectedId: "",
            position: [],
            selectedId2: "",
            position2: []
        })

    } 
    

    eliminarFigura = (eliminarFiguraId, actualSesion, isMyMove) => {

        // ELIMINAR FLECHAS QUE SALEN O LLEGAN A LA FIGURA ANTES DE ELIMINARLA

        const filtredFlecha = this.state.flechas.filter(flecha => flecha.desdeId !== eliminarFiguraId && flecha.hastaId !== eliminarFiguraId );
            this.setState({ flechas: filtredFlecha });

        // UNA VEZ ELIMINADA LA FLECHA SE ELIMINA LA FIGURA
        
        actualSesion.eliminarFigura(eliminarFiguraId)

         // notificamos a los otros que hicimos un movimiento
         if (isMyMove) {
            socket.emit('elimina figura', {
                eliminarFiguraId: eliminarFiguraId,
                sesionId: this.props.sesionId
            })
        }


        // this.props.playAudio()

        // establecemos el state.
        this.setState({
            borderedId: "" ,
            sesionState: actualSesion
        })
    }

    moverFigura = (selectedId, finalPosition, actualSesion, isMyMove) => {

        actualSesion.moverFigura(selectedId, finalPosition)

        // notificamos a los otros que hicimos un movimiento
        if (isMyMove) {
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

    agregaFigura = (cantFiguras, actualSesion, tipo, isMyMove) => {

        //VERIFICAR QUE LA ENTRADA NO ESTA OCUPADA

        const puertaVacia = actualSesion.verificaPuerta()
        console.log('agregaFigura:', puertaVacia)

        if (puertaVacia === "empty") {
            
            actualSesion.agregarFigura(cantFiguras, tipo)
    
            // notificamos a los otros que agregamos una figura
            if (isMyMove) {
                socket.emit('agrega figura', {
                    cantFiguras: cantFiguras,
                    tipo: tipo,
                    sesionId: this.props.sesionId
                })
            }
    
        // this.props.playAudio()
    
        // establecemos el state.
            if (tipo === 'H') {
                this.setState({
                    sesionState: actualSesion,
                    cantFigurasH : this.state.cantFigurasH + 1
                })    
            } else {
                this.setState({
                    sesionState: actualSesion,
                    cantFigurasM : this.state.cantFigurasM + 1})
            }
            
        } else {

            alert("El casillero de entrada debe estar vacio antes de ingresar otra Figura!")
            
        }
    }

    posicionActualFigura = (figuraId) => {

        const actualSesion = this.state.sesionState

        const actualPosicion = actualSesion.posicionActualFigura(figuraId)

        //console.log("actual Posicion: ", actualPosicion)
        return actualPosicion

    }
    
    agregarFlecha = (isMyMove) => {

            
            if (this.state.selectedId !== "" && this.state.selectedId2 !== "" ) {
                
                const idFlecha = uniqid()
        
                const desdeId = this.state.selectedId
                const hastaId = this.state.selectedId2
    
                
                // notificamos a los otros que agregamos una flecha
                if (isMyMove) {
                    socket.emit('agregar flecha', {
                        idFlecha: idFlecha,
                        desdeId: desdeId,
                        hastaId: hastaId,
                        sesionId: this.props.sesionId,
                        isMyMove: false
                    })
                }
                
                this.setState({
                    flechas: [...this.state.flechas, {idFlecha, desdeId, hastaId}]
                })

                this.eliminarSeleccion()
                
            } else {
                
                alert("Debe seleccionar origen y destino de la flecha!")
    
            }

    }

    verificaExisteFlecha(idFlecha) {
        return this.state.flechas.some(flecha => idFlecha === flecha.idFlecha)
    }


    agregarFlechaAjena = (idFlecha, desdeId, hastaId) => {

        const existe = this.verificaExisteFlecha(idFlecha)

//        console.log('existe:', existe)

        if (!existe) {
            
            this.setState({
                flechas: [...this.state.flechas, {idFlecha, desdeId, hastaId}]
            })
        }


    }

    eliminarFlechas = (isMyMove) => {

        
        // notificamos a los otros que agregamos una figura
        if (isMyMove) {
            socket.emit('eliminar flechas', {                
                sesionId: this.props.sesionId
            })
        }
        
        this.setState({
            flechas: []
       })
    }
    
   
        
    revertirMovimiento = (selectedId) => {
        /**
         * Actualiza el tablero a como estaba antes del movimiento.
         */
        const oldSesionState = this.state.sesionState
        const oldTablero = oldSesionState.getTablero()
        const tmpSesionState = new Sesion(true)
        const tmpTablero = []

        for (var i = 0; i < 8; i++) {
            tmpTablero.push([])
            for (var j = 0; j < 8; j++) {
                if (oldTablero[i][j].getFiguraIdEnEsteCuadro() === selectedId) {
                    tmpTablero[i].push(new Cuadro(j, i, null, oldTablero[i][j].canvasCoord))
                } else {
                    tmpTablero[i].push(oldTablero[i][j])
                }
            }
        }

        // temporalmente elimina la figura que habia sido movida
        tmpSesionState.setTablero(tmpTablero)

        this.setState({
            sesionState: tmpSesionState,
            draggedPieceTargetId: "",
        })

        this.setState({
            sesionState: oldSesionState
        })
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
        return (<React.Fragment>
            <div className = "flex gap-4 p-4"> 
                <div className = "flex flex-col h-720 w-48 items-center gap-4 rounded border-2">
                    <div className = "bg-gray-400 w-full mx-auto text-center" >OPCIONES</div>
                    <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => this.agregaFigura(this.state.cantFigurasH, this.state.sesionState, 'H', true)}>
                        <div className="px-3">
                            <p className="text-white">Agrega Figura H</p>
                        </div>
                    </button>

                    <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => this.agregaFigura(this.state.cantFigurasM, this.state.sesionState, 'M', true)}>
                        <div className="px-3">
                            <p className="text-white">Agrega Figura M</p>
                        </div>
                    </button>

                    <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => this.eliminarFigura(this.state.borderedId, this.state.sesionState, true) }>
                        <div className="px-3">
                            <p className="text-white">Eliminar Figura</p>
                        </div>
                    </button>

                    <button
                        disabled={this.state.disableFlecha}
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => this.agregarFlecha(true) }>
                        <div className="px-3">
                            <p className="text-white">Agregar Flecha</p>
                        </div>
                    </button>

                    <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => this.eliminarSeleccion() }>
                        <div className="px-3">
                        <p className="text-white">Elimina seleccion</p>
                        </div>
                    </button>

                    <button
                        className="flex rounded-full items-center py-3 px-3 bg-gradient focus:outline-none shadow-lg"
                        onClick={() => this.eliminarFlechas(true) }>
                        <div className="px-3">
                        <p className="text-white">Elimina Flechas</p>
                        </div>
                    </button>

                </div>

                <div style = {{
                    backgroundImage: `url(${Tablero})`,
                    width: "720px",
                    height: "720px"}}>
                    <Stage width = {720} height = {720}>
                    <Layer>
                    <Text text="Debe mover la figura ingresada antes de ingresar la siguiente - Para eliminar una figura hacer doble click sobre ella" x={5} y={5} />
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
                                            borderedId = {this.state.borderedId}
                                            selectedId = {this.state.selectedId}
                                            selectedId2 = {this.state.selectedId2}
                                            onDragStart = {this.startDragging}
                                            onDragEnd = {this.endDragging}
                                            onDblClick = {this.onDblClickFigura}
                                            onClick = {this.onClickFigura}
                                            id = {Cuadro.getFiguraIdEnEsteCuadro()}
                                            />)
                                }
                                return true
                            })}
                        </React.Fragment>)
                        })}
                        {this.state.flechas.map(flecha => {
                            console.log("Flechas:", this.state.flechas)
                            const origen = this.posicionActualFigura(flecha.desdeId)
                            const destino = this.posicionActualFigura(flecha.hastaId)
                            // console.log("origen: ", origen)
                            // console.log("destino: ", destino)

                             //const desde = flecha.desde
                             //const hasta = flecha.hasta
                             return (
                              <Arrow
                                key={flecha.idFlecha}
                                points={[origen[0], origen[1], destino[0], destino[1]]}
                                pointerLength = {10}
                                pointerWidth = {10}
                                fill = {'black'}
                                stroke = {'black'}
                                strokeWidth = {1}
                                />
                            );
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
//    const [play] = useSound(chessMove);
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
                    <Constelacion sesionId={sesionId} />
                <div className = "flex flex-col w-full" >
                    <MiniChat nombre={userName}/>
                </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
};

export default ConstelacionWrapper
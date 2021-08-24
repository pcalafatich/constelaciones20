import Personaje from './Personaje'
import Cuadro from './Cuadro'
// al generar coordenadas: [y][x].


class Sesion {
    constructor() {
        //  esta es la linea que inicia el Tablero
        this.tablero = this.creaTableroInicial() // tablero inicial

        // this.toCoord = {
        //     0:8, 1:7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1
        // }

    }

    getTablero() {
        return this.tablero
    }


    setTablero(newTablero) {
        this.tablero = newTablero
    }

    moverFigura(figuraId, to) {

        console.log("FiguraId:", figuraId);
        console.log("To:", to);
        
        /* Mover figura Cual, hacia donde */

        const to2D = {
            105:0, 195:1, 285: 2, 375: 3, 465: 4, 555: 5, 645: 6, 735: 7
        }

        // console.log("SESION - figuraId", figuraId)
        let actualTablero = this.getTablero()
        const coordenadasFigura = this.encontrarFigura(actualTablero, figuraId)
        // console.log("coordenadasFigura", coordenadasFigura )

        // Si no puede encontrar las coordenadas de la figura
        // es qu la figura no esta en el Tablero

        if (!coordenadasFigura) {
            return
        }

        const y = coordenadasFigura[1]
        const x = coordenadasFigura[0]

        // nuevas coordenadas
        const to_y = to2D[to[1]]
        const to_x = to2D[to[0]]

        const originalFigura = actualTablero[y][x].getFigura()
        // console.log("originalFigura", originalFigura);

        // Actualizamos el modelo del tablero con la posicion nueva
        actualTablero[to_y][to_x].setFigura(originalFigura);
        if (y !== to_y || x !== to_x) {
          actualTablero[y][x].setFigura(null);
       }

        // actualizamos el Tablero
        this.setTablero(actualTablero)
    }

    agregarFigura(cantFiguras, tipo) {

        const i = cantFiguras;
        const sexo = tipo;
        console.log('Entrado');
        // const to2D = {
        //     105:0, 195:1, 285: 2, 375: 3, 465: 4, 555: 5, 645: 6, 735: 7
        // }
        if (sexo === 'H') {
            const figuras = [   "h00",
                                "h01",      
                                "h02", 
                                "h03", 
                                "h04",
                                "h05", 
                                "h06", 
                                "h07", 
                                "h08",
                                "h09", 
                                "h10", 
                                "h11", 
                                "h12",
                                "h13", 
                                "h14", 
                                "h15",
                            ]
            const figurasId = [ "H00",
                                "H01",
                                "H02", 
                                "H03", 
                                "H04",
                                "H05", 
                                "H06", 
                                "H07", 
                                "H08",
                                "H09", 
                                "H10", 
                                "H11", 
                                "H12",
                                "H13", 
                                "H14", 
                                "H15",
                            ]
                            let actualTablero = this.getTablero();
                            console.log("Actual Tablero:", actualTablero)
                            actualTablero[0][0].setFigura(new Personaje(figuras[i], figurasId[i]))
                            // // actualizamos el Tablero
                            this.setTablero(actualTablero);
                            console.log('Salido');
                            return
                    
        } else {
            const figuras = [   "m00",
                                "m01", 
                                "m02", 
                                "m03", 
                                "m04",
                                "m05", 
                                "m06", 
                                "m07", 
                                "m08",
                                "m09", 
                                "m10", 
                                "m11", 
                                "m12",
                                "m13", 
                                "m14", 
                                "m15",
                            ]
            const figurasId = [ "M00",
                                "M01",
                                "M02", 
                                "M03", 
                                "M04",
                                "M05", 
                                "M06", 
                                "M07", 
                                "M08",
                                "M09", 
                                "M10", 
                                "M11", 
                                "M12",
                                "M13", 
                                "M14", 
                                "M15",
                            ]            
                            let actualTablero = this.getTablero();
                            actualTablero[0][0].setFigura(new Personaje(figuras[i], figurasId[i]))
                            // // actualizamos el Tablero
                            this.setTablero(actualTablero);
                            console.log('Salido');
                            return
        }
    }
    
   eliminarFigura(figuraId) {

        console.log("Eliminar FiguraId:", figuraId);
        
        // console.log("SESION - figuraId", figuraId)
        let actualTablero = this.getTablero()
        const coordenadasFigura = this.encontrarFigura(actualTablero, figuraId)

        if (!coordenadasFigura) {
            console.log("No encuentro la figura");
            return
        }

        const y = coordenadasFigura[1]
        const x = coordenadasFigura[0]

        // Actualizamos el modelo del tablero con la posicion nueva
        actualTablero[y][x].setFigura(null);
    
        // actualizamos el Tablero
        this.setTablero(actualTablero)
    }

   
    encontrarFigura(Tablero, figuraId) {
      // tablero, String -> [Int, Int]
      //  console.log("figura buscada: " + figuraId)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (Tablero[i][j].getFiguraIdEnEsteCuadro() === figuraId) {
                    return [j, i]
                }
            }
        }
    }

    creaTableroInicial() {
        // Dibujamos el tablero de 8 x 8 casillas
        let tableroInicial = []
        for (let i = 0; i < 8; i++) {
            tableroInicial.push([])
            for (let j = 0; j < 8; j++) {
                // j es horizontal
                // i es vertical
                const coordenadasEnCanvas = [((j + 1) * 90 + 15), ((i + 1) * 90 + 15)]
                const cuadrovacio = new Cuadro(j, i, null, coordenadasEnCanvas)

                tableroInicial[i].push(cuadrovacio)
            }
        }
                
        return tableroInicial
    }
}

export default Sesion

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

    moverFigura(figuraId, to, isMyMove) {

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

    agregarFigura(cantFiguras) {

        const i = cantFiguras;
        console.log('Entrado');
        const to2D = {
            105:0, 195:1, 285: 2, 375: 3, 465: 4, 555: 5, 645: 6, 735: 7
        }
        
        const figuras = ["hombre_amarillo", "hombre_rojo", "hombre_verde", "hombre_celeste","hombre_naranja", "hombre_gris", "hombre_negro", "hombre_azul"]
        const figurasId = ["Hombre Amarillo", "Hombre Rojo", "Hombre Verde", "Hombre Celeste", "Hombre Naranja", "Hombre Gris", "Hombre Negro", "Hombre Azul"]
        // console.log("SESION - figuraId", figuraId)
        let actualTablero = this.getTablero();

        // const figuraId = figurasId[0];
        // console.log('FiguraID:', figuraId)
        
        //const coordenadasFigura = this.encontrarFigura(actualTablero, figuraId);
        // console.log('Coordenadas figura:', coordenadasFigura);

        // (coordenadasFigura === null) ?
        //         //  console.log('El valor es null')
        actualTablero[0][7].setFigura(new Personaje(figuras[i], figurasId[i]))
        //         :
        //         // console.log('El valor NO es null')
        //        actualTablero[1][7].setFigura(new Personaje(figuras[1], figurasId[1]))

        // // actualizamos el Tablero
        this.setTablero(actualTablero);
        
        // console.log(actualTablero[0][7]);   

        console.log('Salido');
        return
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
        
        // Definimos ubicacion inicial de las figuras
        // const figuras = ["hombre_amarillo", "hombre_rojo", "hombre_verde", "hombre_celeste","hombre_naranja", "hombre_gris", "hombre_negro", "hombre_azul"]
        // const figurasId = ["Hombre Amarillo", "Hombre Rojo", "Hombre Verde", "Hombre Celeste", "Hombre Naranja", "Hombre Gris", "Hombre Negro", "Hombre Azul"]
        // tableroInicial[0][0].setFigura(new Personaje(figuras[0], figurasId[0]))
        // tableroInicial[0][1].setFigura(new Personaje(figuras[1], figurasId[1]))
        // tableroInicial[0][2].setFigura(new Personaje(figuras[2], figurasId[2]))
        // tableroInicial[0][3].setFigura(new Personaje(figuras[3], figurasId[3]))
        // tableroInicial[0][4].setFigura(new Personaje(figuras[4], figurasId[4]))
        // tableroInicial[0][5].setFigura(new Personaje(figuras[5], figurasId[5]))
        // tableroInicial[0][6].setFigura(new Personaje(figuras[6], figurasId[6]))
        // tableroInicial[0][7].setFigura(new Personaje(figuras[7], figurasId[7]))
        return tableroInicial
    }
}

export default Sesion

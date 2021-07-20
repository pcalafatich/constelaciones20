class Cuadro {
    constructor(x, y, figuraIdEnEsteCuadro, canvasCoord) {
        this.x = x // Int 0 < x < 7
        this.y = y // Int 0 < y < 7
        this.figuraIdEnEsteCuadro = figuraIdEnEsteCuadro // figura || null
        this.canvasCoord = canvasCoord
    }

    setFigura(newFigura) {
        if (newFigura === null && this.figuraIdEnEsteCuadro === null) {
            return
        } else if (newFigura === null) {
            // la funcion que llama a Cuadro quiere la Figura que esta en él.
            this.figuraIdEnEsteCuadro.setCuadro(undefined)
            this.figuraIdEnEsteCuadro = null
        } else if (this.figuraIdEnEsteCuadro === null) {
            // la funcion que llama a Cuadro quiere asignarle una nueva Figura
            this.figuraIdEnEsteCuadro = newFigura
            newFigura.setCuadro(this)
        } else if (this.getFiguraIdEnEsteCuadro() !== newFigura.id) {
            // la funcion que llama a Cuadro quiere cambiar la Figura que esta ubicada en él
            console.log("Figura cambiada????")
            this.figuraIdEnEsteCuadro = newFigura
            newFigura.setCuadro(this)
        }
    }

    removeFigura() {
        this.figuraIdEnEsteCuadro = null
    }

    getFigura() {
        return this.figuraIdEnEsteCuadro
    }

    getFiguraIdEnEsteCuadro() {
        if (this.figuraIdEnEsteCuadro === null) {
            return "empty"
        }
        return this.figuraIdEnEsteCuadro.id
    }

    isOccupied() {
        return this.figuraIdEnEsteCuadro != null
    }

    getCoord() {
        return [this.x, this.y]
    }

    getCanvasCoord() {
        return this.canvasCoord
    }
}

export default Cuadro

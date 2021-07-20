class Personaje {
    constructor(name, id) {
        this.name = name // string
        this.id = id // string
    }

    setCuadro(newCuadro) {
        // Define el cuadro donde la figura esta ubicada. 
        // console.log(newCuadro)
        if (newCuadro === undefined) {
            this.cuadroDeLaFigura = newCuadro
            return 
        }

        if (this.cuadroDeLaFigura === undefined) {
            this.cuadroDeLaFigura = newCuadro
            newCuadro.setFigura(this)
        }

        const isnewCuadroDiferente = this.cuadroDeLaFigura.x !== newCuadro.x || this.cuadroDeLaFigura.y !== newCuadro.y

        if (isnewCuadroDiferente) {
            // console.log("set")
            this.cuadroDeLaFigura = newCuadro
            newCuadro.setFigura(this)
        }
    }

    getCuadro() {
        return this.cuadroDeLaFigura
    }
}

export default Personaje
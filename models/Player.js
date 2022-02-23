const { set, get } = require('express/lib/response')
const {DataTypes} = require('sequelize')
 

module.exports = sequelize => {
    sequelize.define('Player',{
        firstName: {
            type:DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING,
            set(value){
                //set me va a permitir configurar como quiero que se me 
                //guarde el dato
                this.setDataValue('lastName', value.toUpperCase())
            },
            get(){
                return this.getDataValue('lastName', + ' MI APELLIDO')
            }
        },
        username: {
            type: DataTypes.STRING,
            //username no va a admitir valores en null, allowNull: false,
            allowNull: false,
            //que sea unico
            unique:true
        },
        season:{
            //me da un listado de posibles valores que podes ingresar
            //solo puede guardar ('summer', 'winter', 'spring', 'autumn'
            type: DataTypes.ENUM('summer', 'winter', 'spring', 'autumn')
        },
        birthday: {
            type: DataTypes.DATEONLY,
            //si no me pasas el valor, pongo un defaultvalue
            //si no me pasas el valor te pongo el dia de hoy
            defaultValue: DataTypes.NOW
        },
        number: {
            type: DataTypes.INTEGER,
            //tenemos que validar en el front en el back y en la base de datos
            //nos aseguramos que nunca nos permita guardar codigo que nos 
            //permita borrar la informacion
            //tranquilamente nos pueden inyectar un codigo que es delete all 
            //y borrar la base de datos
            validate: {
                min: 1,
                max: 13,
                // isEven(value){
                //     if(value %2 ==! 0) throw new Error('Solo se aceptan numeros pares')
                // }
            },
            //el metodo get va a decir como quiero que se devuelva la informacion
            // en la db se sigue guardando el numero solo pero
            //cuando consulto el dato
            //se me devuelve lo setenciado en esta funcion
            get(){
                //cuando estoy trabajando sobre el mismo
                //atributo va getDataValue
                return this.getDataValue('number')+" mi numero"
            }
        },
        fullName: {
            //cuando digo que es un tipo de dato virtual digo
            //no lo guardes en la db
            //pero cuando te consulto sobre un registro
            //por ejemplo findByPk(1)
            //dame esta informacionb
            type: DataTypes.VIRTUAL,
            get(){
                //pero cuando no va this.firstName
                return `${this.firstName} ${this.lastName}`
            }
        }
    })
}

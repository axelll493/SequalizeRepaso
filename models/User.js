const {DataTypes} = require('sequelize')

//Lo que voy a hacer es generar este modelo
//El modelo se va a llamar user, y lo va hacer prural sequalize
//users
//Si yo no defino mi pramary key, sequalize lo define por si solo

module.exports = sequelize=>{
    sequelize.define('User',{
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    }
    //si yo no quiero que me aparesca  "createdAt"  "updatedAt"
    
},{
    timestamps:false,
    //quiero que el createat no este
    // createdAt:false,
    // updatedAt: "Actualizacion"
});
}

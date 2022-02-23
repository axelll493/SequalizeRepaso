const {Sequelize, DataTypes} = require('sequelize');
const modelUser = require('./models/User')
const modelPlayer = require('./models/Player')

//instancia una posible coneccion 
const sequelize = new Sequelize(`postgres://postgres:raikiri493aa@localhost:5432/repaso`,
    { 
        //no quiero que me vayas contando todo lo que haces, quiero que simplemente lo hagas
        logging:false
    }
);


modelPlayer(sequelize);
modelUser(sequelize);

sequelize.define("Team",{
    name: {
        type: DataTypes.STRING
    }
})

let {User, Player, Team} = sequelize.models
// console.log(User)
// console.log(Player)

// User.sync({force:true});
// Player.sync({force:true});
// console.log(sequelize.models)

Player.belongsToMany(Team, {through: "PlayerXTeam"})
Team.belongsToMany(Player, {through: "PlayerXTeam"})

module.exports = {
    ...sequelize.models,
    db: sequelize,
}
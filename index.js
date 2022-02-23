const express = require('express')
const { db, Player, User, Team } = require("./db")
let server = express();
server.use(express.json())
const { Op } = require("sequelize");
const res = require('express/lib/response');





//el create lo almacena, los datos en la base de datos
//insertar valores a mi tabla

server.post('/player', async (req, res) => {
    //no le pase el birthday
    const { firstName, lastName, username, season, number } = req.body
    try {
        let newPlayer = await Player.create({
            firstName, lastName, username, season, number
        })
        res.json(newPlayer)
        //mi jugador creado
        console.log(newPlayer)
        //AHORA ME muestra unicamente el objeto creado
        console.log(newPlayer.toJSON())
    } catch (e) {
        res.send(e)
    }
})

server.get('/players', async (req, res) => {
    const { name } = req.query
    //vas a buscar por nombre
    if (name) {
        try {
            //select * from "Players" where firstName=name
            //va a buscar mi dato, por el nombre
            //findAll devuelve un arreglo
            let player = await Player.findAll({
                where: {
                    firstName: name
                }
            })
            res.json(player ? player : "No hay jugadores con dicho nombre")
        } catch (e) {
            res.send(e)
        }


    } else {
        try {
            // select * from "Players"
            //si no te vino el nombre por query
            //quiero que me encuentres todos los jugadores
            let players = await Player.findAll();
            res.json(players.length > 0 ? players : "No hay jugadores creados")
        } catch (e) {
            res.send(e)
        }
    }
})


server.get('/players/name', async (req, res) => {
    try {
        //me a devolver todos los primeros nombre
        res.json(await Player.findAll({
            //que le pase como atributo firstName
            //me va  a devolver el atribute que yo quiera
            attributes: ['firstName']
        }))
    } catch (e) {
        res.send(e)
    }
})

server.get('players/and', async (req, res) => {
    //select * from "Players"
    try {
        let playera = await Player.findAll({
            where: {
                [Op.and]: [
                    { firstName: "Axel" },
                    { lastName: 'Beltran' }
                ]
            }
        })
        res.json(playera)
    } catch (e) {
        res.send(e)
    }
})

//Findpk 
server.get('/player/:id', async (req, res) => {
    try {
        let { id } = req.params
        //si lo encuentra devuelve el objeto
        //si no lo encuentra devuelcve null
        let player = await Player.findByPk(id);
        res.json(player ? player : "No hay un jugador con ese id")
    } catch (e) {
        res.send(e)
    }
})

//FindOrCreate busca si no existe segun las condiciones de busqueda y 
//si no encuentra uno crea uno nuevo

server.post('/player/findOrCreate', async (req, res)=> {
    const { firstName, lastName, username, season, number } = req.body
    //findOrCreated devuelve un arreglo
    //donde la primer posicion -> arreglo[0]
    //donde el jugador sea creado
    //me va a devolver un boleano donde se encontro o no el jugador
    try {
        const [player, created] = await Player.findOrCreate({
            where: { username },
            //default son los valores que deberia escribir si no lo encuentra
            defaults: {
                firstName, lastName, username, season, number
            }
        })
        res.json({player, created})
    } catch (e) {
        res.send(e)
    }

})

server.put('/players', async (req, res) =>{
    try{
        //en response se va a almacenar la cantidad de registros
        //modificados
        const response = await Player.update(
            //cambia su number a 10
            {number: 10},
            {
                //busca por axel, en mi base de datos
                where: {
                firstName:"Axel",
            },
        }
        );
        res.send(`${response} jugadores modificados`)
    }catch(e){
        res.send(e)
    }
})

server.delete('/player/:id', async (req,res)=> {
    try{
        let {id} = req.params;
        //delete from player where id = id
        res.json(await Player.destroy({
            where: {id}
        }))
    }catch(e){
        res.send(e)
    }
})

server.post('/teams', async (req, res)=>{
    let {name} = req.body;
    let team = await Team.create({
        name
    })
    res.send(team)
})

server.put('/transfer/:id', async(req, res)=> {
    //set  //el set borra y pisa
    //add //el add agrega sobre lo que tiene el set borra
    // const {idPlayer, idTeam} = req.body;
    //jugador
    //equipo
    //quiero crearme un jugador, o actualizar un jugados
    //y se asocia a muchos equipos
    //o que un equipo se asocie a muchos jugadores
    const {id} = req.params;
    //al player que acabo de encontrar le voy a agregar
    let player = await Player.findByPk(id);
    //un equipo
    //lo que le pasamos son id [1, 2, 3]
    //set teams
    //addteams
    //encontra el jugador una vez que encontres el jugador
    //agregale estos equipos 1, 2, 3
    //set team pisa y borra los datos anteriores
    // res.json(await player.setTeams([1, 2, 3]))
    res.json(await player.addTeams([1, 2, 3]))
})

server.get('/loadAll', async(req, res) => {
    //lo que estoy haciendo es un join
    const allData = await Player.findAll({
        incluide: Team
    })
    res.json(allData)
    // const allData = await Player.findAll({
    //     incluide: [
    //         {
    //             //incluime el modelo team
    //             model: Team,
    //             //que atributos quiero que me traiga
    //             attributes: ['firstName', 'lastName', 'name'],
    //             through: {
    //                 attributes: []
    //             }
    //         }
    //     ]
    // })
})
//traeme todos los jugadores con sus respectivos equipos

db.sync({ force: false }).then(() => {
    server.listen(3001, () => {
        console.log('%s listening at 3001');
    });
});
// server.listen(3000, ()=>{
//     console.log('listeen on port 3000')
//     db.sequelize.sync({force:true});
// })
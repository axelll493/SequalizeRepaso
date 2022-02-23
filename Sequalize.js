// https://runebook.dev/es/docs/sequelize/manual/model-querying-basics

// Consultas INSERT simples
// Primero,un ejemplo sencillo:

// // Crea un nuevo usuario
// const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
// console.log("Jane's auto-generated ID:", jane.id);
// El método Model.create() es una forma abreviada de crear una instancia sin guardar con Model.build() y guardar la instancia con instance.save() .

// También es posible definir qué atributos se pueden establecer en el método de create . Esto puede ser especialmente útil si crea entradas de base de datos basadas en un formulario que puede ser llenado por un usuario. El uso de eso, por ejemplo, le permitiría restringir el modelo de User para establecer solo un nombre de usuario y una dirección, pero no una marca de administrador:

// const user = await User.create({
//   username: 'alice123',
//   isAdmin: true
// }, { fields: ['username'] });
// // supongamos que el valor predeterminado de isAdmin es falso
// console.log(user.username); // 'alice123'
// console.log(user.isAdmin); // false
// Consultas SELECT simples
// Puede leer la tabla completa de la base de datos con el método findAll :

// // Encuentra todos los usuarios
// const users = await User.findAll();
// console.log(users.every(user => user instanceof User)); // true
// console.log("All users:", JSON.stringify(users, null, 2));
// SELECT * FROM ...
// Especificación de atributos para las consultas SELECT
// Para seleccionar solo algunos atributos, puede usar la opción de attributes :

// Model.findAll({
//   attributes: ['foo', 'bar']
// });
// SELECT foo, bar FROM ...
// Los atributos pueden ser renombrados usando una matriz anidada:

// Model.findAll({
//   attributes: ['foo', ['bar', 'baz'], 'qux']
// });
// SELECT foo, bar AS baz, qux FROM ...
// Puede usar sequelize.fn para hacer agregaciones:

// Model.findAll({
//   attributes: [
//     'foo',
//     [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'],
//     'bar'
//   ]
// });
// SELECT foo, COUNT(hats) AS n_hats, bar FROM ...
// Cuando utilice la función de agregación, debe darle un alias para poder acceder a ella desde el modelo. En el ejemplo anterior, puede obtener el número de sombreros con instance.n_hats .

// A veces puede ser agotador enumerar todos los atributos del modelo si sólo se quiere añadir una agregación:

// // Esta es una forma tediosa de obtener la cantidad de sombreros (junto con cada columna)
// Model.findAll({
//   attributes: [
//     'id', 'foo', 'bar', 'baz', 'qux', 'hats', // Tuvimos que listar todos los atributos ...
//     [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'] // Para agregar la agregación ...
//   ]
// });

// // Esto es más corto y menos propenso a errores porque aún funciona si agrega / elimina atributos de su modelo más adelante
// Model.findAll({
//   attributes: {
//     include: [
//       [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats']
//     ]
//   }
// });
// SELECT id, foo, bar, baz, qux, hats, COUNT(hats) AS n_hats FROM ...
// Del mismo modo,también es posible eliminar algunos atributos seleccionados:

// Model.findAll({
//   attributes: { exclude: ['baz'] }
// });
// -- Assuming all columns are 'id', 'foo', 'bar', 'baz' and 'qux'
// SELECT id, foo, bar, qux FROM ...
// Aplicación de las cláusulas WHERE
// La opción where se utiliza para filtrar la consulta. Hay muchos operadores para usar para la cláusula where , disponibles como Símbolos de Op .

// Lo básico
// Post.findAll({
//   where: {
//     authorId: 2
//   }
// });
// // SELECCIONAR * DESDE la publicación DONDE authorId = 2
// Observe que no se pasó explícitamente ningún operador (de Op ), por lo que Sequelize asumió una comparación de igualdad por defecto. El código anterior es equivalente a:

// const { Op } = require("sequelize");
// Post.findAll({
//   where: {
//     authorId: {
//       [Op.eq]: 2
//     }
//   }
// });
// // SELECCIONAR * DESDE la publicación DONDE authorId = 2
// Se pueden pasar varios controles:

// Post.findAll({
//   where: {
//     authorId: 12
//     status: 'active'
//   }
// });
// // SELECT * FROM post WHERE authorId = 12 AND status = 'active';
// Al igual que Sequelize infirió el operador Op.eq en el primer ejemplo, aquí Sequelize infirió que la persona que llama quería un AND para las dos comprobaciones. El código anterior es equivalente a:

// const { Op } = require("sequelize");
// Post.findAll({
//   where: {
//     [Op.and]: [
//       { authorId: 12 },
//       { status: 'active' }
//     ]
//   }
// });
// // SELECCIONAR * DESDE la publicación DONDE authorId = 12 AND status = 'active';
// Un OR puede realizar fácilmente de una manera similar:

// const { Op } = require("sequelize");
// Post.findAll({
//   where: {
//     [Op.or]: [
//       { authorId: 12 },
//       { authorId: 13 }
//     ]
//   }
// });
// // SELECCIONAR * DE la publicación DONDE authorId = 12 O authorId = 13;
// Dado que lo anterior era un OR que involucraba el mismo campo, Sequelize le permite usar una estructura ligeramente diferente que es más legible y genera el mismo comportamiento:

// const { Op } = require("sequelize");
// Post.destroy({
//   where: {
//     authorId: {
//       [Op.or]: [12, 13]
//     }
//   }
// });
// // BORRAR DE la publicación DONDE authorId = 12 O authorId = 13;
// Operators
// Sequelize ofrece varios operadores.

// const { Op } = require("sequelize");
// Post.findAll({
//   where: {
//     [Op.and]: [{ a: 5 }, { b: 6 }],            // (a = 5) Y (b = 6)
//     [Op.or]: [{ a: 5 }, { b: 6 }],             // (a = 5) O (b = 6)
//     someAttribute: {
//       // Basics
//       [Op.eq]: 3,                              // = 3
//       [Op.ne]: 20,                             // != 20
//       [Op.is]: null,                           // ES NULO
//       [Op.not]: true,                          // NO ES VERDAD
//       [Op.or]: [5, 6],                         // (algún atributo = 5) O (algún atributo = 6)

//       // Usando identificadores de columna específicos de dialecto (PG en el siguiente ejemplo):
//       [Op.col]: 'user.organization_id',        // = "usuario". "organization_id"

//       // Comparaciones de números
//       [Op.gt]: 6,                              // > 6
//       [Op.gte]: 6,                             // >= 6
//       [Op.lt]: 10,                             // < 10
//       [Op.lte]: 10,                            // <= 10
//       [Op.between]: [6, 10],                   // ENTRE 6 Y 10
//       [Op.notBetween]: [11, 15],               // NO ENTRE 11 Y 15

//       // Otros operadores

//       [Op.all]: sequelize.literal('SELECT 1'), //> TODOS (SELECCIONAR 1)

//       [Op.in]: [1, 2],                         // EN [1, 2]
//       [Op.notIn]: [1, 2],                      // NO EN [1, 2]

//       [Op.like]: '%hat',                       // COMO '% sombrero'
//       [Op.notLike]: '%hat',                    // NO ME GUSTA '% hat'
//       [Op.startsWith]: 'hat',                  // COMO 'hat%'
//       [Op.endsWith]: 'hat',                    // COMO '% sombrero'
//       [Op.substring]: 'hat',                   // ME GUSTA '% hat%'
//       [Op.iLike]: '%hat',                      // ILIKE '% hat' (no distingue entre mayúsculas y minúsculas) (solo PG)
//       [Op.notILike]: '%hat',                   // NO ME GUSTA '% hat' (solo PG)
//       [Op.regexp]: '^[h|a|t]',                 // REGEXP / ~ '^ [h | a | t]' (solo MySQL / PG)
//       [Op.notRegexp]: '^[h|a|t]',              // NO REGEXP /! ~ '^ [H | a | t]' (solo MySQL / PG)
//       [Op.iRegexp]: '^[h|a|t]',                // ~ * '^ [h | a | t]' (solo PG)
//       [Op.notIRegexp]: '^[h|a|t]',             //! ~ * '^ [h | a | t]' (solo PG)

//       [Op.any]: [2, 3],                        // CUALQUIER ARRAY [2, 3] :: INTEGER (solo PG)

//       // En Postgres, Op.like/Op.iLike/Op.notLike se puede combinar con Op.any:
//       [Op.like]: { [Op.any]: ['cat', 'hat'] }  // COMO CUALQUIER ARRAY ['gato', 'sombrero']

//       // Hay más operadores de rango de solo postgres, ver más abajo
//     }
//   }
// });
// Sintaxis Op.in para Op.in
// Pasar una matriz directamente a la opción where usará implícitamente el operador IN :

// Post.findAll({
//   where: {
//     id: [1,2,3] // Same as using `id: { [Op.in]: [1,2,3] }`
//   }
// });
// // SELECT ... FROM "posts" AS "post" WHERE "post"."id" IN (1, 2, 3);
// Combinaciones lógicas con operadores
// Los operadores Op.and , Op.or y Op.not se pueden utilizar para crear comparaciones lógicas anidadas arbitrariamente complejas.

// Ejemplos con Op.and y Op.or
// const { Op } = require("sequelize");

// Foo.findAll({
//   where: {
//     rank: {
//       [Op.or]: {
//         [Op.lt]: 1000,
//         [Op.eq]: null
//       }
//     },
//     // rango <1000 O el rango ES NULO

//     {
//       createdAt: {
//         [Op.lt]: new Date(),
//         [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
//       }
//     },
//     // createdAt <[marca de tiempo] Y createdAt> [marca de tiempo]

//     {
//       [Op.or]: [
//         {
//           title: {
//             [Op.like]: 'Boat%'
//           }
//         },
//         {
//           description: {
//             [Op.like]: '%boat%'
//           }
//         }
//       ]
//     }
//     // título COMO 'Barco%' O descripción COMO '% barco%'
//   }
// });
// Ejemplos con Op.not
// Project.findAll({
//   where: {
//     name: 'Some Project',
//     [Op.not]: [
//       { id: [1,2,3] },
//       {
//         description: {
//           [Op.like]: 'Hello%'
//         }
//       }
//     ]
//   }
// });
// Lo anterior generará:

// SELECT *
// FROM `Projects`
// WHERE (
//   `Projects`.`name` = 'a project'
//   AND NOT (
//     `Projects`.`id` IN (1,2,3)
//     OR
//     `Projects`.`description` LIKE 'Hello%'
//   )
// )
// Consultas avanzadas con funciones (no sólo columnas)
// ¿Qué pasa si desea obtener algo como WHERE char_length("content") = 7 ?

// Post.findAll({
//   where: sequelize.where(sequelize.fn('char_length', sequelize.col('content')), 7)
// });
// // SELECT ... FROM "posts" AS "post" WHERE char_length("content") = 7
// Tenga en cuenta el uso de los métodos sequelize.fn y sequelize.col , que deben usarse para especificar una llamada de función SQL y una columna de tabla, respectivamente. Estos métodos deben usarse en lugar de pasar una cadena simple (como char_length(content) ) porque Sequelize necesita tratar esta situación de manera diferente (por ejemplo, usando otros enfoques de escape de símbolos).

// ¿Y si necesita algo más complejo?

// Post.findAll({
//   where: {
//     [Op.or]: [
//       sequelize.where(sequelize.fn('char_length', sequelize.col('content')), 7),
//       {
//         content: {
//           [Op.like]: 'Hello%'
//         }
//       },
//       {
//         [Op.and]: [
//           { status: 'draft' },
//           sequelize.where(sequelize.fn('char_length', sequelize.col('content')), {
//             [Op.gt]: 10
//           })
//         ]
//       }
//     ]
//   }
// });
// Lo anterior genera el siguiente SQL:

// SELECT
//   ...
// FROM "posts" AS "post"
// WHERE (
//   char_length("content") = 7
//   OR
//   "post"."content" LIKE 'Hello%'
//   OR (
//     "post"."status" = 'draft'
//     AND
//     char_length("content") > 10
//   )
// )
// Operadores de rango sólo para Postgres
// Los tipos de rango pueden ser consultados con todos los operadores apoyados.

// Tenga en cuenta que el valor de rango proporcionado también puede definir la inclusión / exclusión limitada .

// [Op.contains]: 2,            // @> '2' :: integer (el rango PG contiene el operador del elemento)
// [Op.contains]: [1, 2],       // @> [1, 2) (el rango de PG contiene el operador de rango)
// [Op.contained]: [1, 2],      // <@ [1, 2) (el rango de PG está contenido por el operador)
// [Op.overlap]: [1, 2],        // && [1, 2) (operador de superposición de rango de PG (tener puntos en común))
// [Op.adjacent]: [1, 2],       // - | - [1, 2) (el rango de PG es adyacente al operador)
// [Op.strictLeft]: [1, 2],     // << [1, 2) (rango de PG estrictamente a la izquierda del operador)
// [Op.strictRight]: [1, 2],    // >> [1, 2) (rango PG estrictamente a la derecha del operador)
// [Op.noExtendRight]: [1, 2],  // & <[1, 2) (el rango de PG no se extiende a la derecha del operador)
// [Op.noExtendLeft]: [1, 2],   // &> [1, 2) (el rango de PG no se extiende a la izquierda del operador)
// Desaprobado:Operador Aliases
// En Sequelize v4, era posible especificar cadenas para referirse a operadores, en lugar de usar símbolos. Esto ahora está en desuso y se desaconseja mucho, y probablemente se eliminará en la próxima versión principal. Si realmente lo necesita, puede pasar la opción operatorAliases en el constructor Sequelize.

// Por ejemplo:

// const { Sequelize, Op } = require("sequelize");
// const sequelize = new Sequelize('sqlite::memory:', {
//   operatorsAliases: {
//     $gt: Op.gt
//   }
// });

// // Ahora podemos usar `$ gt` en lugar de` [Op.gt] `en las cláusulas where:
// Foo.findAll({
//   where: {
//     $gt: 6 // Funciona como usar [Op.gt]
//   }
// });
// Consultas UPDATE simples
// Las consultas de actualización también aceptan la opción where , al igual que las consultas de lectura que se muestran arriba.

// // Cambie a todos los que no tengan apellido a "Doe"
// await User.update({ lastName: "Doe" }, {
//   where: {
//     lastName: null
//   }
// });
// Consultas DELETE simples
// Las consultas de eliminación también aceptan la opción where , al igual que las consultas de lectura que se muestran arriba.

// // Elimina a todos los que se llaman "Jane"
// await User.destroy({
//   where: {
//     firstName: "Jane"
//   }
// });
// Para destruir todo lo que se puede utilizar TRUNCATE SQL:

// // Truncar la tabla
// await User.destroy({
//   truncate: true
// });
// Creación en masa
// Sequelize proporciona el método Model.bulkCreate para permitir la creación de varios registros a la vez, con una sola consulta.

// El uso de Model.bulkCreate es muy similar a Model.create , al recibir una matriz de objetos en lugar de un solo objeto.

// const captains = await Captain.bulkCreate([
//   { name: 'Jack Sparrow' },
//   { name: 'Davy Jones' }
// ]);
// console.log(captains.length); // 2
// console.log(captains[0] instanceof Captain); // true
// console.log(captains[0].name); // 'Jack Sparrow'
// console.log(captains[0].id); // 1 // (u otro valor generado automáticamente)
// Sin embargo, de forma predeterminada, bulkCreate no ejecuta validaciones en cada objeto que se va a crear (lo que create sí). Para hacer que bulkCreate también ejecute estas validaciones, debe pasar la opción validate: true . Esto reducirá el rendimiento. Ejemplo de uso:

// const Foo = sequelize.define('foo', {
//   bar: {
//     type: DataTypes.TEXT,
//     validate: {
//       len: [4, 6]
//     }
//   }
// });

// // Esto no arrojará un error, se crearán ambas instancias
// await Foo.bulkCreate([
//   { name: 'abc123' },
//   { name: 'name too long' }
// ]);

// // Esto arrojará un error, no se creará nada
// await Foo.bulkCreate([
//   { name: 'abc123' },
//   { name: 'name too long' }
// ], { validate: true });
// Si acepta valores directamente del usuario, puede ser beneficioso limitar las columnas que realmente desea insertar. Para admitir esto, bulkCreate() acepta una opción de fields , una matriz que define qué campos deben considerarse (el resto se ignorará).

// await User.bulkCreate([
//   { username: 'foo' },
//   { username: 'bar', admin: true }
// ], { fields: ['username'] });
// // Ni foo ni bar son administradores.
// Ordenación y agrupación
// Sequelize proporciona las opciones de order y group para trabajar con ORDER BY y GROUP BY .

// Ordering
// La opción de order toma una serie de elementos para ordenar la consulta o un método de secuenciación. Estos elementos son en sí mismos matrices en la forma [column, direction] . La columna se escapará correctamente y la dirección se comprobará en una lista blanca de direcciones válidas (como ASC , DESC , NULLS FIRST , etc.).

// Subtask.findAll({
//   order: [
//     // Se escapará del título y validará DESC contra una lista de parámetros de dirección válidos
//     ['title', 'DESC'],

//     // Ordenará por max (edad)
//     sequelize.fn('max', sequelize.col('age')),

//     // Ordenará por max (edad) DESC
//     [sequelize.fn('max', sequelize.col('age')), 'DESC'],

//     // Ordenará por otra función (`col1`, 12, 'lalala') DESC
//     [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],

//     // Ordenará el createdAt de un modelo asociado utilizando el nombre del modelo como nombre de la asociación.
//     [Task, 'createdAt', 'DESC'],

//     // Ordenará a través del createdAt de un modelo asociado usando los nombres del modelo como nombres de las asociaciones.
//     [Task, Project, 'createdAt', 'DESC'],

//     // Ordenará por un modelo asociado createdAt usando el nombre de la asociación.
//     ['Task', 'createdAt', 'DESC'],

//     // Ordenará por un modelo asociado anidado createdAt usando los nombres de las asociaciones.
//     ['Task', 'Project', 'createdAt', 'DESC'],

//     // Ordenará por el createdAt de un modelo asociado usando un objeto de asociación. (metodo preferido)
//     [Subtask.associations.Task, 'createdAt', 'DESC'],

//     // Ordenará por el createdAt de un modelo asociado anidado usando objetos de asociación. (metodo preferido)
//     [Subtask.associations.Task, Task.associations.Project, 'createdAt', 'DESC'],

//     // Ordenará por el createdAt de un modelo asociado usando un objeto de asociación simple.
//     [{model: Task, as: 'Task'}, 'createdAt', 'DESC'],

//     // Ordenará por objetos de asociación simple createdAt de un modelo asociado anidado.
//     [{model: Task, as: 'Task'}, {model: Project, as: 'Project'}, 'createdAt', 'DESC']
//   ],

//   // Ordenará por edad máxima descendente
//   order: sequelize.literal('max(age) DESC'),

//   // Ordenará por edad máxima ascendente asumiendo que ascendente es el orden predeterminado cuando se omite la dirección
//   order: sequelize.fn('max', sequelize.col('age')),

//   // Ordenará por edad ascendente asumiendo que ascendente es el orden predeterminado cuando se omite la dirección
//   order: sequelize.col('age'),

//   // Ordenará aleatoriamente según el dialecto (en lugar de fn ('RAND') o fn ('RANDOM'))
//   order: sequelize.random()
// });

// Foo.findOne({
//   order: [
//     // devolverá `nombre`
//     ['name'],
//     // devolverá `username` DESC
//     ['username', 'DESC'],
//     // devolverá max (`edad`)
//     sequelize.fn('max', sequelize.col('age')),
//     // devolverá max (`edad`) DESC
//     [sequelize.fn('max', sequelize.col('age')), 'DESC'],
//     // devolverá otra función (`col1`, 12, 'lalala') DESC
//     [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],
//     // devolverá otherfunction (awesomefunction (`col`)) DESC, ¡Este anidamiento es potencialmente infinito!
//     [sequelize.fn('otherfunction', sequelize.fn('awesomefunction', sequelize.col('col'))), 'DESC']
//   ]
// });
// Para recapitular,los elementos de la matriz de pedidos pueden ser los siguientes:

// Una cadena (que se entrecomillará automáticamente)
// Un array,cuyo primer elemento se citará,el segundo se añadirá textualmente
// Un objeto con un campo raw formato:
// El contenido de raw se agregará literalmente sin citar
// Todo lo demás es ignorado,y si no se establece el raw,la consulta fallará
// Una llamada a Sequelize.fn (que generará una llamada de función en SQL)
// Una llamada a Sequelize.col (que citará el nombre de la columna)
// Grouping
// La sintaxis para agrupar y ordenar son iguales, excepto que la agrupación no acepta una dirección como último argumento del arreglo (no hay ASC , DESC , NULLS FIRST , etc.)

// También puede pasar una cadena directamente al group , que se incluirá directamente (literalmente) en el SQL generado. Úselo con precaución y no lo use con contenido generado por el usuario.

// Project.findAll({ group: 'name' });
// // da como resultado 'GROUP BY name'
// Límites y paginación
// Las opciones de limit y offset permiten trabajar con limitación / paginación:

// // Obtener 10 instancias / filas
// Project.findAll({ limit: 10 });

// // Omitir 8 instancias / filas
// Project.findAll({ offset: 8 });

// // Omite 5 instancias y recupera las 5 siguientes
// Project.findAll({ offset: 5, limit: 5 });
// Por lo general, estos se utilizan junto con la opción de order .

// Utility methods
// Sequelize también proporciona algunos métodos de utilidad.

// count
// El método de count simplemente cuenta las apariciones de elementos en la base de datos.

// console.log(`There are ${await Project.count()} projects`);

// const amount = await Project.count({
//   where: {
//     id: {
//       [Op.gt]: 25
//     }
//   }
// });
// console.log(`There are ${amount} projects with an id greater than 25`);
// max , min y sum a
// Sequelize también proporciona los métodos de conveniencia de max , min y sum a .

// Supongamos que tenemos tres usuarios,cuyas edades son 10,5 y 40 años.

// await User.max('age'); // 40
// await User.max('age', { where: { age: { [Op.lt]: 20 } } }); // 10
// await User.min('age'); // 5
// await User.min('age', { where: { age: { [Op.gt]: 5 } } }); // 10
// await User.sum('age'); // 55
// await User.sum('age', { where: { age: { [Op.gt]: 5 } } }); // 50
// Copyright © 2014 – presente Colaboradores de Sequelize
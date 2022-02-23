//TEXTO

// DataTypes.STRING             //255 caracteres
// DataTypes.STRING(1234)       //1234 caracteres
// DataTypes.TEXT               //TEXTO ILIMITADO

// //NUMEROS

// DataTypes.INTEGER            //numeros enteros
// DataTypes.FLOAT              //numeros flotantes

//FECHAS
// DataTypes.DATE             //FECHA Y HORA
// DataTypes.DATEONLY         //fecha

//OTRO

// DataTypes.ENUM('foo', 'bar')  //valores que son aceptables



//Comandos para ver

//select *from "UserTablaName"       //puedo ver los datos de mi tabla
// \d "Players"                        // se usa para ver los tipos de datos de mi tabla
// insert into "Users"                {firstname,lastname} values('Axel' 'Beltran')


//POSTGREST COMANDOS

//\l             /////para ver la lista de base de datos
//create database NombreDB   /////////Crear base de datos
//\c repaso /// entrar a la base de datos

// \c Saltar entre bases de datos

// \l Listar base de datos disponibles

// \dt Listar las tablas de la base de datos

// \d <nombre_tabla> Describir una tabla

// \dn Listar los esquemas de la base de datos actual

// \df Listar las funciones disponibles de la base de datos actual

// \dv Listar las vistas de la base de datos actual

// \du Listar los usuarios y sus roles de la base de datos actual

// Comandos de inspección y ejecución

// \g Volver a ejecutar el comando ejecutando justo antes

// \s Ver el historial de comandos ejecutados

// \s <nombre_archivo> Si se quiere guardar la lista de comandos ejecutados en un archivo de texto plano

// \i <nombre_archivo> Ejecutar los comandos desde un archivo

// \e Permite abrir un editor de texto plano, escribir comandos y ejecutar en lote. \e abre el editor de texto, escribir allí todos los comandos, luego guardar los cambios y cerrar, al cerrar se ejecutarán todos los comandos guardados.

// \ef Equivalente al comando anterior pero permite editar también funciones en PostgreSQL

// Comandos para debug y optimización

// \timing Activar / Desactivar el contador de tiempo por consulta
// Comandos para cerrar la consola

// \q Cerrar la consola
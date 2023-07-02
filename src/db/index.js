import { createConnection } from 'mysql2';
var connection = createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'libro_reclamaciones_db'
});
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log(err)
        console.log("Error while connecting with database");
    }
});
export default connection;
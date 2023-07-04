import express, { query } from "express";
import connection from "./db/index.js";

const app = express();
//Middleware
app.use(express.json());

app.get("/reclamo", async (req, res) => {
  let id = req.query["id"] ?? " ";
  const nro_dni = req.query["nro_dni"] ?? " ";
  const lista = [];
  const q =
    id || nro_dni
      ? searchQuery(nro_dni, id)
      : " SELECT * FROM libro_reclamaciones_db.reclamo";

  connection.query(q, (err, rows, fields) => {
    if (err) throw err;
    rows.forEach((r) => {
      lista.push(r);
    });
    return res.status(200).json({ reclamos: lista });
    //console.log("The solution is: ", rows[0]);
  });
  //return res.status(200).json({ "reclamos":lista[0] });
});

app.post("/reclamo", async (req, res) => {
  const body = req.body;
  
  const {
    nombres,
    apellidos,
    nro_dni,
    motivo_reclamo,
    pedido_reclamo,
    fecha_compra,
  } = body;
  let flag = false
  try {
    connection.query(
      insertQuery(nombres,apellidos,nro_dni,motivo_reclamo,pedido_reclamo,fecha_compra)
      ,
      (err, rows, fields) => {
        if (err) throw err;
        if (rows.affectedRows) {
          return res.status(201).json({"message":"created"});
        }
        return res.status(400).json({"message":"ERROR"});
      }
    );

      
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "ERROR": error });
  }
});






app.listen(8080, () => console.log(`Server init at http://localhost:${8080}`));

const searchQuery = (dni, id) => {
  return `SELECT * FROM 
  libro_reclamaciones_db.reclamo r WHERE r.id ='${id}' or r.nro_dni ='${dni}'`;
};
const insertQuery = (nombres,apellidos,nro_dni,motivo_reclamo,pedido_reclamo,fecha_compra)=>{
  return(
  `INSERT INTO libro_reclamaciones_db.reclamo(
    reclamo.nombres,
    reclamo.apellidos,
    reclamo.nro_dni,
    reclamo.motivo_reclamo,
    reclamo.pedido_reclamo,
    reclamo.fecha_compra)
    VALUES
    ('${nombres}',
    '${apellidos}',
    '${nro_dni}',
    '${motivo_reclamo}',
    '${pedido_reclamo}',
    '${fecha_compra}');`
  )
}

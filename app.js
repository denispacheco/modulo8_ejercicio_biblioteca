//cargar librerias
const express=require('express');
const {conexion}=require("./bd");
const fs=require("fs");

//incializacion
const app=new express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views",__dirname+"/views");

//rutas
//raiz
app.get('/', (req, res) => {
  res.render('index');
})
//galeria
app.get('/galeria', async (req, res) => {
  let consulta= 'select l."Id", l."Nombre" AS "Libro",a."Nombre" as "Autor",l."Edicion" from "Libros" l'
  consulta += ' JOIN "Autores" a ON l."IdAutor"=a."Id" '
  let resultado;
  try{
    resultado = await conexion.query(consulta);
  }catch(err){
    console.log("Error em consulta:" + err.message);
    res.status(500);
    res.json({mensaje:"Error al buscar datos"})
  }  
  //revisar si existe una foto asociada a cada libro, si no lo hay asociados la foto noimg
  let libros=resultado.rows;
  //obtener la lista de archivos en la carpeta de fotos
  const listaArchivos=fs.readdirSync("public/img");  
  //revisar si cada libro tiene una foto en la carpeta de imagenes
  //con el mismo id, si no, se carga la foto por defecto
   libros.forEach(async l => {    
      let archivo=listaArchivos.filter(a=>
        a.split(".")[0]==l.Id //divido el nombre del archivo en dos, 
        //y comparo la parte izquierda (sin extension) con el id del libro
      )
      if(archivo.length==0){ //si no se encontró foto para el libro
        l.ruta="img/noimg.jpg"; //cargo la imagen por defectp
      }else{
        l.ruta="img/"+archivo[0]; //cargo la imagen que corresponde al id
      }
   });
   //envió la web al cliente
  res.render('galeria',{libros:libros});
})
//contacto
app.get('/contacto', (req, res) => {
  res.render('contacto');
})


module.exports={app}
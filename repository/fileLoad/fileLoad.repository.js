
var multer = require("multer");
var mime = require("mime");
var { QueryTypes } = require('sequelize');

function FileLoadRepository(dbContext) {

  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./uploads");
    },
    filename: function(req, file, callback) {
      renamefile = "";
       renamefile = file.fieldname + "-" + Date.now()+ '.' + mime.getExtension(file.mimetype);
      callback(null, file.fieldname + "-" + Date.now()+ '.' + mime.getExtension(file.mimetype));
    }
  });

  var upload = multer({ storage: storage }).array("fileUpload", 12);

  function load(req, res) {
    upload(req, res, function(err) {
      if (err)
        return res
          .status(500)
          .send({ mesage: "Error uploading file.", info: err });

         var parameters = {'OriginalName': req.body.name 
         ,'NameStorage': renamefile
         ,'URL': "" 
         ,'Type': req.body.type
         ,'IdTask': req.body.idTask}

         var query = "INSERT INTO Manage.TicketDocument ([IdTask], [URL] ,[Type],[RecordDate] ,[RecordStatu],[OriginalName] ,[NameStorage])  VALUES (:IdTask, :URL , :Type, CURRENT_TIMESTAMP, 1, :OriginalName, :NameStorage);";
          
           dbContext.getQuery(query, parameters, QueryTypes.INSERT, function (error, data, rowCount) {
             if (rowCount > 0) {
                      return res.status(200).send({ info: true})
               } else {
                 return res.sendStatus(505).send({message: 'Error al registrar el archivo cargado. ' , info: error});;
               }
             });
      // return res
      //   .status(200)
      //   .send({ info: true, renameFile : renamefile })
      //   .end("File is uploaded");
    });
  }

  function getFile(req, res) {
    if (req.params.ticketId) {
       var param = {'Id': req.params.ticketId};

       var query = "select [Type] type,OriginalName name, IdTaskDocument id  from Manage.TicketDocument "+
                   "  where IdTask = :Id";
          dbContext.getQuery(query, param, QueryTypes.SELECT, function (error, data) {
            if (data) {
              return res.status(200).send(data);
            }
             else {
                  return res.status(505).send({message: 'Error al obtener Informacion', info: error });
             }   
          });
    }
  }

  return {
    post: load,
    get: getFile
  };
}
module.exports = FileLoadRepository;

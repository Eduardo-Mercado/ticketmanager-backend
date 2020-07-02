var { QueryTypes } = require('sequelize');  

function BusinessAgentRepository(dbContext) {
    
  function findBusinessAgent(req, res, next) {

    if (req.params.agentId) {
        var parameters = {'Id': req.params.agentId };

        var query = "select * from catalog.BusinessAgent where IdBusinessAgent = :Id"

        dbContext.getQuery(query, parameters, QueryTypes.SELECT, function (err, data) {
            if (data) {
              res.status(200).send(data[0]);
            }
            else {
              return res.status(500).send({message:'Error al consultar', info: error});
            }
        });
    }
}

  function getBusinessAgents(req, res) {
  
    dbContext.get("Catalog.getAgents", function(error, data) {
        if(error) return res.status(500).send({message: `Error al consultar el listado de agentes`, info: error});
        
        return	res.status(200).send(data[0]);
    });
  }

  function getBusinessAgent(req, res) {
    if (req.params.agentId) {
      var parameters = {'Id': req.params.agentId};
      var query = "select IdBusinessAgent idBusinessAgent, Name name, Position position, Email email,  Skype skype, Phone phone, Photo photo from Catalog.BusinessAgent  where IdBusinessAgent = :Id";
      dbContext.getQuery(query, parameters, QueryTypes.SELECT, function(error, data) {
        if (data) {
          return	res.status(200).send(data[0]);
        } else {
          return res.status(500).send({message:'Error al consultar', info: error});
        }
      });
    }
  }

  function putBusinessAgent(req, res) {
    var parameters = {
                      'Id': req.body.idBusinessAgent
                      ,'Name': req.body.name 
                      ,'Position': req.body.position
                      ,'Email': req.body.email
                      ,'Skype': req.body.skype
                      ,'Phone': req.body.phone
                      ,'Photo': req.body.photo };

    var query = "Update c set c.Name = :Name, c.Position = :Position, c.Email = :Email ,c.Skype = :Skype ,c.Phone = :Phone,c.Photo = :Photo , c.RecordDate =  CURRENT_TIMESTAMP from Catalog.BusinessAgent c  where IdBusinessAgent = :Id";
     
    dbContext.getQuery(query, parameters, QueryTypes.UPDATE, function (error, data, rowCount) {
      if (rowCount > 0) {
          var info ={
            idBusinessAgent: req.body.idBusinessAgent,
            name: req.body.name,
            position: req.body.position,
            email: req.body.email,
            skype: req.body.skype,
            phone: req.body.phone
          };
         return res.status(200).send(info);
      }
      else {
        return res.status(500).send({message:'Error al actualizar', info: error});
      }

    });
}

  function postBusinessAgent(req, res) {
    var parameters = {'Name': req.body.name 
                      ,'Position': req.body.position
                      ,'Email': req.body.email
                      ,'Skype': req.body.skype
                      ,'Phone': req.body.phone
                      ,'Photo': req.body.photo };

    var query = "INSERT INTO Catalog.BusinessAgent ([Name] ,[Position],[Email] ,[Skype] ,[Phone],[Photo] ,[RecordStatu], [RecordDate]) OUTPUT INSERTED.* VALUES (:Name, :Position, :Email, :Skype, :Phone,:Photo, 1, CURRENT_TIMESTAMP);";
     
      dbContext.getQuery(query, parameters, QueryTypes.INSERT, function (error, data, rowCount) {
        if (rowCount > 0) {
            var info ={
              idBusinessAgent: data[0].IdBusinessAgent,
              name: data[0].Name,
              position: data[0].Position,
              email: data[0].Email,
              skype: data[0].Skype,
              phone: data[0].Phone
            };
           return res.status(200).send(info);
        } else {
          return res.status(500).send({message:'Error al insertar', info: error});
        }
    });

  }

  function deleteBusinessAgent(req, res) {

    var parameters = [];

    if (req.params.agentId ) {
        var parameters = {'Id': req.params.agentId };

        var query = "delete from catalog.BusinessAgent where IdBusinessAgent = :Id"

        dbContext.getQuery(query, parameters, QueryTypes.DELETE, function (error, data, rowCount) {
            if (rowCount > 0) {
                return res.status(200).send({info:true});
            } else {
              return res.status(500).send({message:'Error al eliminar', info: error});
            }
        });
    }
}

  return {
    getAll: getBusinessAgents,
    get: getBusinessAgent,
    post: postBusinessAgent,
    put:putBusinessAgent,
    intercept: findBusinessAgent,
    delete: deleteBusinessAgent
  };
}
module.exports = BusinessAgentRepository;

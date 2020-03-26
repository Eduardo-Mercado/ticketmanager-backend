var response = require("../../shared/response");
var TYPES = require("tedious").TYPES;
var Request = require('tedious').Request  

function BusinessAgentRepository(dbContext) {
    
  function findBusinessAgent(req, res, next) {

    if (req.params.agentId) {
        var parameters = [];

        parameters.push({ name: 'Id', type: TYPES.Int, val: req.params.agentId });

        var query = "select * from catalog.BusinessAgent where IdBusinessAgent = @Id"

        dbContext.getQuery(query, parameters, false, function (error, data) {
            if (data) {
                req.data = data[0];
                return next();
            }
            return res.sendStatus(404);
        });
    }
}

  function getBusinessAgents(req, res) {
  
    dbContext.get("Catalog.getAgents", function(error, data) {
    //  return res.json(response(data, error));
        if(error) return res.status(500).send({message: `Error al consultar el listado de agentes`, info: error});
        
        return	res.status(200).send(data[0]);
    });
  }

  function getBusinessAgent(req, res) {
    if (req.params.agentId) {
      var parameters = [];
      parameters.push({
        name: "Id",
        type: TYPES.Int,
        val: req.params.agentId
      });
      var query = "select IdBusinessAgent idBusinessAgent, Name name, Position position, Email email,  Skype skype, Phone phone from Catalog.BusinessAgent  where IdBusinessAgent = @Id";
      dbContext.getQuery(query, parameters, false, function(error, data) {
        if (data) {
          return	res.status(200).send(data[0]);
        }
        return res.sendStatus(404);
      });
    }
  }

  function putBusinessAgent(req, res) {
    var parameters = [];
    parameters.push({ name: "Id", type: TYPES.Int, val: req.body.idBusinessAgent });
    parameters.push({ name: "Name", type: TYPES.Text, val: req.body.name });
    parameters.push({ name: "Position", type: TYPES.Text, val: req.body.position });
    parameters.push({ name: "Email", type: TYPES.Text, val: req.body.email });
    parameters.push({ name: "Skype", type: TYPES.Text, val: req.body.skype });
    parameters.push({ name: "Phone", type: TYPES.Text, val: req.body.phone });

    var query = "Update c set c.Name = @Name, c.Position = @Position, c.Email = @Email ,c.Skype = @Skype ,c.Phone = @Phone , c.RecordDate =  CURRENT_TIMESTAMP from Catalog.BusinessAgent c  where IdBusinessAgent = @Id";
     
    dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
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
      return res.sendStatus(404);

    });
}

  function postBusinessAgent(req, res) {
    var parameters = [];
    parameters.push({ name: "Name", type: TYPES.Text, val: req.body.name });
    parameters.push({ name: "Position", type: TYPES.Text, val: req.body.position });
    parameters.push({ name: "Email", type: TYPES.Text, val: req.body.email });
    parameters.push({ name: "Skype", type: TYPES.Text, val: req.body.skype });
    parameters.push({ name: "Phone", type: TYPES.Text, val: req.body.phone });

    var query = "INSERT INTO Catalog.BusinessAgent ([Name] ,[Position],[Email] ,[Skype] ,[Phone] ,[RecordStatu], [RecordDate]) OUTPUT INSERTED.* VALUES (@Name, @Position, @Email, @Skype, @Phone, 1, CURRENT_TIMESTAMP);";
     
      dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
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
        }
        return res.sendStatus(404);
    });

  }

  function deleteBusinessAgent(req, res) {

    var parameters = [];

    if (req.params.agentId ) {
        var parameters = [];

        parameters.push({ name: 'Id', type: TYPES.Int, val: req.params.agentId });

        var query = "delete from catalog.BusinessAgent where IdBusinessAgent = @Id"

        dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
            if (rowCount > 0) {
                return res.status(200).send({info:true});
            }
            return res.sendStatus(404);
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

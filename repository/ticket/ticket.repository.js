var { QueryTypes } = require('sequelize');

function TicketRepository(dbContext) {
    
  function getTickets(req, res) {
  
    dbContext.get("Catalog.getTickets", function(error, data) {
        if(error) return res.status(500).send({message: `Error al consultar el listado de compañias`, info: error});
        else  return	res.status(200).send(data);
    });
  
  }
  function getTicketsByAgent(req, res) {
    if (req.params.agentId) {
      var parameters = {'Id': req.params.agentId }

      var query = "Manage.getTicketsByAgent :Id";
      dbContext.getQuery(query,parameters, QueryTypes.SELECT, function(err,data) {
        if(err) {
           return res.status(500).send({message: 'Error al consultar', info: err});
        }
        else {
          return	res.status(200).send(data);
        }
      });
    }
  }

  function getTicket(req, res) {
    if (req.params.ticketId) {
      var parameters = {'Id': req.params.ticketId };

      var query = "Select t.Subject as subject ,t.Body body, t.IdBusinessAgent idBusinessAgent, t.IdCustomer idCustomer , t.IdPriorityStatus idPriority , c.IdCompany idCompany   From manage.ticket t"+
                  " inner join Catalog.Customer c on c.IdCustomer = t.IdCustomer where t.IdTicket = :Id";
      dbContext.getQuery(query, parameters, QueryTypes.SELECT, function(error, data) {
        if (data) {
          return	res.status(200).send(data);
        } else {
          return res.sendStatus(404);
        } 
         
      });
    }
  }

  function putTicket(req, res) {
    var parameters = [];
    parameters.push({ name: "Id", type: TYPES.Int, val: req.body.idTicket });
    parameters.push({ name: "IdCustomer", type: TYPES.Int, val: req.body.idCustomer});
    parameters.push({ name: "IdBusinessAgent", type: TYPES.Int, val: req.body.idBusinessAgent });
    parameters.push({ name: "IdPriorityStatus", type: TYPES.Int, val: req.body.idPriority }); 
    parameters.push({ name: "Subject", type: TYPES.Text, val: req.body.subject });
    parameters.push({ name: "Body", type: TYPES.Text, val: req.body.body });

    var query = "UPDATE T SET IdCustomer = @IdCustomer, Subject = @Subject, Body = @Body, IdBusinessAgent = @IdBusinessAgent, IdPriorityStatus = @IdPriorityStatus  FROM [Manage].[Ticket] t  WHERE IdTicket = @Id";
     
    dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
      if (rowCount > 0) {
        var valor = [];
        valor.push({ name: "Id", type: TYPES.Int, val: req.body.idTicket });
        var query1 = "Catalog.getTickets";
        dbContext.ExecSP(query1,valor, function(err,record) {
          return	res.status(200).send(record);
        });
      }else {
        return res.sendStatus(404);
      }

    });
}

  function postTicket(req, res) {
    var parameters = { 'IdCustomer': req.body.idCustomer
    ,'IdBusinessAgent': req.body.idBusinessAgent
    ,'IdPriorityStatus': req.body.idPriority 
    ,'Subject': req.body.subject
    ,'Body': req.body.body };

    var query = "INSERT INTO [Manage].[Ticket]([IdCustomer],[Subject],[Body],[IdStatus],[RecordDate],[RecordStatu],[IdBusinessAgent],[IdTicketBranch],[CreationDate],[IdPriorityStatus]) "
                 +" OUTPUT INSERTED.* VALUES  (:IdCustomer ,:Subject ,:Body,4 ,CURRENT_TIMESTAMP ,1 ,:IdBusinessAgent ,0 ,CURRENT_TIMESTAMP,:IdPriorityStatus)";
      dbContext.getQuery(query, parameters, QueryTypes.INSERT, function (error, data, rowCount) {
        if (rowCount > 0) {
          var valor = { 'Id':data[0].IdTicket};
            var query1 = "Catalog.getTickets";
            dbContext.getQuery(query1,valor,QueryTypes.SELECT, function(err,data) {
              return	res.status(200).send(data);
            });
       }
       else{
         return res.sendStatus(500).send({message: 'Error durante la inserccion ' , info: error});
       } 
        
   });

  }

  function deleteTicket(req, res) {

    var parameters = [];

    if (req.params.ticketId ) {
        var parameters = [];

        parameters.push({ name: 'Id', type: TYPES.Int, val: req.params.ticketId });

        var query = "delete from manage.ticket where IdTicket = @Id"

        dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
            if (rowCount > 0) {
                return res.status(200).send({info:true});
            } else  return res.sendStatus(404);
           
        });
    }
}

  return {
    getAll: getTickets,
    get: getTicket,
    post: postTicket,
    put:putTicket,
    delete: deleteTicket,
    getTicketAgent: getTicketsByAgent
  };
}
module.exports = TicketRepository;

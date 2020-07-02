var { QueryTypes } = require('sequelize');

function CustomerRepository(dbContext) {
    
  function findCustomer(req, res, next) {

    if (req.params.customerId) {
        var parameters = {'Id': req.params.agentId };

        var query = "select * from catalog.Customer where IdCustomer = :Id"

        dbContext.getQuery(query, parameters, QueryTypes.SELECT, function (error, data) {
            if (data) {
                req.data = data[0];
                return next();
            }
            return res.sendStatus(404);
        });
    }
}

  function getCustomers(req, res) {
  
    dbContext.get("Catalog.getCustomers", function(error, data) {
    
        if(error) return res.status(500).send({message: `Error al consultar el listado de clientes`, info: error});
        
        return	res.status(200).send(data[0]);
    });
  }

  function getCustomer(req, res) {
    if (req.params.customerId) {
      var parameters = { 'Id': req.params.customerId};
      var query = "select IdCustomer idCustomer, IdCompany idCompany, Name name, Position position, Email email,  Skype skype, Phone phone, Photo photo from Catalog.Customer  where IdCustomer = :Id";
      dbContext.getQuery(query, parameters, QueryTypes.SELECT, function(error, data) {
        if (data) {
          return	res.status(200).send(data[0]);
        } else
          return res.sendStatus(505).send({message:'Error al obtener informacion ', error });
      });
    }
  }

  function putCustomer(req, res) {
    var parameters = {'Id': req.body.idCustomer
    ,'Name': req.body.name
    ,'Position': req.body.position
    ,'Email': req.body.email
    ,'Skype': req.body.skype
    ,'Phone': req.body.phone
    ,'Photo': req.body.photo 
    ,'IdCompany': req.body.idCompany };

    var query = "Update c set c.Name = :Name, c.Position = :Position, c.Email = :Email , c.Skype = :Skype , c.Phone = :Phone , c.IdCompany = :IdCompany , Photo = :Photo, c.RecordDate =  CURRENT_TIMESTAMP from Catalog.Customer c  where IdCustomer = :Id";
    
    dbContext.getQuery(query, parameters, QueryTypes.UPDATE, function (error, data, rowCount) {
      if (rowCount > 0) {
        var valor = { 'Id':req.body.idCompany};

        var query1 = "select Name name from Catalog.Company  where IdCompany = :Id";
        dbContext.getQuery(query1, valor, QueryTypes.SELECT, function(err, comp) {
          var info ={
            idCustomer: req.body.idCustomer,
            name: req.body.name,
            position: req.body.position,
            email: req.body.email,
            skype: req.body.skype,
            phone: req.body.phone,
            companyName: comp[0].name,
            photo: req.body.photo
          };
         return res.status(200).send(info);
        });
      } else
        return res.sendStatus(505).send({message: 'Error al actualizar registro', info: error});

    });
}

  function postCustomer(req, res) {
    var parameters = { 'Name': req.body.name
                      ,'Position': req.body.position
                      ,'Email': req.body.email
                      ,'Skype': req.body.skype
                      ,'Phone': req.body.phone
                      ,'Photo': req.body.photo
                      ,'IdCompany': req.body.idCompany };
    var query = "INSERT INTO Catalog.Customer ([Name] ,[Position],[Email] ,[Skype] ,[Phone] ,[RecordStatu],[IdCompany] ,[RecordDate], [Photo]) OUTPUT INSERTED.* VALUES (:Name, :Position,:Email, :Skype, :Phone, 1, :IdCompany, CURRENT_TIMESTAMP, :Photo);";
     
      dbContext.getQuery(query, parameters, QueryTypes.INSERT, function (error, data, rowCount) {
        if (rowCount > 0) {
            var valor =  {'Id':data[0].IdCompany};
            var query1 = "select Name name from Catalog.Company  where IdCompany = :Id";
            dbContext.getQuery(query1, valor, QueryTypes.SELECT, function(err, comp) {
                var info = {
                    idCustomer: data[0].IdCustomer,
                    name: data[0].Name,
                    position: data[0].Position,
                    email: data[0].Email,
                    skype: data[0].Skype,
                    phone: data[0].Phone,
                    photo: data[0].photo,
                    companyName: comp[0].name
                  };
                 return res.status(200).send(info);
            
            });
          } else
                 return res.sendStatus(505).send({message: 'Error durante la inserccion ' , info: error});;
        });

  }

  function deleteCustomer(req, res) {

    if (req.params.agentId ) {
        var parameters =  { name: 'Id', type: TYPES.Int, val: req.params.agentId };

        var query = "delete from catalog.Customer where IdCustomer = :Id"

        dbContext.getQuery(query, parameters, QueryTypes.DELETE, function (error, data, rowCount) {
            if (rowCount > 0) {
                return res.status(200).send({info:true});
            }
            return res.sendStatus(505).send({message: 'Error durante el proceso de eliminar ' , info: error});
        });
    }
}

  return {
    getAll: getCustomers,
    get: getCustomer,
    post: postCustomer,
    put:putCustomer,
    intercept: findCustomer,
    delete: deleteCustomer
  };
}
module.exports = CustomerRepository;

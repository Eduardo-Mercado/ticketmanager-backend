var response = require("../../shared/response");
var TYPES = require("tedious").TYPES;
var Request = require('tedious').Request  

function CompanyRepository(dbContext) {
    
  function findCompany(req, res, next) {

    if (req.params.companyId) {
        var parameters = [];

        parameters.push({ name: 'Id', type: TYPES.Int, val: req.params.companyId });

        var query = "select * from catalog.company where IdCompany = @Id"

        dbContext.getQuery(query, parameters, false, function (error, data) {
            if (data) {
                req.data = data[0];
                return next();
            }
            return res.sendStatus(404);
        });
    }
}

  function getCompanies(req, res) {
  
    dbContext.get("Catalog.getCompanies", function(error, data) {
    //  return res.json(response(data, error));
        if(error) return res.status(500).send({message: `Error al consultar el listado de compañias`, info: err});
        
        return	res.status(200).send(data[0]);
    });
  }

  function getCompany(req, res) {
    if (req.params.companyId) {
      var parameters = [];
      parameters.push({
        name: "Id",
        type: TYPES.Int,
        val: req.params.companyId
      });
      var query = "select IdCompany idCompany, Name name, Logo logo from Catalog.Company  where IdCompany = @Id";
      dbContext.getQuery(query, parameters, false, function(error, data) {
        if (data) {
          return	res.status(200).send(data[0]);
        }
        return res.sendStatus(404);
      });
    }
  }

  function putCompany(req, res) {
    var parameters = [];
    parameters.push({ name: "Id", type: TYPES.Int, val: req.body.idCompany });
    parameters.push({ name: "Name", type: TYPES.Text, val: req.body.name });
    parameters.push({ name: "Logo", type: TYPES.Text, val: req.body.logo });

    var query = "Update c set c.Name = @Name,  c.Logo = @Logo, c.RecordDate =  CURRENT_TIMESTAMP from Catalog.Company c  where IdCompany = @Id";
     
    dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
      if (rowCount > 0) {
          var info ={
            idCompany: req.body.idCompany,
            name: req.body.name,
            logo: req.body.logo
          };
         return res.status(200).send(info);
      }
      return res.sendStatus(404);

    });
}

  function postCompany(req, res) {
    var parameters = [];
    parameters.push({ name: "Id", type: TYPES.Int, val: req.body.idCompany });
    parameters.push({ name: "Name", type: TYPES.Text, val: req.body.name });
    parameters.push({ name: "Logo", type: TYPES.Text, val: req.body.logo });

    var query = "INSERT INTO Catalog.Company (Name, Logo, RecordStatu, RecordDate) OUTPUT INSERTED.* VALUES (@Name, @Logo,1 , CURRENT_TIMESTAMP);";
     
      dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
        if (rowCount > 0) {
            var info ={
              idCompany: data[0].IdCompany,
              name: data[0].Name,
              logo: data[0].Logo
            };
           return res.status(200).send(info);
        }
        return res.sendStatus(404);
    });

  }

  function deleteCompany(req, res) {

    var parameters = [];

    if (req.params.companyId ) {
        var parameters = [];

        parameters.push({ name: 'Id', type: TYPES.Int, val: req.params.companyId });

        var query = "delete from catalog.company where IdCompany = @Id"

        dbContext.getQuery(query, parameters, false, function (error, data, rowCount) {
            if (rowCount > 0) {
                return res.status(200).send({info:true});
            }
            return res.sendStatus(404);
        });
    }
}

  return {
    getAll: getCompanies,
    get: getCompany,
    post: postCompany,
    put:putCompany,
    intercept: findCompany,
    delete: deleteCompany
  };
}
module.exports = CompanyRepository;

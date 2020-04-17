var { QueryTypes } = require('sequelize');

function DropdownRepository(dbContext) {
    
  function getDropdown(req, res) {
    
    if (req.params.table) {
        var query = "";
        switch(req.params.table) {
            case "company":
             query = "select IdCompany id, Name value from Catalog.Company  where RecordStatu = 1";
            break;
            case "businessAgent":
              query = "select IdBusinessAgent id, Name value from Catalog.BusinessAgent  where RecordStatu = 1";
              break;
            case "customer":
              query = "select IdCustomer id, Name value from Catalog.Customer  where RecordStatu = 1";
              break;
            case "priorityStatus":
                query = "select IdPriorityStatus id, Name value from Catalog.PriorityStatus  where RecordStatu = 1";
               break;
            case "rols":
                query = "select IdRole id, Name value from security.Role  where RecordStatu = 1";
               break;    
            case "typeTask":
            query = "select IdTypeTask id, Name value from Catalog.TypeTask  where RecordStatu = 1";
            break;    
        } 
      
        dbContext.get(query, function(error, data) {
          if(error) return res.status(500).send({message: 'Error al consultar el listado de : '+req.params.table, info: error});
          else {
            return	res.status(200).send(data[0]);
          } 
      });
    
    }
  }

  function getDropdownFiltered(req, res) {
 
    if(req.params.table) {
      
      var query = "";
      switch(req.params.table) {
         case "Customer":
           query = "select IdCustomer id, Name value from Catalog.Customer  where RecordStatu = 1 and IdCompany = :Id";
      }

      dbContext.getQuery(query, { 'Id': req.params.id }, QueryTypes.SELECT, function(err, data){
        if(err)
            return res.status(500).send({message:'Error al consultar el listado filtrado de :'+ req.params.table, info: err});
         else  return res.status(200).send( (data == false)? null : data);
      })
    }
  }
  return { 
    get: getDropdown,
    getFilter: getDropdownFiltered 
  };
}
module.exports = DropdownRepository;

var { QueryTypes } = require('sequelize');
var Request = require('tedious').Request  

function RolRepository(dbContext) {
    
  function getOptionByRol(req, res) {

    if (req.params.id ) {
        
        dbContext.getQuery("security.loadOptionByRol :Id", {'Id': req.params.id}, QueryTypes.SELECT, function (error, data, rowCount) {
            if (rowCount > 0) {
                return res.status(200).send(data);
            }
            else {
                return res.status(500).send({message:'Error DataBase', info: error});
            }
        });
    }
}

  return {
    getOptions: getOptionByRol 
  };
}
module.exports = RolRepository;

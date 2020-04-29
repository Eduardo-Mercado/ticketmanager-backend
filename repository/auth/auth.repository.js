var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt');
var { QueryTypes } = require('sequelize');

const secretKey = 'gtert12548'

function AuthRepository(dbContext) {

    async function signIn(req, res) {
        const userName = req.params.userName;  
        const password = req.params.passwd;  

        if (!userName || !password) {  
            return  res.sendStatus(400).send({
                        message: 'signin falled',
                        error: 'User name and password required'
                    });
        }  
        try {  
            
            var queryUser = 'select * from security.Account  where UserName = :User';
            dbContext.getQuery(queryUser, {'User': userName },QueryTypes.SELECT, async function(err, data) {
                if ( data ) { 
                    const compareRes = await bcrypt.compare(password, data[0].Passwd);
                    if (compareRes) {  
                        var userData = {
                            "name": data[0].UserName,
                            "id": data[0].IdUser,
                            "idRol": data[0].IdRol
                        }
            
                        let token = jwt.sign(userData, secretKey, {expiresIn: '2h'})
                        res.status(200).json({"token": token, "userData": userData});
                    } else {
                        return res.sendStatus(400).send({message: 'signin falled' , error: 'Password Incorrect'});
                    }
                }
            });
           
        } catch (ex) {
            return res.sendStatus(400).send({message: 'signin falled' , error: ex});
        }
    }

    async function  postUser(req, res) {
 
        const password = req.body.passwd;  

        try {
            const hashedPassword = await bcrypt.hash(password, 10) 
            var parameters = {
                'User':req.body.userName
                ,'IdRol': req.body.idRol
                ,'IdAgent': req.body.idAgent
                ,'Passwd': hashedPassword 
            };

            var query = "INSERT INTO [security].[Account] ([RecordDate] ,[IdRol] ,[User] ,[Passwd] ,[RecordStatus], [IdAgent]) "+
                        " OUTPUT INSERTED.* VALUES (CURRENT_TIMESTAMP ,:IdRol ,:User,:Passwd ,1,:IdAgent);";

            dbContext.getQuery(query, parameters, false, function(error, data, rowcount){
                if (rowcount > 0) {
                    var valor = { 'Id':data[0].IdUser};
                    var query1 = "security.getUsers";
                    dbContext.getQuery(query1,valor, function(err,data) {
                      return res.status(200).send(data[0]);
                    });
                } else {
                    return res.sendStatus(500).send({message: 'Error durante la inserccion ' , info: error});
                }
            })
        } catch (ex) {
           return res.sendStatus(400).send({message: 'Error durante la inserccion ' , error: ex});
        }
    }

    function GetUsers(req, res) {
  
        dbContext.get("security.getUsers", function(error, data) {
      
            if(error) return res.status(500).send({message: `Error al consultar el listado de compañias`, info: err});
            
            return	res.status(200).send(data[0]);
        });
      }

    return {
        getToken: signIn,
        get: GetUsers,
        post: postUser
    };
}

module.exports = AuthRepository;

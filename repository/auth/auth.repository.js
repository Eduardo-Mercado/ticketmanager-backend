var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt');
var TYPES = require("tedious").TYPES;

const secretKey = 'gtert12548'

function AuthRepository(dbContext) {

    async function signIn(req, res) {
        // var userData = {
        //     "name": "admin",
        //     "id": "1"
        // }

        // let token = jwt.sign(userData, secretKey, {expiresIn: '15s'})
        // res.status(200).json({"token": token});

        const userName = req.params.userName;  
        const password = req.params.passwd;  

        if (!userName || !password) {  
            return  res.sendStatus(400).send({
                        message: 'signin falled',
                        error: 'User name and password required'
                    });
            
        }  
        try {  
            var parameters = [];
            parameters.push({
              name: "User",
              type: TYPES.NVarChar,
              val: userName
            });

            var queryUser = "select * from [security].[User] where [User] = @User";
            dbContext.getQuery(queryUser, parameters, false, async function(err, data) {
                if ( data ) { 
                    const compareRes = await bcrypt.compare(password, data[0].Passwd);
                    if (compareRes) {  
                        var userData = {
                            "name": "admin",
                            "id": "1"
                        }
            
                        let token = jwt.sign(userData, secretKey, {expiresIn: '1500s'})
                        res.status(200).json({"token": token});
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
            var parameters = [];
            parameters.push({ name: "User", type: TYPES.Text, val: req.body.userName });
            parameters.push({ name: "IdRol", type: TYPES.Int, val: req.body.idRol });
            parameters.push({ name: "IdAgent", type: TYPES.Int, val: req.body.idAgent });
            parameters.push({ name: "Passwd", type: TYPES.Text, val: hashedPassword });

            var query = "INSERT INTO [security].[User] ([RecordDate] ,[IdRol] ,[User] ,[Passwd] ,[RecordStatus], [IdAgent]) "+
                        " OUTPUT INSERTED.* VALUES (CURRENT_TIMESTAMP ,@IdRol ,@User,@Passwd ,1,@IdAgent);";

            dbContext.getQuery(query, parameters, false, function(error, data, rowcount){
                if (rowcount > 0) {
                    var valor = [];
                    valor.push({ name: "Id", type: TYPES.Int, val:data[0].IdUser});
                    var query1 = "security.getUsers";
                    dbContext.ExecSP(query1,valor, function(err,data) {
                      return res.status(200).send(data[0]);
                    });
                } else {
                    return res.sendStatus(500).send({message: 'Error durante la inserccion ' , info: error});
                }
            })
           // return res.status(200).send({ message: 'User created' });  
        } catch (ex) {
           // logger.error(ex);  
           return res.sendStatus(400).send({message: 'Error durante la inserccion ' , error: ex});
             
        }
    }

    function GetUsers(req, res) {
  
        dbContext.get("security.getUsers", function(error, data) {
        //  return res.json(response(data, error));
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

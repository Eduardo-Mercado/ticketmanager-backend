var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt');

let secretKey = 'gtert12548'

function AuthRepository(dbContext) {

    function signIn(req, res, next) {
    
        var userData = {
            "name": "admin",
            "id": "1"
        }

        let token = jwt.sign(userData, secretKey, {expiresIn: '15s'})
        res.status(200).json({"token": token});
    }

    function signup(req, res, next) {
        const userName = req.body.userName;  
        const email = req.body.email;  
        const password = req.body.password;  

        try {
          //  const hashedPassword = await bcrypt.hash(password, 10) 
            return res.status(200).send({ message: 'User created' });  
        } catch (ex) {
            logger.error(ex);  
            res.status(400);  
            return res.status(505).send({ error: ex });  
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
        get: GetUsers
    };
}

module.exports = AuthRepository;

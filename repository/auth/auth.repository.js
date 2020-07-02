var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
var bcrypt = require("bcrypt");
var { QueryTypes } = require("sequelize");

const secretKey = "gtert12548";

function AuthRepository(dbContext) {
  async function signIn(req, res) {
    const userName = req.params.userName;
    const password = req.params.passwd;

    if (!userName || !password) {
      return res.sendStatus(400).send({
        message: "signin falled",
        error: "User name and password required",
      });
    }
    try {
      var queryUser = "select * from security.Account  where UserName = :User";
      dbContext.getQuery( queryUser, { User: userName }, QueryTypes.SELECT, async function (err, data) {
          if (data) {
            const compareRes = await bcrypt.compare(password, data[0].Passwd);
            if (compareRes) {
              var userData = {
                name: data[0].UserName,
                id: data[0].IdUser,
                idRol: data[0].IdRol,
              };

              let token = jwt.sign(userData, secretKey, { expiresIn: "2h" });
              res.status(200).json({ token: token, userData: userData });
            } else {
              return res
                .sendStatus(400)
                .send({
                  message: "signin falled",
                  error: "Password Incorrect",
                });
            }
          }
        }
      );
    } catch (ex) {
      return res.sendStatus(400).send({ message: "signin falled", error: ex });
    }
  }

  async function postUser(req, res) {
    const password = req.body.passwd;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      var parameters = {
        User: req.body.userName,
        IdRol: req.body.idRol,
        IdAgent: req.body.idAgent,
        Passwd: hashedPassword,
      };

      var query =
        "INSERT INTO [security].[Account] ([RecordDate] ,[IdRol] ,[UserName] ,[Passwd] ,[RecordStatus], [IdAgent]) " +
        " OUTPUT INSERTED.* VALUES (CURRENT_TIMESTAMP ,:IdRol ,:User,:Passwd ,1,:IdAgent);";

      dbContext.getQuery(query, parameters, QueryTypes.INSERT, function (error, data, rowcount ) {
        if (rowcount > 0) {
          var valor = { Id: data[0].IdUser };
          var query1 = "security.getUsers";
          dbContext.getQuery(query1, valor, QueryTypes.SELECT, function ( err, data ) {
            return res.status(200).send(data[data.length - 1]);
          });
        } else {
          return res.sendStatus(500).send({ message: "Error durante la inserccion ", info: error });
        }
      });
    } catch (ex) {
      return res.sendStatus(400).send({ message: "Error durante la inserccion ", error: ex });
    }
  }

  function GetUsers(req, res) {
    dbContext.get("security.getUsers", function (error, data) {
      if (error)
        return res.status(500).send({
            message: `Error al consultar el listado de compañias`,
            info: err,
          });

      return res.status(200).send(data[0]);
    });
  }

  function GetUserById(req, res) {
    if (req.params.userId) {
      var parameters = { Id: req.params.userId };
      var query =
        "SELECT [IdUser] id ,[IdRol] idRol ,[UserName] userName ,[Passwd] passwd ,[Passwd] confirmPasswd,[IdAgent] idAgent " +
        " FROM [security].[Account] WHERE IdUser = :Id";

      dbContext.getQuery(query, parameters, QueryTypes.SELECT, function (error, data ) {
        if (data) {
          return res.status(200).send(data[0]);
        } else {
          return res.status(500).send({ message: "Error al consultar", info: error });
        }
      });
    }
  }

  function putUser(req, res) {
    var parameters = {
      Id: req.body.id,
      UserName: req.body.userName,
      IdAgent: req.body.idAgent,
      Passwd: req.body.passwd,
      IdRol: req.body.idRol,
    };

    var query =  "UPDATE [security].[Account] SET UserName= :UserName ,IdAgent = :IdAgent, Passwd = :Passwd, IdRol = :IdRol " +
                 " WHERE IdUser = :Id";

    dbContext.getQuery(query, parameters, QueryTypes.UPDATE, function(error, data, rowCount){
            if (rowCount > 0) {
                
                var valor = { Id: req.body.id};
                var query1 = "security.getUsers :Id";
                dbContext.getQuery(query1, valor, QueryTypes.SELECT, function ( err, info ) {
                    return res.status(200).send(info[0]);
                });
            }
            else {
            return res.status(500).send({message:'Error al actualizar', info: error});
            }
        });

    }

  return {
    getToken: signIn,
    getAll: GetUsers,
    get: GetUserById,
    post: postUser,
    put: putUser,
  };
}

module.exports = AuthRepository;

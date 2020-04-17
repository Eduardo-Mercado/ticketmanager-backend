var { QueryTypes } = require('sequelize');

function TaskRepository(dbContext) {
    function getTaskByIdTicket(req, res) {
        dbContext.get("manager.getTaskByIdTicket", function(error, data) {
            if(error) return res.status(500).send({message:'Error al consultar', info: error});

            return res.status(200).send(data);
        })
    }

    function getTaskChildByIdParent(req, res) {
        dbContext.get("manager.getTaskChildByIdTask", function(error, data) {
            if(error) return res.status(500).send({message:'Error al consultar', info: error});

            return res.status(200).send(data)
        });
    }

    function getTaskById(req, res) {
     var params = {'Id': req.body.idTask};
     var query = "select IdTask, Description, started, finished,IdTypeTask from Manage.task where IdTask = :Id";
     dbContext.getQuery(query, params, QueryTypes.SELECT, function (error, data, rowCount) {
         if (rowCount > 0) {
             return res.status(200).send(data);
         }
         else {
             return res.status(500).send({message:'Error DataBase', info: error});
         }
     })   
    }

   async function postTask(req, res) {
      
        var tasks =  [];
        let counter = 0;
        var root =  { 
                        description : req.body.mainDescription,
                        idTicket: req.body.idTicket,
                        idTypeTask:0,
                        time: 0 , 
                        finished: new Date,
                        started: new Date
                    };

        req.body.subTasks.forEach(element => {
            
            tasks.push({
                            description : element.description,
                            idTicket: element.id,
                            idTypeTask: element.type,
                            time: element.time,
                            started: element.started,
                            finished: element.finished,
                            idParent: root.idTicket
            })
            counter+= element.time;
        });

       root.time = counter;
       root.started = tasks[0].started;
       root.finished= tasks[tasks.length - 1].finished;
     
        registar_actualizar(root, tasks, function(error) {
            if(error) {
                return res.status(500).send({message:"Error", info:error});
            } else {
                return res.status(200);
            }
       });
    }

    function  registar_actualizar(parent, childrens, callback) {
       
        var query = "INSERT INTO MANAGE.TASK output inserted.* values(:idTicket,:description,null,:time,:started,:finished,null,CURRENT_TIMESTAMP,1)";
         dbContext.getQuery(query, parent, QueryTypes.INSERT,  function(error, data, rowCount) {
            if (rowCount > 0) {
                const idParent = data[0][0].IdTask;
                let i = 0;
                
                if (childrens.length == 0) { return callback (null)}

                childrens.forEach(element => {
       
                       element.idParent = idParent;
                        var queryChild = "INSERT INTO MANAGE.TASK output inserted.* values(:idTicket,:description,:idParent,:time,:started,:finished,:idTypeTask,CURRENT_TIMESTAMP,1)";
                         dbContext.getQuery(queryChild, element, QueryTypes.INSERT, function(error) {
                            if (error) {  
                                return callback(error);
                            }
                            i++;
                            if( i == childrens.length) {
                                return callback(null);
                            }
                        });
                });

            } else {
                return callback(error);
            }
        })
    }

    return {
        post: postTask
    };
}

module.exports = TaskRepository;
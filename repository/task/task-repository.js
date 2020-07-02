var { QueryTypes } = require('sequelize');

function TaskRepository(dbContext) {
    function getTaskByIdTicket(req, res) {
        var params = {'Id': req.params.id};
        dbContext.getQuery("Manage.getTaskByIdTicket :Id",params, QueryTypes.SELECT,  function(error, data) {
            if(error) return res.status(500).send({message:'Error al consultar', info: error});

            return res.status(200).send(data);
        })
    }

    function getTaskChildByIdParent(req, res) {
        var params = {'Id': req.params.idParent};
        dbContext.getQuery("manage.getTaskChildByIdTask :Id",params,QueryTypes.SELECT, function(error, data) {
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

    function postTask(req, res) {
      
        var tasks =  [];
        let counter = 0;
        let idDeleted = [];
        var root =  { 
                        description : req.body.mainDescription,
                        idTicket: req.body.idTicket,
                        idTypeTask:0,
                        time: 0 , 
                        finished: new Date,
                        started: new Date,
                        IdTask: req.body.id
                    };

        req.body.subTasks.forEach(element => {
            
            if (!element.isdeleted && element.id == 0) 
            {

                tasks.push({
                    description : element.description,
                    idTicket: element.idTicket,
                    idTypeTask: element.type,
                    time: element.time,
                    started: element.started,
                    finished: element.finished,
                    idParent: root.idTicket
                })
                counter+= element.time;
            }else if(element.isdeleted){
                idDeleted.push(element.id);
            }
        });

        if(req.body.id == 0) {

            root.time = counter;
            root.started = tasks[0].started;
            root.finished= tasks[tasks.length - 1].finished;
        }
     
        registar_actualizar(root, tasks,idDeleted, function(error) {
            if(error) {
                return res.status(500).send({message:"Error", info:error});
            } else {
                return res.status(200).send({data: true});
            }
       });
    }

    function  registar_actualizar(parent, childrens,  idDeleted, callback) {
        
        var query = (parent.IdTask == 0)? "INSERT INTO MANAGE.TASK output inserted.* values(:idTicket,:description,null,:time,:started,:finished,null,CURRENT_TIMESTAMP,1)"
                                : "update Manage.Task set Description  = :description, estimatedEffort = :time where IdTask = :IdTask";
         dbContext.getQuery(query, parent,  (parent.IdTask == 0)? QueryTypes.INSERT: QueryTypes.UPDATE,  function(error, data, rowCount) {
            if (rowCount > 0) {
                const idParent = (parent.IdTask == 0)?data[0][0].IdTask: parent.IdTask;
                let i = 0;
                
                if(parent.IdTask > 0) {
                    dbContext.getQuery("update Manage.Task set recordStatu = 0 where IdTask  in (:ids)",{ids: idDeleted}, QueryTypes.UPDATE, function(error) {
                        if (error) {  
                            return callback(error);
                        }
                    })
                }

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
        post: postTask,
        getbyId: getTaskById,
        getChildren: getTaskChildByIdParent,
        getByTickectId: getTaskByIdTicket
    };
}

module.exports = TaskRepository;
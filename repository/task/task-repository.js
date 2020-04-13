var response = require("../../shared/response");
var TYPES = require("tedious").TYPES;
var request = require("tedious").request;

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
     var params = [];
     params.push({name:"Id", type:TYPES.Int, val: req.body.idTask});
     var query = "select IdTask, Description, started, finished,IdTypeTask from Manage.task where IdTask = @Id";
     dbContext.getQuery(query, params, false, function (error, data, rowCount) {
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
                            id: element.id,
                            idTypeTask: element.type,
                            time: element.time,
                            started: element.started,
                            finished: element.finished,
                            idTicket: root.idTicket
            })
            counter+= element.time;
        });

       root.time = counter;
       root.started = tasks[0].started;
       root.finished= tasks[tasks.length - 1].finished;
       let error = "";
       error = await registar_actualizar(root, tasks);
        // var query = "INSERT INTO MANAGER.TASK output inserted.* values(@IdTask,@Description,@IdParent,@EstimatedEffort,@Stated,@Finished,@IdTypeTask,CURRENT_TIMESTAMP,1)";
        // dbContext.getQuery(query, params, false, function(error, data, rowCount) {
        //     if (rowCount > 0) {

        //     } else {
        //         return res.status(500).send({message:"Error", info:error});
        //     }
        // })

        if (error.length > 0) {

            return res.status(500).send({message:"Error", info:error});
        } else {
            return res.status(200);
        }
    }

    async function  registar_actualizar(parent, childrens) {
        var params = [];
        params.push({name:"IdTicket", type: TYPES.Int, val: parent.idTicket});
        params.push({name:"Description", type: TYPES.Text, val: parent.description});
        //params.push({name:"IdParent", type:TYPES.Int, val: 0});
        params.push({name:"EstimatedEffort", type: TYPES.Float, val: parent.time});
        params.push({name:"Started", type:TYPES.DateTime, val:parent.started});
        params.push({name:"Finished", type:TYPES.DateTime, val:parent.finished});
        //params.push({name:"IdTypeTask", type:TYPES.Int, val:0});

        var query = "INSERT INTO MANAGE.TASK output inserted.* values(@IdTicket,@Description,null,@EstimatedEffort,@Started,@Finished,null,CURRENT_TIMESTAMP,1)";
         dbContext.getQuery(query, params, false, async function(error, data, rowCount) {
            if (rowCount > 0) {
                const idParent = data.idTask;

                childrens.forEach(element => {
                    var param = [];
                    param.push({name:"IdTicket", type: TYPES.Int, val: parent.idTicket});
                    param.push({name:"Description", type: TYPES.Text, val: parent.description});
                    param.push({name:"IdParent", type:TYPES.Int, val: idParent});
                    param.push({name:"EstimatedEffort", type: TYPES.Float, val: parent.time});
                    param.push({name:"Started", type:TYPES.DateTime, val:parent.started});
                    param.push({name:"Finished", type:TYPES.DateTime, val:parent.finished});
                    param.push({name:"IdTypeTask", type:TYPES.Int, val:element.idTypeTask});

                    var queryChild = "INSERT INTO MANAGE.TASK output inserted.* values(@IdTicket,@Description,IdParent,@EstimatedEffort,@Started,@Finished,IdTypeTask,CURRENT_TIMESTAMP,1)";
                    dbContext.getQuery(queryChild, param, false, function(error) {
                        if (error) { return error; }
                    });
                });

            } else {
                return error;
            }
        })
    }
    return {
        post: postTask
    };
}

module.exports = TaskRepository;
const _taskRepository = require('./task-repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck');

module.exports = function (router) {
 const taskRepository = _taskRepository(dbContext);
 router.route('/task')
        .get(authCheck.isAuth, taskRepository.getbyId)
        .post(authCheck.isAuth, taskRepository.post);

router.route('/task/:idParent')
        .get(authCheck.isAuth, taskRepository.getChildren)

router.route('/task/ticket/:id')
        .get(authCheck.isAuth, taskRepository.getByTickectId)
}
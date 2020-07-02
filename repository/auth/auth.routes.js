const _authRepository = require('./auth.repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck')


module.exports = function (router) {
    const authRepository = _authRepository(dbContext);

    router.route('/auth/:userName/:passwd').get(authRepository.getToken)

    router.route('/user/:userId')
          .get(authCheck.isAuth, authRepository.get)
          .put(authCheck.isAuth, authRepository.put)

    router.route('/auth/')
        .get(authCheck.isAuth,authRepository.getAll)
        .post(authCheck.isAuth,authRepository.post)
}
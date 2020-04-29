const _ticketRepository = require('./ticket.repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck')

module.exports = function (router) {
    const ticketRepository = _ticketRepository(dbContext);
router.route('/ticket')
        .get(authCheck.isAuth, ticketRepository.getAll)
        .post(authCheck.isAuth, ticketRepository.post);
         
router.route('/ticket/:ticketId')
        .get(authCheck.isAuth, ticketRepository.get)
        .put(authCheck.isAuth, ticketRepository.put)
        .delete(authCheck.isAuth, ticketRepository.delete);
        
router.route('/ticket/byAgent/:agentId')
        .get(authCheck.isAuth, ticketRepository.getTicketAgent);

router.route('/ticket/resolve')
      .post(authCheck.isAuth, ticketRepository.postResolved)
}
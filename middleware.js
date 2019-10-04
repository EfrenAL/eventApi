/**
 * Created by efren on 04/06/17.
 */

module.exports = function (db) {

    return{
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth');

            db.user.findByPk(token).then(function (user) {
                req.user = user;
                next();
            },function (error) {
                res.status(401).send();
            });
        },
        logger: function(req, res, next) {        
            console.log('Request ' + new Date().toString() + ': '+ req.method + ' ' + req.originalUrl);
            next();
        }
    };
};

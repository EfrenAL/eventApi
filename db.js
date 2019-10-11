var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-job-api.sqlite'
    });
}

var db = {};

// Coworking project
db.country = sequelize.import(__dirname + '/models/country.js');
db.coworking = sequelize.import(__dirname + '/models/coworking.js');

db.coworking.belongsTo(db.country, {foreignKey: 'fk_countryid', sourceKey: 'uuid'});
db.country.hasMany(db.coworking, {foreignKey: 'fk_countryid', targetKey: 'uuid'})
//

db.day = sequelize.import(__dirname + '/models/day.js');
db.event = sequelize.import(__dirname + '/models/event.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.userEvent = sequelize.define('userEvents')

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//db.event.belongsTo(db.user);
db.user.belongsToMany(db.event, {through: 'userEvents'});
db.event.belongsToMany(db.user, {through: 'userEvents'})

/*
db.day.belongsTo(db.job);
db.job.hasMany(db.day);
*/
module.exports = db;

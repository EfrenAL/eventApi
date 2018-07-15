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

db.day = sequelize.import(__dirname + '/models/day.js');
db.event = sequelize.import(__dirname + '/models/event.js');
db.user = sequelize.import(__dirname + '/models/user.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//db.event.belongsTo(db.user);

db.user.hasMany(db.event);
db.event.hasMany(db.user)

/*
db.day.belongsTo(db.job);
db.job.hasMany(db.day);
*/
module.exports = db;

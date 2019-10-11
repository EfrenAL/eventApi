var db = require('../db.js');
var _ = require('underscore');

//Create single event
exports.createCountry = function (req, res) {
    //Check the data model before inserting it into the db
    var requestBody = _.pick(req.body, 'uuid', 'pictureUrl');

    db.country.create(requestBody).then(function (event) {
        res.json(event.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
};

//Get all events
exports.getAllCountries = function (req, res) {
    db.country.findAll().then(function (event) {
        res.json(event);
    }, function (e) {
        res.status(500).send();
    });
};


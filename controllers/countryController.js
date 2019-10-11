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
    db.country.findAll().then(function (countries) {

        const map1 = countries.map(item => {
            var rObj = {};
            var countryName = item.uuid
            rObj['name'] = countryName.charAt(0) + countryName.slice(1).toLowerCase();
            rObj['pictureUrl'] = item.pictureUrl;
            return rObj;            
        });

        res.json(map1);
    }, function (e) {
        res.status(500).send();
    });
};


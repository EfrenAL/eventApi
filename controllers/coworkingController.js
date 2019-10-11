var db = require('../db.js');
var _ = require('underscore');

//Create single event
exports.createCoworking = function (req, res) {
    //Check the data model before inserting it into the db
    var requestBody = _.pick(req.body, 'name', 'description', 'address', 'city', 'latitude', 'longitude', 'pictureUrl', 'webUrl', 'fk_countryid');

    db.coworking.create(requestBody).then(function (event) {
        res.json(event.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
};

//Get all coworkings
exports.getAllCoworking = function (req, res) {
    db.coworking.findAll().then(function (event) {
        res.json(event);
    }, function (e) {
        res.status(500).send();
    });
};

//Get all coworkings per country
exports.getAllCoworkingPerCountry = function (req, res) {

    var country = req.query.country;
    db.coworking.findAll({
        where: {fk_countryid: country}
      }).then(function (coworking) {
          if (!!coworking) {
              res.json(coworking)
          } else {
              res.status(404).send();
          }
      }, function (e) {
        res.status(500).send();
      });
};


var db = require('../db.js');
var _ = require('underscore');

//Create single event
exports.createPlace = function (req, res) {
    //Check the data model before inserting it into the db
    var requestBody = _.pick(req.body, 'name', 'description', 'address', 'city', 'latitude', 'longitude', 'pictureUrl', 'webUrl', 'fk_countryid', 'coworking', 'surf', 'yoga');

    db.place.create(requestBody).then(function (event) {
        res.json(event.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
};

//Get all coworkings
exports.getAllPlaces = function (req, res) {
    db.place.findAll().then(function (event) {
        res.json(event);
    }, function (e) {
        res.status(500).send();
    });
};

//Get all coworkings per country
exports.getAllPlacesPerCountry = function (req, res) {

    var country = req.query.country;
    var coworking = req.query.coworking;
    var surf = req.query.surf;
    var yoga = req.query.yoga;

    var parms = {
        fk_countryid: country,        
    }

    if(coworking === 'true')
        parms['coworking'] = true
    if(surf === 'true')
        parms['surf'] = true
    if(yoga === 'true')
        parms['yoga'] = true    

    console.log(parms);

    db.place.findAll({
        where: parms
      }).then(function (place) {
          if (!!place) {
              res.json(place)
          } else {
              res.status(404).send();
          }
      }, function (e) {
        res.status(500).send();
      });
};


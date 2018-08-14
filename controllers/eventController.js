var db = require('../db.js');
var _ = require('underscore');

//Create single event
exports.createEvent = function (req, res) {

    //Check the data model before inserting it into the db
    var requestBody = _.pick(req.body, 'name', 'description', 'postcode', 'street', 'city', 'country');

    db.event.create(requestBody).then(function (event) {
        res.json(event.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
};

//Get all events
exports.getEvents = function (req, res) {

    db.event.findAll().then(function (event) {
        res.json(event);
    }, function (e) {
        res.status(500).send();
    });
};

//Get event by Id
exports.getEvent = function (req, res) {
    var eventId = parseInt(req.params.id, 10);

    db.event.findById(eventId).then(function (event) {
        if (!!event) {
            res.json(event.toJSON())
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });
};

//Delete event by id
exports.deleteEvent = function (req, res) {

    var eventId = parseInt(req.params.id, 10);

    db.event.destroy({
        where: {
            id: eventId
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted != 0) {
            res.status(200).send();
        } else {
            res.status(404).json({error: 'No event found with that id'});
        }
    }, function (e) {
        res.status(500).json(e);
    });
};

//Update event by Id
exports.updateEvent = function (req, res) {
    //
    var eventId = parseInt(req.params.id, 10);

    //Validate data
    var requestBody = _.pick(req.body, 'name', 'description', 'picture');
    var attribute = {};

    if (requestBody.hasOwnProperty('name')) {
        attribute.name = requestBody.name;
    }
    if (requestBody.hasOwnProperty('description')) {
            attribute.description = requestBody.description;
    }

    db.event.findById(eventId).then(function (event) {
        if (event) {
            event.update(attribute).then(function (event) {
                res.json(event.toJSON())
            }, function (e) {
                res.status(400).send();
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
};

//Get all users associated with one event
exports.getAllUsers = function (req, res) {

    var eventId = parseInt(req.params.eventId, 10);

    db.event.find({
      where: {id: eventId},
      include: [{
        model: db.user/*,
        through: {
          where: {eventId: eventId}
        }*/
      }]
    }).then(function (users) {
      res.json(users);
    }, function (e) {
      res.status(500).send();
    });
}
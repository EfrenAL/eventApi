var db = require('../db.js');
var _ = require('underscore');

//Create new user
exports.createUser = function (req, res) {
    var body = _.pick(req.body,'name', 'email', 'password');

    db.user.create(body).then(function (user) {
        var token = user.generateToken('authentication');
        if (token) {
            res.header('Auth', token).json(user.toPublicJSON());
        } else {
            res.status(401).send();
        }
    }, function (e) {
        res.status(400).json(e);
    });
};


//Login user
exports.loginUser = function (req, res) {

    var body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function (user) {
        var token = user.generateToken('authentication');
        if (token) {
            res.header('Auth', token).json(user.toPublicJSON());
        } else {
            res.status(401).send();
        }
    }, function (error) {
        res.status(401).send();
    })
};

//Update user
exports.updateUser = function (req, res) {

    //Validate data
    var requestBody = _.pick(req.body, 'name', 'description', 'pictureUrl');
    var attribute = {};

    if (requestBody.hasOwnProperty('name')) attribute.name = requestBody.name;

    if (requestBody.hasOwnProperty('description'))  attribute.description = requestBody.description;

    if (requestBody.hasOwnProperty('pictureUrl')) attribute.pictureUrl = requestBody.pictureUrl;

    db.user.findById(req.user.id).then(function (user) {
        if (user) {
            user.update(attribute).then(function (user) {
                res.json(user.toPublicJSON())
            }, function (e) {
                res.status(400).send('NO user with this Auth token');
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
};

//Link user with an event by eventId
exports.linkUserEvent = function (req, res) {

    var eventId = parseInt(req.params.id, 10);

    db.event.findById(eventId).then(function (event) {
        req.user.addEvents(event).then(function (response) {
            res.status(200).send();
        }).then(function (event) {
            res.status(500).send();
        });
    }, function (e) {
        res.status(500).send();
    });
}

//Get all events for a single user
exports.getAllEvents = function (req, res) {

    db.user.find({
      where: {id: req.user.id},
      include: [{
        model: db.event,
        through: {
          where: {userId: req.user.id}
        }
      }]
    }).then(function (event) {
      res.json(event);
    }, function (e) {
      res.status(500).send();
    });
}
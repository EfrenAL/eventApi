var db = require('../db.js');
var _ = require('underscore');
var crypto = require('crypto');
var pass = 'FbLogin'

//Create new user
exports.createUser = function (req, res) {
    console.log('\n******** Sign Up user ********');
    var body = _.pick(req.body,'name', 'email', 'password');
    signUp(body,res);
};

//Login user
exports.loginUser = function (req, res) {
    console.log('\n******** Login User ********');
    var body = _.pick(req.body, 'email', 'password');
    login(body, res)
};

//Login & Signup with facebook
exports.loginSignUpUserFacebook = function (req, res) {
    console.log('\n******** Login social media ********');
    var body = _.pick(req.body, 'email', 'name', 'token', 'pictureUrl');

    db.user.findOne({
        where:{
            email: body.email
        }
    }).then(function (user) {
        body.password = generatePassword(body.email)
        if(!user){
            console.log('Social Login: ' + ' Sign Up user');
            console.log('Values: ' + body.email + ', ' + body.name  + ', ' + body.token + ', '+ body.pictureUrl )
            signUp(body, res);
        }else{
            console.log('Social Login: ' + ' Login user');
            login(body, res);
        }
    },function (error) {
        res.status(400).json(e);
    });
};

function login(body, res){
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
}

function generatePassword(email){
    var toHash = email + pass;
    return crypto.createHash('md5').update(toHash).digest('hex');
}

function signUp(body, res){
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
}


//Update user
exports.updateUser = function (req, res) {

    console.log('\n******** Update User ********');

    //Validate data
    var requestBody = _.pick(req.body, 'name', 'description', 'pictureUrl','company','position');
    var attribute = {};

    if (requestBody.hasOwnProperty('name') && requestBody.name !== "") attribute.name = requestBody.name;

    if (requestBody.hasOwnProperty('description') && requestBody.description !== "")  attribute.description = requestBody.description;

    if (requestBody.hasOwnProperty('pictureUrl') && requestBody.pictureUrl !== "") attribute.pictureUrl = requestBody.pictureUrl;

    if (requestBody.hasOwnProperty('company') && requestBody.company !== "") attribute.company = requestBody.company;

    if (requestBody.hasOwnProperty('position') && requestBody.position !== "") attribute.position = requestBody.position;

    console.log('Name: ', attribute.name);
    console.log('Description: ', attribute.description);
    console.log('PictureUrl: ', attribute.pictureUrl);
    console.log('Company: ', attribute.company);
    console.log('Position: ', attribute.position);

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

    console.log('\n******** Link User and Event ********');
    //var eventId = parseInt(req.params.id, 10);

    db.event.find({
        where: {code: req.params.eventCode}
    }).then(function (event) {
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

    console.log('\n******** Get All Events ********');
    console.log('User ID: ' + req.user.id + "\n")

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
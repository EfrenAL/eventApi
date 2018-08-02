var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var db = require('./db.js');
var PdfPrinter = require('pdfmake/src/printer');
var bcrypt = require('bcryptjs');
var middleware = require('./middleware.js')(db);
var app = express();
var PORT = process.env.PORT || 3000;
var events = [];
var jobNextId = 1;


//Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


//**************** CLIENT/Event ************************


//Get event by id
app.get('/event/:id', function (req, res) {
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
});

//Get /events?completed=true&q=work
app.get('/events', function (req, res) {
    //Attributes sent in the request e.g. completed, name etc
    var query = req.query;

    db.event.findAll().then(function (event) {
        res.json(event);
    }, function (e) {
        res.status(500).send();
    });
});

//POST  /event/   POST NEW EVENT
app.post('/event', function (req, res) {

    //Check the data model before inserting it into the db
    var requestBody = _.pick(req.body, 'name', 'description', 'postcode', 'street', 'city', 'country');

    db.event.create(requestBody).then(function (event) {
        res.json(event.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });


});

//************ EVENT END

//******    Events per User *******

//POST  /event/    USER <----> EVENT      Empareja un eventId con un userId
app.post('/user-event/:id', middleware.requireAuthentication, function (req, res) {

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
});

//User events        Muestra los events asociados a un userId
app.get('/user-event', middleware.requireAuthentication, function (req, res) {

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
});

//****** User associated with an event *******

app.get('/event-user/:id', middleware.requireAuthentication, function (req, res) {

    var eventId = parseInt(req.params.id, 10);

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
});


//********END

//Get /events?completed=true&q=work
app.get('/events', middleware.requireAuthentication, function (req, res) {
    //Attributes sent in the request e.g. completed, name etc
    var query = req.query;
    var where = {
        userId: req.user.get('id')
    };

    db.event.findAll({
        where: where
    }).then(function (event) {
        res.json(event);
    }, function (e) {
        res.status(500).send();
    });
});

//Delete /event/:id
app.delete('/event/:id', middleware.requireAuthentication, function (req, res) {
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
});

//Update PUT /event/:id
app.put('/event/:id', middleware.requireAuthentication, function (req, res) {
    //
    var eventId = parseInt(req.params.id, 10);

    //Validate data
    var requestBody = _.pick(req.body, 'name', 'description', 'picture');
    var attribute = {};

    /*if (requestBody.hasOwnProperty('completed')) {
        attribute.completed = requestBody.completed;
    } else if (requestBody.hasOwnProperty('completed')) {
        res.status(400).send();
    }*/

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
});
//**************** END Event ************************


// ############### START USERS ###########################

app.post('/users', function (req, res) {

    var body = _.pick(req.body,'name', 'email', 'password');

    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(400).json(e);
    });

});


//User login  POST /users/login

app.post('/users/login', function (req, res) {

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

});

//Update PUT /users/:id
app.put('/users', middleware.requireAuthentication, function (req, res) {

    //Validate data
    var requestBody = _.pick(req.body, 'name', 'description', 'pictureUrl');
    var attribute = {};


    if (requestBody.hasOwnProperty('name')) {
        attribute.name = requestBody.name;
    }

    if (requestBody.hasOwnProperty('description')) {
        attribute.description = requestBody.description;
    }

    if (requestBody.hasOwnProperty('pictureUrl')) {
        attribute.pictureUrl = requestBody.pictureUrl;
    }

    db.user.findById(req.user.id).then(function (user) {
        if (user) {
            user.update(attribute).then(function (user) {
                res.json(user.toJSON())
            }, function (e) {
                res.status(400).send();
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
});


// ############### END USERS ###########################


// $$$$$$$$$$$$$$$    START DAY    $$$$$$$$$$$$$$$$$$$$$$$

app.get('/days/:jobId', middleware.requireAuthentication, function(req,res){
    var query = req.query;
    var jobId = parseInt(req.params.jobId, 10);
    var where = {
        jobId: jobId
    };

    db.day.findAll({
        where: where
    }).then(function (day) {
        res.json(day);
    }, function (e) {
        res.status(500).send();
    });
});

app.post('/days', middleware.requireAuthentication, function (req, res) {
    //Check the data model before inserting it into the db
    var jobId = parseInt(req.body.jobId, 10);

    var requestBody = _.pick(req.body, 'start', 'end', 'wage', 'pauze', 'note', 'surtaxes');

    db.day.create(requestBody).then(function (day) {

        db.job.findById(jobId).then(function (job) {
            job.addDay(day).then(function () {
                return day.reload();
            }).then(function (day) {
                res.json(day.toJSON());
            });
        }, function (e) {
            res.status(500).send();
        });

    }, function (e) {
        res.status(400).json(e);
    });
});

// $$$$$$$$$$$$$$$    END DAY    $$$$$$$$$$$$$$$$$$$$$$$



//Route page
app.get('/', function (req, res) {
    res.send('Bquini API Root');
});


db.sequelize.sync({force: true}).then(function () {
    //We start the server here once the db is initialized
    app.listen(PORT, function () {
        console.log('Express runing on Port: ' + PORT);
    });
});



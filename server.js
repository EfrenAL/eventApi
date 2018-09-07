var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var middleware = require('./middleware.js')(db);
var app = express();
var PORT = process.env.PORT || 3000;

//Controllers
var userController = require('./controllers/userController.js');
var eventController = require('./controllers/eventController.js');

//Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Auth, Accepts");
  next();
});

// #### Event Domain ####

app.post('/event', eventController.createEvent);

app.get('/event/all', eventController.getEvents);

app.get('/event/:eventCode', eventController.getEvent);

app.delete('/event/:id', eventController.deleteEvent);

app.put('/event/:id', eventController.updateEvent);

app.get('/event/user/:eventId', middleware.requireAuthentication, eventController.getAllUsers);

// #### User Domain ####

app.post('/user', userController.createUser);

app.post('/user/login', userController.loginUser);

app.post('/user/facebook', userController.loginSignUpUserFacebook);

app.put('/user', middleware.requireAuthentication, userController.updateUser);

app.post('/user/event/:eventCode', middleware.requireAuthentication, userController.linkUserEvent);

app.get('/user/event/all', middleware.requireAuthentication, userController.getAllEvents);

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
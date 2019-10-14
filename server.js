var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var middleware = require('./middleware.js')(db);
var app = express();
var PORT = process.env.PORT || 3000;

//Controllers
var userController = require('./controllers/userController.js');
var eventController = require('./controllers/eventController.js');
var countryController = require('./controllers/countryController.js');
var coworkingController = require('./controllers/coworkingController.js');

//Middleware
app.use(bodyParser.json());
app.use(middleware.logger);
app.use(express.static(__dirname + '/public'));

//Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Auth, Accepts");
  next();
});


// #### Country Domain ####
app.post('/country', countryController.createCountry);
app.get('/country/all', countryController.getAllCountries);
// #### Coworking Domain ####
app.post('/coworking', coworkingController.createCoworking);
app.get('/coworking/all', coworkingController.getAllCoworking);
app.get('/coworking/:country', coworkingController.getAllCoworkingPerCountry);

// #### Event Domain ####

app.post('/event', eventController.createEvent);

app.get('/event/all', eventController.getEvents);

app.get('/event/:code', eventController.getEvent);

app.delete('/event/:id', eventController.deleteEvent);

app.put('/event/:id', eventController.updateEvent);

app.get('/event/user/:eventId', middleware.requireAuthentication, eventController.getAllUsers);

// #### User Domain ####


app.get('/user/all', userController.getAllUsers);

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

db.sequelize.sync({force: false}).then(function () {
    //We start the server here once the db is initialized
    app.listen(PORT, function () {
        console.log('Express runing on Port: ' + PORT);
    });
}); 
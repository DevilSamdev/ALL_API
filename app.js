let mongoose = require('mongoose');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let apiRoutes = require("./routes/api-routes");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://admin:admin@cluster0.qubsi.mongodb.net/Mydata', { useNewUrlParser: true});
var db = mongoose.connection;
if(!db)
    console.log("Error connecting db")
else
    console.log("Database connected successfully")
app.get('/', (req, res) => res.send('Hello World with Express'));
app.use('/api', apiRoutes);
app.listen(port, function () {
    console.log("Running on port " + port)
    });
module.exports = app;	

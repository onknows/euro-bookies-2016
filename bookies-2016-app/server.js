//    Copyright 2016 Christophe Hesters
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//            http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./app/routes');
var Dao = require('./app/dao');

var port = process.argv[2] ? process.argv[2] : 8088;
var dbUrl = process.argv[3] ? process.argv[3] : 'mysql://root:root@localhost/bookies_db';

// Create a database access object
var dao = new Dao(dbUrl);

// Create an instance of express (REST framework) and enable JSON content parsing.
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); // parses bodies with Content-Type application/json

// Configure REST endpoints
routes.registerRoutes(app, dao);

// Serve a directory with static files
app.use(express.static(__dirname + '/static'));

var port = process.argv[2] ? process.argv[2] : 8088;
app.listen(port, console.log('Server started at ' + port + '!'));

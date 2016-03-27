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

var mysql = require('mysql');

function newConnection() {
    return mysql.createConnection({
        host: '172.28.128.5',
        user: 'bookies',
        password: 'bookies',
        database: 'bookies_db'
    });
}

exports.getAllTeams = function(callback) {
    var connection = newConnection();
    connection.query('SELECT id, countryCode FROM teams', function(err, rows, fields) {
        if (err) {
            console.log('error in getAllTeams: ' + err.message)
            throw err;
        }
        callback(JSON.stringify(rows));
        connection.end();
    });
}

exports.getTeamById = function(id, callback) {
    var connection = newConnection();
    connection.query('SELECT * FROM teams WHERE id = ?', [id], function(err, rows, fields) {
        if (err) {
            console.log('error in getTeamById: ' + err.message)
            throw err;
        }
        callback(JSON.stringify(rows[0]));
        connection.end();
    });
}

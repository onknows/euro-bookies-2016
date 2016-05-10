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

/**
 * @param host database server hostname
 * @param user
 * @param password
 * @param database
 * @constructor
 */
var Dao = function(host, user, password, database) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
};

/**
 * Creates a new database connection
 */
Dao.prototype.newConnection = function newConnection() {
    return mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
    });
};

/**
 * Gets all teams from the database
 *
 * @param callback a callback function that takes a String containing the JSON result
 */
Dao.prototype.getAllTeams = function(callback) {
    var connection = this.newConnection();
    connection.query('SELECT countryCode FROM teams', function(err, rows, fields) {
        if (err) {
            console.log('error in getAllTeams: ' + err.message);
            throw err;
        }
        callback(rows);
        connection.end();
    });
};

/**
 * Finds the team by ID
 * @param id
 * @param callback
 */
Dao.prototype.getTeamByCountryCode = function(id, callback) {
    var connection = this.newConnection();
    connection.query('SELECT * FROM teams WHERE countryCode = ?', [id], function(err, rows, fields) {
        if (err) {
            console.log('error in getTeamByCountryCode: ' + err.message);
            callback(null)
        } else if (rows.length == 0) {
            callback(null);
        } else {
            callback(rows[0]);
        }
        connection.end();
    });
};

Dao.prototype.addTeam = function(countryCode, teamName, callback) {
    var connection = this.newConnection();
    var dataToInsert = { countryCode: countryCode, teamName: teamName };
    connection.query('INSERT INTO teams SET ?', dataToInsert, function(err, result) {
        if (err && err.code == 'ER_DUP_ENTRY') {
            callback(null);
        } else if (err) {
            console.log('error in addTeam: ' + err.message);
        } else {
            callback(countryCode);
        }
        connection.end();
    });
};

Dao.prototype.removeTeam = function(countryCode, callback) {
    var connection = this.newConnection();
    connection.query('DELETE FROM teams WHERE countryCode = ?', [countryCode], function(err, result) {
        if (err) {
            console.log('error in removeTeam: ' + err.message);
            callback(null);
        } else {
            callback(countryCode);
        }
        connection.end();
    });
};

module.exports = Dao;
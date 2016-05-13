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

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var bodyParser = require('body-parser')
var express = require('express');
var Dao = require('../app/dao');
var routes = require('../app/routes');

describe('GET /api/teams', function () {
    var dao = new Dao('bogus', 'bogus', 'bogus', 'bogus');

    beforeEach(function () {
        sinon.stub(dao, 'getAllTeams', function (callback) {
            // use setTimeout to simulate async behavior
            setTimeout(function () {
                callback('[{countryCode: NL, teamName: "Oranje"}, {countryCode: UA, teamName: "Ukraine"}]');
            }, 0);
        });
    });

    afterEach(function () {
        dao.getAllTeams.restore();
    });

    it('responds with teams Oranje and Ukraine in JSON!', function (done) {
        var app = express();
        routes.registerRoutes(app, dao);
        request(app)
            .get('/api/teams')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .expect(function(res){
                expect(res.body).to.contain("teamName: \"Oranje\"");
                expect(res.body).to.contain("teamName: \"Ukraine\"");
             })
            .end(function (err, res) { if (err) throw err; done(); });
    });
});

describe('GET /api/teams/:countryCode', function () {
    var dao = new Dao('bogus', 'bogus', 'bogus', 'bogus');

    beforeEach(function () {
        sinon.stub(dao, 'getTeamByCountryCode', function (countryCode, callback) {
            // use setTimeout to simulate async behavior
            setTimeout(function () {
                if (countryCode == 'ZZ') {
                    callback(undefined);
                } else {
                    callback('{countryCode: "' + countryCode + '", teamName: "the team"}');
                }
            }, 0);
        });
    });

    afterEach(function () {
        dao.getTeamByCountryCode.restore();
    });

    it('team with countryCode NL should return a team with countryCode NL', function (done) {
        var app = express();
        routes.registerRoutes(app, dao);
        request(app)
            .get('/api/teams/NL')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .expect(function(res){
                expect(res.body).to.contain("countryCode: \"NL\"");
             })
            .end(function (err, res) { if (err) throw err; done(); });
    });

    it('team with countryCode UA should return a team with countryCode UA', function (done) {
        var app = express();
        routes.registerRoutes(app, dao);
        request(app)
            .get('/api/teams/UA')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .expect(function(res){
                expect(res.body).to.contain("countryCode: \"UA\"");
            })
            .end(function (err, res) { if (err) throw err; done(); });
    });


    it('team with countryCode ZZ that does not exist should return 404', function (done) {
        var app = express();
        routes.registerRoutes(app, dao);
        request(app)
            .get('/api/teams/ZZ')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(404)
            .end(function (err, res) { if (err) throw err; done(); });
    });

});


describe('POST /api/teams/:countryCode', function () {
    var dao = new Dao('bogus', 'bogus', 'bogus', 'bogus');

    beforeEach(function () {
        sinon.stub(dao, 'addTeam', function (countryCode, teamName, callback) {
            // use setTimeout to simulate async behavior
            setTimeout(function () {
                if (countryCode == 'ER') {
                    callback(undefined);
                } else {
                    callback(countryCode.toUpperCase());
                }
            }, 0);
        });
    });

    afterEach(function () {
        dao.addTeam.restore();
    });

    it('created team AA', function (done) {
        var app = express();
        app.use(bodyParser.json()); // parses bodies with Content-Type application/json
        routes.registerRoutes(app, dao);
        request(app)
            .post('/api/teams/AA')
            .set('Content-Type', 'application/json')
            .send({teamName: 'Alcoholic Anonymous'})
            .expect(201)
            .expect(function(res){
                expect(res.body).to.be.json;
                expect(JSON.stringify(res.body)).to.contain('AA');
             })
            .end(function (err, res) { if (err) throw err; done(); });
    });

    it('errors on duplicate team', function (done) {
        var app = express();
        app.use(bodyParser.json()); // parses bodies with Content-Type application/json
        routes.registerRoutes(app, dao);
        request(app)
            .post('/api/teams/ER')
            .send({teamName: 'Er Ror'})
            .expect(409)
            .end(function (err, res) { if (err) throw err; done(); });
    });

});


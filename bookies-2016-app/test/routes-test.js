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

var express = require('express');
var Dao = require('../app/dao');
var routes = require('../app/routes');

describe('GET /api/teams', function () {
    var dao = new Dao('bogus', 'bogus', 'bogus', 'bogus');

    beforeEach(function () {
        sinon.stub(dao, 'getAllTeams', function (callback) {
            // use setTimeout to simulate async behavior
            setTimeout(function () {
                callback('[{id: 1, teamName: "Oranje"}, {id: 2, teamName: "Ukraine"}]');
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

describe('GET /api/teams/:id', function () {
    var dao = new Dao('bogus', 'bogus', 'bogus', 'bogus');

    beforeEach(function () {
        sinon.stub(dao, 'getTeamById', function (id, callback) {
            // use setTimeout to simulate async behavior
            setTimeout(function () {
                if (id == 10) {
                    callback(undefined);
                } else {
                    callback('{id: ' + id + ', teamName: "the team"}');
                }
            }, 0);
        });
    });

    afterEach(function () {
        dao.getTeamById.restore();
    });

    it('team with id 3 should return a team with id 3', function (done) {
        var app = express();
        routes.registerRoutes(app, dao);
        request(app)
            .get('/api/teams/3')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .expect(function(res){
                expect(res.body).to.contain("id: 3");
             })
            .end(function (err, res) { if (err) throw err; done(); });
    });

    it('team with id 5 should return a team with id 5', function (done) {
        var app = express();
        routes.registerRoutes(app, dao);
        request(app)
            .get('/api/teams/5')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .expect(function(res){
                expect(res.body).to.contain("id: 5");
            })
            .end(function (err, res) { if (err) throw err; done(); });
    });


    it('team with id 10 that does not exist should return 404', function (done) {
        var app = express();
        routes.registerRoutes(app, dao);
        request(app)
            .get('/api/teams/10')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(404)
            .end(function (err, res) { if (err) throw err; done(); });
    });

});


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


/**
 * Configures the REST endpoints on app. The dao is necessary to retrieve content.
 *
 * @param app express instance
 * @param dao Dao instance
 */
exports.registerRoutes = function(app, dao) {
    app.get('/', function (req, res) {
        console.log("GET /");
        res.send('Welcome to euro-bookies :) !');
    });

    app.get('/version', function(req, res) {
        console.log("GET /version");
        var gitShorthash = process.argv[4] ? process.argv[4] : '0000000';
        var buildTimestamp = process.argv[5] ? process.argv[5] : '2016-00-00T00:00:00Z';
        var version = { version: gitShorthash, dockerBuildTimestamp: buildTimestamp }
        res.json(version);
    });

    app.get('/api/teams', function (req, res) {
        console.log("GET /api/teams");
        dao.getAllTeams(function (jsonResult) {
            res.json(jsonResult);
        });
    });

    app.get('/api/teams/:id', function (req, res) {
        console.log("GET /api/teams/" + req.params.id);
        if (req.params.id.length != 2) {
            res.status(400).send("Country code should always have length 2");
        } else {
            dao.getTeamByCountryCode(req.params.id, function (jsonResult) {
                if (jsonResult) {
                    res.json(jsonResult);
                } else {
                    res.status(404).send("Team with id " + req.params.id + " not found");
                }
            });
        }
    });

    app.post('/api/teams/:id', function (req, res) {
        console.log("POST /api/teams/" + req.params.id);
        if (req.params.id.length != 2) {
            res.status(400).send("Country code should always have length 2");
        } else {
            dao.addTeam(req.params.id.toUpperCase(), req.body.teamName, function (teamId) {
                if (teamId == -1) {
                    res.status(500).send("Error while creating the team");
                } else if (teamId) {
                    res.status(201).send({ team : teamId });
                } else {
                    res.status(409).send("Failed to create team, already exists");
                }
            });
        }
    });

    app.delete('/api/teams/:id', function (req, res) {
        console.log("DELETE /api/teams/" + req.params.id);
        if (req.params.id.length != 2) {
                    res.status(400).send("Country code should always have length 2");
        } else {
            dao.removeTeam(req.params.id.toUpperCase(), function (teamId) {
                if (teamId) {
                    res.status(204).send({ team : teamId });
                } else {
                    res.status(409).send("Failed to delete team");
                }
            });
        }
    });
};

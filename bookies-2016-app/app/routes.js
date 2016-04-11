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
        res.send('Welcome to euro-bookies :) !');
    });

    app.get('/api/teams', function (req, res) {
        console.log("GET /api/teams");
        dao.getAllTeams(function (jsonResult) {
            res.json(jsonResult);
        });
    });

    app.get('/api/teams/:id', function (req, res) {
        console.log("GET /api/teams/" + req.params.id);
        dao.getTeamById(req.params.id, function (jsonResult) {
            if (jsonResult) {
                res.json(jsonResult);
            } else {
                res.status(404).send("Team with id " + req.params.id + " not found");
            }
        });
    });

    app.get('/api/users', function (req, res) {
        res.send('BettingUsers');
    });

    app.get('/api/users/:id', function (req, res) {
        res.send('BettingUser ' + req.params.id);
    });
};

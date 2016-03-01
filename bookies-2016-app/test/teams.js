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


// debug by adding '--debug-brk' to the test command in pacakge.json

var assert = require('assert');
var request = require('supertest');

describe('Teams API test', function() {
    var baseUrl = 'http://localhost:8088';

    describe('GET /api/teams', function () {
        it('should return the string: EKTeams', function (done) {
            request(baseUrl)
                .get('/api/teams')
                .expect('Content-Type', /text/)
                .expect('Content-Length', '7')
                .expect(200)
                .end(function(err, res){
                    if (err) throw err;
                    // add asserts
                    done();
                });
        });
    });
});

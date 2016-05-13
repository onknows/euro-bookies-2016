import java.nio.file.{Files, Paths}
import io.gatling.core.Predef._
import io.gatling.http.Predef._

import java.nio.file.{Paths, Files}

import scala.concurrent.duration._
/**
	* Tests the flow of looking up a team, discovering that it does not exists, adding it, checking it then, and then delete
	* it again so that the test can run again at a later time without interference of test data.
	*
	* @author Christophe Hesters
	*/
class TeamEditSimulation extends Simulation {

	val baseUrl = System.getProperty("application.url", "http://localhost:8088")
	println("running team edit load test against: " + baseUrl);
	val httpProtocol = http.baseURL(baseUrl)

	//file must be in resources/data folder
	// csv = comma separated values, ssv = semicolon separated values, tsv = tab separated values
	val testTeams = ssv("teams-for-test.csv").circular

	val scn = scenario("TeamEditSimulation")
		.feed(testTeams)

		.exec(http("team does not exist")
			.get("/api/teams/${countryCode}")
			.check(status.is(404)))

    .exec(http("added team")
			.post("/api/teams/${countryCode}")
			.header("Content-Type", "application/json")
			.body(StringBody("{ \"teamName\": \"${teamName}\" }"))
      .check(status.is(201)))

		.exec(http("team now exists")
			.get("/api/teams/${countryCode}")
			.check(status.is(200),
						 regex("${teamName}").exists))

    .exec(http("delete team")
      .delete("/api/teams/${countryCode}")
      .check(status.is(204)))

		.exec(http("team does not exist anymore")
			.get("/api/teams/${countryCode}")
			.check(status.is(404)))

	//percentile 4 means 99th percentile
	//percentile 3 means 95th percentile
	//percentile 2 means 75th percentile
	//percentile 1 means 50th percentile

	setUp(scn.inject(rampUsers(200) over (60 seconds)))
			.protocols(httpProtocol)
			.assertions(global.responseTime.percentile3.lessThan(50)) // 95 percent of all requests must respond within 50ms
		  .assertions(global.failedRequests.percent.lessThan(0))    // if any of the tests/calls fail, the test is failed
}

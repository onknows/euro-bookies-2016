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
class BetsEditSimulation extends Simulation {

	val baseUrl = System.getProperty("application.url", "http://localhost:8088")
	println("running bets load test against: " + baseUrl);
	val httpProtocol = http.baseURL(baseUrl)

	val scn = scenario("BetsEditSimulation")

		.exec(http("get all bets")
			.get("/api/bets")
			.check(status.is(200)))

	//percentile 4 means 99th percentile
	//percentile 3 means 95th percentile
	//percentile 2 means 75th percentile
	//percentile 1 means 50th percentile

	setUp(scn.inject(rampUsers(200) over (60 seconds)))
			.protocols(httpProtocol)
			.assertions(global.responseTime.percentile3.lessThan(50)) // 95 percent of all requests must respond within 50ms
		  .assertions(global.failedRequests.percent.lessThan(0))    // if any of the tests/calls fail, the test is failed
}

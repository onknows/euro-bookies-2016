package nl.toefel.bookies.acceptancetest;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

/**
 * Runs the acceptance tests using Cucumber
 *
 * @author Christophe Hesters
 */
@RunWith(Cucumber.class)
@CucumberOptions(
        features={"classpath:"},
        format = {"pretty", "html:target/cucumber", "json:target/cucumber.json"},
        strict = true)
public class RunCukesTest {
}

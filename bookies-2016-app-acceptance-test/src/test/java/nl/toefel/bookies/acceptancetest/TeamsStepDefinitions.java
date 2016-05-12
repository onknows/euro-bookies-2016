package nl.toefel.bookies.acceptancetest;

import com.google.gson.reflect.TypeToken;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import de.galan.flux.Response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static de.galan.flux.Flux.request;
import static nl.toefel.bookies.acceptancetest.GsonHelper.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Christophe Hesters
 */
public class TeamsStepDefinitions {

    public static TestContext context = TestContext.createAutoConfigured();

    private Response response;

    @Given("^a working connection to the bookies-app$")
    public void aWorkingConnectionToTheBookiesApp() throws Throwable {
        context.assertThatConnectionIsWorking();
    }

    @When("^i request all the teams$")
    public void iRequestAllTheTeams() throws Throwable {
        response = request(context.baseUrl() + "/api/teams").get();
    }

    @Then("^i expect status code \"([^\"]*)\"$")
    public void iExpectStatusCode(Integer expectedStatusCode) throws Throwable {
        assertThat(response.getStatusCode()).as("http status").isEqualTo(expectedStatusCode);
    }

    @And("^content type of \"([^\"]*)\"$")
    public void contentTypeOf(String contentType) throws Throwable {
        assertThat(response.getContentType()).as("Content-Type").contains(contentType);
    }

    @And("^\"([^\"]*)\" or more teams in the result$")
    public void orMoreTeamsInTheResult(Integer expectedNumberOfTeams) throws Throwable {
        List l = fromJsonList(response.getStreamAsString());
        assertThat(l.size()).isGreaterThanOrEqualTo(expectedNumberOfTeams);
    }

    @When("^i add a team named \"([^\"]*)\" with countryCode \"([^\"]*)\"$")
    public void iAddATeamNamedWithCountryCode(String teamName, String countryCode) throws Throwable {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("teamName", teamName);
        response = request(context.baseUrl() + "/api/teams/" + countryCode)
                .header("Content-Type", "application/json")
                .body(toJson(requestBody))
                .post();
    }

    @When("^i query the team with countryCode \"([^\"]*)\"$")
    public void iQueryTheTeam(String countryCode) throws Throwable {
        response = request(context.baseUrl() + "/api/teams/" + countryCode)
                .header("Accept", "application/json")
                .get();
    }

    @And("^teamName to be \"([^\"]*)\"$")
    public void teamNameToBe(String teamName) throws Throwable {
        Map<String, String> responseBody = fromJson(response.getStreamAsString(), new TypeToken<Map<String, String>>(){}.getType());
        assertThat(responseBody).containsEntry("teamName", teamName);
    }

    @When("^i delete the team with countryCode \"([^\"]*)\"$")
    public void iDeleteTheTeamWithCountryCode(String countryCode) throws Throwable {
        response = request(context.baseUrl() + "/api/teams/" + countryCode).delete();
    }
}

package nl.toefel.bookies.acceptancetest;

import de.galan.flux.HttpClientException;

import static de.galan.flux.Flux.request;
import static nl.toefel.bookies.acceptancetest.TeamsStepDefinitions.context;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Cucumber tests need some context information, like the URL to context on. This class loads the parameters passed
 * as -D arguments or uses a sensible defaults. The TeamsStepDefinitions can then use an an instance of this class without
 * having to worry what value to use.
 *
 * @author Christophe Hesters
 */
public class TestContext {

    private static final String BASE_URL = "application.url";
    private static final String BASE_URL_DEFAULT = "http://localhost:8088";

    private String baseUrl;

    private TestContext() {
        baseUrl = System.getProperty(BASE_URL, BASE_URL_DEFAULT);
    }

    /** new instance configured with command line arguments, or defaults if not present */
    public static TestContext createAutoConfigured() {
        return new TestContext();
    }

    /** @return the base url without trailing slash, example: http://www.appserver.com:2344 */
    public String baseUrl() {
        return baseUrl;
    }

    public void assertWorkingConnection() throws HttpClientException {
        assertThat(request(context.baseUrl()).get().getStatusCode()).isEqualTo(200);
    }
}

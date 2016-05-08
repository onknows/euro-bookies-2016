package nl.toefel.bookies.acceptancetest;

/**
 * Cucumber tests need some context information, like the URL to test on. This class loads the parameters passed
 * as -D arguments or uses a sensible defaults. The StepDefinitions can then use an an instance of this class without
 * having to worry what value to use.
 *
 * @author Christophe Hesters
 */
public class Parameters {

    private static final String APPLICATION_URL = "application.url";
    private static final String APPLICATION_URL_DEFAULT_VALUE = "http://localhost:55555";

    private String applicationUrl;

    private Parameters() {
        applicationUrl = System.getProperty(APPLICATION_URL, APPLICATION_URL_DEFAULT_VALUE);
    }

    /** new instance configured with command line arguments, or defaults if not present */
    public static Parameters newParametersAutoConfigured() {
        return new Parameters();
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }
}

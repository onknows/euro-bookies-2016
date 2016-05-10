Feature: Teams

  Scenario: List all teams
    Given a working connection to the bookies-app
    When i request all the teams
    Then i expect status code "200"
    And content type of "application/json"
    And "1" or more teams in the result

  Scenario: Edit the teams
    Given a working connection to the bookies-app
    When i add a team named "Cumcummer" with countryCode "XX"
    Then i expect status code "201"

    When i query the team with countryCode "XX"
    Then i expect status code "200"
    And teamName to be "Cumcummer"

    When i delete the team with countryCode "XX"
    Then i expect status code "204"

    When i query the team with countryCode "XX"
    Then i expect status code "404"
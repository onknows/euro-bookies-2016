Feature: Teams

  Scenario: Get all installed teams
    Given a working connection to the bookies-app
    When i request all the teams
    Then i expect status code "200"
    And content type of "application/json"
    And more than "1" teams in the result

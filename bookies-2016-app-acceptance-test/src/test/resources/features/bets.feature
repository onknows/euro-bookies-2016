Feature: Bets

  Scenario: List all bets
    Given a working connection to the bookies-app
    When i request all bets
    Then i expect status code "200"
    And content type of "application/json"
    And "10" or more teams in the result

Feature: Check missing cases

Scenario: When a case doesn't yet exist I should get a message saying we will watch for that case
  Given no case exists for the case number
  When I send courtbot a text with the name of that case
  Then courtbot responds with the following text:
  """
  Couldn't find your case. It can take some time for new cases to appear in the sytem. We will attempt to find your case for 10 days.
  """

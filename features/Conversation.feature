Feature: Conversations

Scenario: As a self-service user I should be asked for the party when multiple options are present
  Given A case exists with multiple parties with case number "CF-2016-6446" and the following parties:
    | name            |
    | KENDRICKS, TEON |
    | ODELL, TIFFANY  |
  When I send courtbot a text with the name of that case
  Then courtbot responds with the following text:
  """
  We found a case for multiple parties, please specify which party you are by entering the number shown:

  1 - KENDRICKS, TEON
  2 - ODELL, TIFFANY
  """

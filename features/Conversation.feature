Feature: Conversations

Scenario: As a self-service user I should be asked for the party when multiple options are present
  Given A case exists with multiple parties with case number "CF-1234-5678" and the following parties:
    | name                |
    | LASTNAME, FIRSTNAME |
    | MCPERSON, PERSON    |
  When I send courtbot a text with the name of that case
  Then courtbot responds with the following text:
  """
  We found a case for multiple parties, please specify which party you are by entering the number shown:

  1 - LASTNAME, FIRSTNAME
  2 - MCPERSON, PERSON
  """

Scenario: As a self-service user I should be given a message when courtbot doesn't understand my party choice
  Given A case exists with multiple parties with case number "CF-1234-78903" and the following parties:
    | name                |
    | LASTNAME, FIRSTNAME |
    | MCPERSON, PERSON    |
  When I send courtbot a text with the name of that case
  And I send courtbot a random bit of text
  Then courtbot responds with the following text:
  """
  I'm sorry, we couldn't understand "RANDOM TEXT".

  We found a case for multiple parties, please specify which party you are by entering the number shown:

  1 - LASTNAME, FIRSTNAME
  2 - MCPERSON, PERSON
  """

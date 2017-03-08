Feature: Courtbook routes

Scenario: When a contact is registered, a message is sent to the user to verify
  When A new case is registered via courtbook
  Then Courtbot sends the contact the following message to the validated phone number:
    """
    You've been signed up for court case reminders by <user> for court case <case> for party <party>.
    Would you like a courtesy reminder the day before any events? (reply YES or NO)
    """

Scenario: When a contact is registered and reponds with a yes, the user is registered in courbot
  When A new case is registered via courtbook
  And I send courtbot the text "YES" in response to its message
  Then courtbot responds with the following text:
    """
    We'll attempt to send you a reminder for any upcoming events related to the case.
    """

Scenario: When a contact is registered and reponds with a no, the user is not registered in courbot
  When A new case is registered via courtbook
  And I send courtbot the text "No" in response to its message
  Then courtbot responds with the following text:
    """
    Registration cancelled.
    """

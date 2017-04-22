Feature: Send reminders for events

Scenario: When an event is in the reminder period, I should get a message
  Given A case exists with an event 1 hour out
  And A user is registered for that case and party
  When I run the send reminders task
  Then Courtbot sends the contact the following message to the validated phone number:
    """
    Reminder: It appears you have an event on <eventDate>
    description: <eventDescription>. You should confirm your case date and time by going to http://www.oscn.net/v4/. - Tulsa Courtbot
    """

Scenario: When an event is in the reminder period, I should get a message
  Given A case exists with an event 23 hours out
  And A user is registered for that case and party
  When I run the send reminders task
  Then Courtbot sends the contact the following message to the validated phone number:
    """
    Reminder: It appears you have an event on <eventDate>
    description: <eventDescription>. You should confirm your case date and time by going to http://www.oscn.net/v4/. - Tulsa Courtbot
    """

Scenario: When an event is in the reminder period, I should get a message only once
  Given A case exists with an event 22 hours out
  And A user is registered for that case and party
  When I run the send reminders task
  Then Courtbot sends the contact the following message to the validated phone number:
    """
    Reminder: It appears you have an event on <eventDate>
    description: <eventDescription>. You should confirm your case date and time by going to http://www.oscn.net/v4/. - Tulsa Courtbot
    """
  When I run the send reminders task
  Then Courtbot does not send a message

Scenario: When an event is in the reminder period, I should get a message
  Given A case exists with an event 25 hours out
  And A user is registered for that case and party
  When I run the send reminders task
  Then Courtbot does not send a message

Scenario: When an event is in the reminder period, I should get a message
  Given A case exists with an event -1 hours out
  And A user is registered for that case and party
  When I run the send reminders task
  Then Courtbot does not send a message

# social-circle
A location based social media application utilizing google maps

//Currently, CHROME is the only supported browser

Nomenclature

  cast = send message (sent message)

This app will have the following main functions:

  1. A user may cast any message, which can be tied to any location (current location or user chosen location).  Each cast has both a subject line, a message, an expiration time/date (at which time the message will annihilate itself), and a picture icon which is tied to the sender's profile.  The message is sent to any group(topic) chosen by the sender and any user following the sender.  Messages can be cast to the enture public, rather than to a specific group (broadcast).  The group the message is cast to and the subject of the cast message may be the same, but the message is stored in the group chosen from a list of existing groups at the time of the cast's creation.
  2. Any user may search for casts with a number of criteria.  Users can subscribe to other users, in which case they will automatically receive notifications for any cast sent by the subscribed user.  Users can search by attribute, such as time until expiration, subject line, group, keywords in message etc.  Users can also subcribe to groups, in which case they will automatically receive notifications for postings to this group.

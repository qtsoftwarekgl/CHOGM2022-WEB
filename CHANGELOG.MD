# 24 MAY FEEDBACKS BACKEND LOGS

## ABOUT

- Added `COMSEC` enum in `ECMSTypes` to create the Comsec tab along with the about-conference

## ROOM

- Added fields `@Field(() => Boolean) bookable` to differantiate events rooms and bookable rooms, on UI add a checkbox that ask `is it for booking?`
- Added fields ` @Field(() => Number) capacity` to store a room capacity

# RATING FEATURE - 19 MAY FEEDBACKS BACKEND LOGS (BREAKCHANGE)

Added Rating feature on Venues,Forums, Users and Programmes these are the following queries

- `mutation { rateVenue(...) { ... } }`
- `mutation { rateForum(...) { ... } }`
- `mutation { rateUser(...) { ... } }`
- `mutation { rateProgramme(...) { ... } }`

for more docs refer to the playground docs tab

- Added fetch speakers programmes/sessions, eg: `programmesByUser(userId: '...') {...}`

# 19 MAY FEEDBACKS BACKEND LOGS

## TRANSPORT

- Removed type cab,bus and moto
- Added type of shuttle services and car rentals
- Added `@Field(() => OtherInfo, { nullable: true }) otherInfo` field object to store car rentals info or any cms that will require other info

## VISI RWANDA

- Added type of `OTHERS`

## PROGRAMMES

- Updated programmes queries to return `speakers` and `moderator` to be eagerly fetched, it's no longer return array of IDs
- eg: `query { ... programmes { speakers { firstName id } moderator { firstName id } } } `

## NEWS & ABOUT CONFERENCE

- Added exclusive un protected queries for new & about conference
- news: `query { news { ... name thumbnail } }` type `Cms[]`
- news: `query { aboutConference { ... name thumbnail } }` type `Cms`
- note: aboutConference returns Object not Array

# TYPEORM TO MONGOOSE DRIVER CHANGELOG

## users

- I added more fields from the QT api (check User type on playground)

## venues

- Added `locationLink` on venueInfo and removed longitude & latitude

## auth

- fixed login with qrdata

## Rooms

- when creating room (change venueId -> venue as string)
- when fetching rooms the venueId changed to venue so you can select what you want
- eg: `query { rooms { ... venue { name description } } }`

## Forums

- when creating forum (change venueId -> venue as string)
- when fetching forums the venueId changed to venue so you can select what you want (same as on rooms)

## Programmes

- forumId -> forum
- roomId -> room
- when creating send forum, room as ids, when fetching you can select what you want.

- eg: `query { programmes { ... room { name description } forum { name description } } }`

## notifications

- Added notification module (not yet used but you can check the doc)

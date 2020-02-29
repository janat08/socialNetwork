undone:
show admission info
invite friends
css specs
control acces for private events
make tickets go through email, and delete images after instance is over
fix geolocation plugin- incorrect loading, and plugin wont work maybe change script import, test jquery 1.7.1 as per example view-source:http://ubilabs.github.io/geocomplete/examples/map.html
geolocation search

backlog
wall background doesn't save on form
syncedCron wont work

wontfix
background images on users walls (literally no money to rent or buy computer or credit since im freelancer)
billing for google project (trial is used up, and there's no tricking them, as I already tried)


done:
fixed the forms, everything else seems to be working (I logged in with account that had nothing, so assumed nothing works)
qr code needs to be linked in email
3 subcategories pick for event
fixed upsertCategory

Schema
user > post> owner> user
user > friend > user


Hi jan

We are going to create an Events app, this is not an independent app but more a module in the sociaty app we started eralier.
There will be some user payment in a later edition - but for now - The over all structure is quiet simple:

	- we create an event
	- we search for an event

To create an event we will need the following inputs:

	1 - access to the event
	2 - title of the event
	3 - describtion of the event
	4 - address for the event
	5 - calendar for the event
	6 - admission to the event
	7 - photos of the event
	8 - category for the event


4 - address for the event:
	
	Here we are going to use the  'geocomplete.js' plugin - ref: and tut in the bottom. This plugin needs a Google map-key which also is to find at the bottom.

	at the core, we need an text input to the address, and then geocomplete and google will autofill a form ( you need to make the form) with:

	text-input: route(street) - text-input: street_number - text-input:postal_code - text-input:locality - text-input:sublocality - text-input:country - text-input:lat 
	- text-input:formatted_address - text-input:lng - text-input: locations - text-input: bounds.	
	And YES - we need all the inputs in the Db. Later on we are going to use the Geospatial Queries in our MongoDB 

5 - calendar for the events.

	Here we start with 2 buttons: 'Time limited event' and 'Ongoing event': The chosen template is visible - the other not visible!

	'Time Limited events' is i.e. football matches - exibitions - antique car-meetings - national days etc etc. Events that an exact start date/time and vice versa stop.
	For that we will use the 'fullcalendar packages' - see ref. in the bottom ( we might want to change the popup - so hold back a litle time for that).

	The 'Ongoing event' is i.e. museums - national buildings - theaters - galeries  etc.etc. Events that dont have a start or stop day.
	This item require more data from the events-holders - so for now - we will just fill in some dummy-data where needed.
 
------------------------------------------------------------
So much for creating events - now for searching our Events -- We  will use 2 approaches -- 1. Search for the category(subcategory)   2. Search for the the place(address).

2.	the place. This is likely a more usefull approach. When searching for a place - and filter with date - you get all the events that is happening in the place you seacrh for.
	This can be handsom if you want to know whats going on in your own city naxt month - or if on holliday, find all the events going on where ever you may be, while you are there.

	In both approches you 'just' do a {{ #each string }} searching for 'category' or 'place(address)' filter with date/interval and query for eventId,  event image(front), event Title. 
	You might need to place these query results inside a panel or a card - to keep them separeted. Inside that panel/card we place a button which - with the use of the eventID 
	(flowrouter parameter) will open a new template with all the deatils of the event( we dont need all the details here - pick a few), but we need a button 'Buy Ticket' on the 
	details Template. Clicking the 'BUY' button will generate a Meteor.call to a ticket collection inserting the currentUser's data the data for the event - the price - the date etc.
	
	For now we dont care about money, when buying a ticket to an Event. But later we will have to accept the payment, so we need an accept button. Lets create that button *Accept*, 
	below or beside the *Buy ticket* button. Clicking the 'Accept' button will 
		1. grab the just created ticketID - 
		2. create QRcode of the ticketID ( read below )  
		3. send an e-mail to the currentUser saying "Thanks for bla bla... and a print of the qrcode (we should have our email system up an running by now- right?. 

	That way - me - the currentUser can print the mail and use it as a ticket or I can bring my cellphone and show the mail to the events where they will scan the qrcode
	(I'm not sure the ticketId is the right data to put in the qrcode - likewise I'm not sure of which details to  move around - but I need the structure and I need the procedures)

	
That should conclude the Events module, for now.

About the work I think it should be rather straight foreward. The Address part is about setting up a form and a corresponing collection, the Calendar part is merely 'cut and paste' the 

'meteor Chef tutorial' and set up an collection for the calendar - and the rest is "just plumming". 

I will suggest a price of USD 150.  ?

Please start with the category part and notice me when finish with that

all the best Freddy.


links etc.

about the QRcode: here are some links:
	
	there are several plugins to help with this, after my oppinion this is the easiest to use: "atmosphere dschulz:jquery-qrcode"

	other plugins; atmosphere steeve:jquery-qrcode,  npm: npm qr-images + more...
	
	(If you like to 'test' the qr-code there, are several free QR Code Scanners and Readers on GooglePlay)

about the 'Fullcalendar'

	atmosphere packages: 'fullcalendar:fullcalendar': https://atmospherejs.com/fullcalendar
	and 'the Meteor Chef' has a tutorial for inspiration: 'https://themeteorchef.com/tutorials/reactive-calendars-with-fullcalendar'

about the geocomplete-plugin:

	https://github.com/ubilabs/geocomplete  /  https://www.npmjs.com/package/geocomplete

	I belive this is my Google-key for the maps:(please dont abuse it)

	   <script async defer src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAl1Duwvw3RESUu4paACSua-UA5Ey5fryE&libraries=places"></script>

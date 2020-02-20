undone:
background on walls
3 subcategories pick for event
geomap

done:
fixed the forms, everything else seems to be working (I logged in with account that had nothing, so assumed nothing works)


Schema
user > post> owner> user
user > friend > user

make real images

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

1 - access to the event:
	
	This is simple 2 buttons "Public" or "Private": The chosen template is visible - the other not visible!
	
	Public is i.e. an exibition, a conference, a theater-show or a football match etc. etc. 
	When you set up an Event as PUBLIC it means that your Event will be published on the Events Board without any other restrictions 
	than what is given by admission fee - admission age and normal public restrictions. The Event will be shown to everyone and accessible to
        everyone - it will be an PUBLIC EVENT.

	Private is i.e. a wedding or a birthday-party, a company-picnic etc. etc. Private Event is not open to the public.You have the opportunity to restrict the scope of people
	invited, to family only - friends - family and close friends or all friends - in short - to the way we divided the friends earlier. Which means that we 
	need some radio-buttons or some check-buttons, to make the dividing. Private Events will NOT be published on the Events Board.

2 - title of the event:

	This is nothing more than a input control.

3 - describtion of the event:

	 nothing more than a text-area control

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

6 - admission to the event.

	Here we just set up some few inputs:
	text-input: Adult Price - text-input: Adult Age -  text-input: Senior Price - text-input: Senior Age - text-input: Children Price - text-input: Adult Age.

7 - photos of the event.

	This is just an ordinary img/file upload as you have done before, however we need to be able to set/pick a front img.( we might have 6 images uploaded to cover the event -
	but we need to be able to show the 'official' image, when only showing one. 
	And we want to limit the numbers of uploaded photos to 10. (to avoid people uploade unreasonable amounts). 

8 - category for the event.

	There may be innumerable different type of events, and to address that we need to categories them with sub-categories - we could make that multi-level, with sub-cat and 
	sub-sub-cat and so on, but I prefere 2 level - main and sub - something like this:

	mainCategory	subCategory
	
	sport
		Air-sport
		Atheletics
		Ball over net
		Ball outdoor
		Ball indoor
		Bike
		Combatsports
		Dancing
		Fishing
		Horse-sports
		etc. etc
	Theater
		DramaTheater
		Kids Theater
		Comedy Theater
		Opera
		Ballet
		Concerts
		etc.etc.
	Fairs
		Food fairs
		Fashion fairs
		Motor fairs
	Music
		...
		...
	Family
		..
		..
	Museums
		..
I trust you get the pointe. There could be dozens of mainCategories and hundreds of subCategories. I dont want you to write all these items(of course not) - but I want you to make a template 
with input-controls so we can make CRUD operations to mainCategories as well as subCategories and then save them in collection.
 
------------------------------------------------------------
So much for creating events - now for searching our Events -- We  will use 2 approaches -- 1. Search for the category(subcategory)   2. Search for the the place(address).

1.	the category. When searching for the category you get all the events in that category - and we set up a filter with a date/interval. Lets say you are a chess geek and want to 
	attend the next world champignon ship - you can search for this, find the location and then plan your holliday according to this. 

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

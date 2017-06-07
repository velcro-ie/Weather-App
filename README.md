# Weather-App
Weather app that connects to the weather Api and updates details accordingly. 

Weather forcast web page.

Error handling:
The web page uses the google map api to get the location that the user is looking for.
If the user enters a location that is not available on google maps an alert appears to notify the user.
This location is then used via the longitude and latitude to get the weather for this location. 
By doing this the need to address multiple locations is bypassed.  The map updates to the location entered by the user to inform them of the chosen location.
There is also error checking in place for when there is no rainfall.  In this case the json feed does not have a rain field.  
This is checked in the code and 0 is displayed is there is no rainfall. 

Beyond the basics:
The web page shows a graph of the temperatures and rain fall for a given day. 
The background image was drawn by me as well as the icons. The icons are based on the background and the icons supplied by the weather APi.

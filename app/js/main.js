
///////////////////////////////////////////////////////////////////
///////////////////// Google Maps Initialize ///////////////////////////
//////////////////////////////////////////////////////////////////////

var berlin = new google.maps.LatLng(52.520816, 13.410186);

var markers = [];

var map;

function initialize() {
  var mapOptions = {
    zoom: 12,
    center: berlin,
    disableDefaultUI: true,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    zindex: 2,
    transparency: 1
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);


//////////////////////////////////////////////////////////////
///////////////////// Navigation //////////////////////////
////////////////////////////////////////////////////////////////


// DOM Element Grab

var $footer = $('.footer-container');
var $circleAppender = $('.footerCircle-container')
//var $addGroupButton = $('#addGroup');
var $castMessageButton = $('#castMessageButton');
var $searchButton = $('#searchButton');
var $notificationsButton = $('#notificationsButton');
var $settingsButton = $('#settingsButton');


////////////////////////////////
// Navigation Event Listeners //
////////////////////////////////

$castMessageButton.on("click", function(){

    var castMessageOverlayHeight = $('.castMessageOverlay').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '100%');
    var castMessageOverlay = $('.castMessageOverlay');
    castMessageOverlay.css('display', 'inline-block');
    $castMessageButton.css('z-index', '10');

});

$searchButton.on("click", function(){

    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '100%');
    var searchOverlay = $('.searchOverlay');
    searchOverlay.css('display', 'inline-block');
    $searchButton.css('z-index', '10');

});

$notificationsButton.on("click", function(){

    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '100%');
    var notificationsOverlay = $('.notificationsOverlay');
    notificationsOverlay.css('display', 'inline-block');
    $notificationsButton.css('z-index', '10');

});

$settingsButton.on("click", function(){

    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '100%');
    var settingsOverlay = $('.settingsOverlay');
    settingsOverlay.css('display', 'inline-block');
    $settingsButton.css('z-index', '10');

});


////////////////////////////////////////
////// Add/Remove Circle Functions ////////
/////////////////////////////////////////


var windowWidth = $( window ).width();
var circleContainerWidth = '75px';
var circleContainerHeight = '75px';

// Add Circle Function

function addCircle(){
    var existingDivs = [];
  _.forEach($footer.children(), function(c){
    existingDivs.push(c);
  });

  var $circleContainer = $('<div class="circleContainer"></div>')
    $circleContainer.css("display", "inline-block");
    $circleContainer.css("background-color", "white");
    $circleContainer.css("width", circleContainerWidth);
    $circleContainer.css("height", circleContainerHeight);
    $circleContainer.css("margin", "5px");
    $circleContainer.css("border", "4px solid black");
    $circleContainer.css("border-radius", "25%");
  $circleAppender.append($circleContainer);
}

//These click events and buttons to click will be unnecessary once the back end is configured.  The back end should
//read/write the followed circles (groups) tied to the specific user from the database.  This is then updated every so often.
//When a user clicks any of these circles, the map above will update to only show messages corersponding to that group(i.e. this is a quick filter function)

// Add Circle Click Event

var $addCircleButton = $('#addCircleButton');
$addCircleButton.on('click', function(){
  addCircle();
});

// Remove Circle Click Event

var $removeCircleButton = $('#removeCircleButton');

$removeCircleButton.on('click', function(){
  $circleAppender.on('click', '.circleContainer', function(){
    $(this).remove();
    $circleAppender.off('click');
  });

});




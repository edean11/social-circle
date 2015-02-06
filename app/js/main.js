
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
var $circleAppender = $('.footerCircle-container');
var $castMessageButton = $('#castMessageButton');
var $searchButton = $('#searchButton');
var $notificationsButton = $('#notificationsButton');
var $notificationsAppender = $('#notificationsAppender');
var $settingsButton = $('#settingsButton');


////////////////////////////////
// Navigation Event Listeners //
////////////////////////////////

$castMessageButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    var castMessageOverlay = $('.castMessageOverlay');
    castMessageOverlay.css('display', 'inline-block');
    $castMessageButton.css('z-index', '10');

    $('.submitCastInfo').click(function(){
      castMessageOverlay.css('display', 'none');
      editOverlaySelect.css('height', 0);
    });

});

$searchButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    var searchOverlay = $('.searchOverlay');
    searchOverlay.css('display', 'inline-block');
    $searchButton.css('z-index', '10');

    $('.submitSearchButton').click(function(){
      searchOverlay.css('display', 'none');
      editOverlaySelect.css('height', 0);
    });

});

$notificationsButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    var notificationsOverlay = $('.notificationsOverlay');
    notificationsOverlay.css('display', 'inline-block');
    $notificationsButton.css('z-index', '10');

    $('.notificationsClose').click(function(){
      notificationsOverlay.css('display', 'none');
      editOverlaySelect.css('height', 0);
    });

});

$settingsButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    var settingsOverlay = $('.settingsOverlay');
    settingsOverlay.css('display', 'inline-block');
    $settingsButton.css('z-index', '10');

    $('.saveSettingsButton').click(function(){
      settingsOverlay.css('display', 'none');
      editOverlaySelect.css('height', 0);
    });

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



//////////////////////////////////////////////////////////////
/////////////////// Overlay Functions //////////////////////////
//////////////////////////////////////////////////////////


///////// Add Notifications ///////////

function addNotification(){

  var $notificationContainer = $('<div class="notificationContainer"></div>')
    $notificationContainer.css("display", "inline-block");
    $notificationContainer.css("background-color", "black");
    $notificationContainer.css("width", "175px");
    $notificationContainer.css("height", "75px");
    $notificationContainer.css("margin", "5px");
    $notificationContainer.css("border", "4px solid white");
    $notificationContainer.css("border-radius", "10%");
  $notificationsAppender.append($notificationContainer);
}

var $addNotificationButton = $('#addNotificationButton');
var $removeNotificationButton = $('#removeNotificationButton');

$addNotificationButton.click(function(){
  addNotification();
});

$removeNotificationButton.on('click', function(){
  $notificationsAppender.on('click', '.notificationContainer', function(){
    $(this).remove();
    $notificationsAppender.off('click');
  });
});



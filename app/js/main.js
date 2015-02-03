
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
    zindex: 99,
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
//var $addGroupButton = $('#addGroup');
var $castMessageButton = $('#castMessage');
var $searchButton = $('#search');
var $notificationsButton = $('#notifications');
var $settingsButton = $('#settings');



////////////////////////////////
// Navigation Event Listeners //
////////////////////////////////

$castMessageButton.on("click", function(){

  var editOverlay = $('<div></div>');
    editOverlay.toggleClass('editOverlay');
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '440px');

  var setContainer = $('.set-container');

  setContainer.append(editOverlay);

})

$searchButton.on("click", function(){

  var editOverlay = $('<div></div>');
    editOverlay.toggleClass('editOverlay');
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '440px');

  var setContainer = $('.set-container');

  setContainer.append(editOverlay);

})

$notificationsButton.on("click", function(){

  var editOverlay = $('<div></div>');
    editOverlay.toggleClass('editOverlay');
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '440px');

  var setContainer = $('.set-container');

  setContainer.append(editOverlay);

})

$settingsButton.on("click", function(){

  var editOverlay = $('<div></div>');
    editOverlay.toggleClass('editOverlay');
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', '440px');

  var setContainer = $('.set-container');

  setContainer.append(editOverlay);

})


// Add Group Function

function addGroup(){
    var existingDivs = [];
  _.forEach($footer.children(), function(c){
    existingDivs.push(c);
  });

  var windowWidth = $( window ).width();
  var circleContainerWidth = windowWidth/6;
  var circleContainerHeight = circleContainerWidth;

  var $circleContainer = $('<div class="circleContainer"></div>')
    $circleContainer.css("display", "inline-block");
    $circleContainer.css("background-color", "white");
    $circleContainer.css("width", circleContainerWidth);
    $circleContainer.css("height", circleContainerHeight);
    $circleContainer.css("margin", "5px");
    $circleContainer.css("border", "4px solid black");
    $circleContainer.css("border-radius", "25%");
  $footer.append($circleContainer);
}



///////////////////////////////////////////////////////////////////
///////////////////// Google Maps ///////////////////////////
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
var $createCircleButton = $('#createCircleButton');
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
      $castMessageButton.css('z-index', '3');
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
      $searchButton.css('z-index', '3');
    });

});

$createCircleButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    var createCircleOverlay = $('.createCircleOverlay');
    createCircleOverlay.css('display', 'inline-block');
    $createCircleButton.css('z-index', '10');

    $('.clearButton').click(function(){
      createCircleOverlay.css('display', 'none');
      editOverlaySelect.css('height', 0);
      $createCircleButton.css('z-index', '3');
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
      $settingsButton.css('z-index', '3');
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

/////////////////////////////////////////////////////////
/////////////////// User Uploads ////////////////////////////
///////////////////////////////////////////////////////

///////// Get User Avatar //////////

///////// Create Circle Icon //////////

var circleIcon = document.getElementById('createCircleIcon');
var circleIconDisplayArea = document.getElementById('circleDisplayArea');


circleIcon.addEventListener('change', function(e) {
      var file = circleIcon.files[0];
      var imageType = /image.*/;

      if (file.type.match(imageType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
          circleIconDisplayArea.innerHTML = "";

          var img = new Image();
          img.src = reader.result;
          $(img).addClass('resizeableImage')

          var imageHeight = $(circleIconDisplayArea).height();
          var imageWidth = $(circleIconDisplayArea).width();

          circleIconDisplayArea.appendChild(img);
          
          $(function(){
            $('#circleDisplayArea').Jcrop({
              onChange: showPreview,
              onSelect: showPreview,
              aspectRatio: 1
            });
          });

          function showPreview(coords) {
            var rx = 100 / coords.w;
            var ry = 100 / coords.h;

            $('#preview').css({
              width: Math.round(rx * 500) + 'px',
              height: Math.round(ry * 370) + 'px',
              marginLeft: '-' + Math.round(rx * coords.x) + 'px',
              marginTop: '-' + Math.round(ry * coords.y) + 'px'
            });
          }
          //$(circleIconDisplayArea).css("background-image", img);

          // $('img.resizeableImage').imgAreaSelect({
          //     handles: true,
          //     aspectRatio: '1:1',
          //     instance: true,
          //     onSelectEnd: function(image, selection){ 
          //       var coordinates = [selection.x1, selection.y1, selection.x2, selection.y2];
          //       var dimensions = [selection.width, selection.height];

          //       $avatarContainer = $('.avatarContainer');

          //       $avatarContainer.css('background-image', img);
          //       $avatarContainer.css('background-position', coordinates[0]+' '+coordinates[1]);
          //       $avatarContainer.css('width', dimensions[0]);
          //       $avatarContainer.css('height', dimensions[1]);

          //       $(circleIconDisplayArea).toggleClass('hidden');
          //     }
          // });
          
          $(circleIcon).css('display', 'none');

          $(circleIconDisplayArea).css('border', '2px solid white');
        }

        reader.readAsDataURL(file); 
      } 

      else {
        circleIconDisplayArea.innerHTML = "File not supported!"
      }
});






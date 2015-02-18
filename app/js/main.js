
// DOM Element Grab

var $footer = $('.footer-container');
var $circleAppender = $('.footerCircle-container');
var $castMessageButton = $('#castMessageButton');
var $searchButton = $('#searchButton');
var $createCircleButton = $('#createCircleButton');
var $notificationsAppender = $('#notificationsAppender');
var $settingsButton = $('#settingsButton');

var mapContainerHeight = $('.map-container').height();
var editOverlaySelect = $('.editOverlay');

///////////////////////////////////////////////////////////////////
///////////////////// Google Maps ///////////////////////////
//////////////////////////////////////////////////////////////////////

var mapOptions = {
  zoom: 10,
  center: new google.maps.LatLng(-33.9, 151.2),
  disableDefaultUI: true,
  scrollwheel: true,
  navigationControl: false,
  mapTypeControl: false,
  scaleControl: true,
  draggable: true,
  zindex: 2,
  transparency: 1
}
var map = new google.maps.Map(document.getElementById('map-canvas'),
                              mapOptions);


//////////////////////////////////////////////////////////////////////
/////////////////// Cast Object Creation and Placement /////////////////
////////////////////////////////////////////////////////////////////

var iconCounter = 0;

function createCastInfo(){
  var $castTitle = $('#castTitle');
  var $castMessageText = $('#castMessageText');
  var $expirationDate = $('#datetimepicker');
  var $castAttachment = $('#castAttachment');
  var $castGroups = $('.castGroups');

  var castInfo =  {'title': $castTitle.val(), 'text': $castMessageText.val(),
                  'expiration': $expirationDate.val(), 'attachments': $castAttachment.files,
                  'groups': $castGroups.val()}

  return castInfo;
}

function setMarker(lat, longt) {

  var position = new google.maps.LatLng(lat, longt);
  var castInfo = createCastInfo();

  var marker = new RichMarker({
      position: position,
      map: map,
      draggable: true,
      content: createCircleTimer(iconCounter),
      title: castInfo.title,
      zIndex: iconCounter+1
  });

  marker.set('id', iconCounter+'icon');
  google.maps.event.addListener(marker, 'click', function(event){
    if($('.'+this.id).width()===40){
      $('.'+this.id).width('140px');
      console.log($('.'+this.id).width())
    } else {
      console.log($('.'+this.id).width())
      $('.'+this.id).width('40px');
    }
  });
  iconCounter++;
  //spinnerAnimation('100s', iconCounter);

}

function createCircleTimer(key) {
  // var spinner = '<div class="'+key+'spinner pie spinner"></div>',
  //     filler = '<div class="'+key+'filler pie filler"></div>',
  //     mask = '<div class="'+key+'mask mask"></div>';
  // var castContainer = '<div class="timerContainer '+key+'timer timer">'+spinner+filler+mask+'</div>';
  var castInfo = createCastInfo();
  var imgSrc = '';
  var iconPic = '<img class="iconPic '+key+'iconPic" src="#"></img>';
  var castContainer = '<div class="icon '+key+'icon"></div>';
  console.log(castContainer);

  return castContainer;
}

// function createCircleTimer(key, expiration) {
//   var tIndex = expiration.indexOf('T');
//   var expirationLength = expiration.length;
//   var formattedExpiration = expiration.substr(0,tIndex)+' '+expiration.substr(tIndex+1,expirationLength-1);
//   var $timeCircle = '<div class="'+key+'icon icon" data-date="'+formattedExpiration+'"></div>';
//   console.log($timeCircle);
//   $('.'+key+'icon').TimeCircles();
//   return $timeCircle;
// }

function spinnerAnimation(secondsleft, key){
  $('.'+key+'spinner').css('animation', 'ease '+secondsleft+' linear infinite');
  $('.'+key+'filler').css('animation', 'ease '+secondsleft+' steps(1, end) infinite');
  $('.'+key+'mask').css('animation', 'ease '+secondsleft+' steps(1, end) infinite');
  console.log($('.'+key+'spinner').css('animation'));
  console.log($('.'+key+'filler').css('animation'));
  console.log($('.'+key+'mask').css('animation'));
  console.log('.'+key+'spinner');
}


$('.submitCastInfo').click(function(){
  var castMessageOverlay = $('.castMessageOverlay');
  castMessageOverlay.css('display', 'none');
  editOverlaySelect.css('height', 0);
  $castMessageButton.css('z-index', '3');

  var overlay;

  if($('#castPositionChoose').is(':checked')) {
    google.maps.event.addListenerOnce(map, 'click', function(event) {
      var lat = (event.latLng).k
      var lng = (event.latLng).D
      setMarker(lat,lng);
    });
  } else {

  }
});

  // var image = {
  //   url: 'https://dl.dropboxusercontent.com/u/27160305/img/cast.png',
  //   // This marker is 20 pixels wide by 32 pixels tall.
  //   size: new google.maps.Size(157, 164),
  //   // The origin for this image is 0,0.
  //   origin: new google.maps.Point(0,0),
  //   // The anchor for this image is the base of the flagpole at 0,32.
  //   anchor: new google.maps.Point(78.5, 164)
  // };
  // console.log(image.url);

  // var shape = {
  //     coords: [1, 1, 1, 20, 18, 20, 18 , 1],
  //     type: 'poly'
  // };

//google.maps.event.addDomListener(window, 'load', initialize);


//////////////////////////////////////////////////////////////
///////////////////// Navigation //////////////////////////
////////////////////////////////////////////////////////////////


////////////////////////////////
// Navigation Event Listeners //
////////////////////////////////

$castMessageButton.on("click", function(){

    editOverlaySelect.css('height', mapContainerHeight);
    var castMessageOverlay = $('.castMessageOverlay');
    castMessageOverlay.css('display', 'inline-block');
    $castMessageButton.css('z-index', '10');

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
//When a user clicks any of these circles, the map above will update to only show messages corresponding to that group(i.e. this is a quick filter function)

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
var preview = document.getElementById('preview');


circleIcon.addEventListener('change', function(e) {
      var file = circleIcon.files[0];
      var imageType = /image.*/;

      if (file.type.match(imageType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
          circleIconDisplayArea.innerHTML = "";

          var img = new Image();
          img.src = reader.result;

          circleIconDisplayArea.appendChild(img);

          var imgPreview = new Image();
          imgPreview.src = reader.result;
          $('#preview').append(imgPreview);

          //Create variables (in this scope) to hold the API and image size
          var jcrop_api,
              boundx,
              boundy,

              // Grab some information about the preview pane
              $preview = $('.preview-container'),
              $pcnt = $('.preview-container #preview'),
              $pimg = $('.preview-container #preview img'),

              xsize = $pcnt.width(),
              ysize = $pcnt.height();
          
          console.log('init',[xsize,ysize]);
          $(circleIconDisplayArea).Jcrop({
            onChange: updatePreview,
            onSelect: updatePreview,
            aspectRatio: xsize / ysize
          },function(){
            // Use the API to get the real image size
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            // Store the API in the jcrop_api variable
            jcrop_api = this;

            // Move the preview into the jcrop container for css positioning
            $preview.appendTo(jcrop_api.ui.holder);
          });

          function updatePreview(c)
          {
            if (parseInt(c.w) > 0)
            {
              var rx = xsize / c.w;
              var ry = ysize / c.h;

              $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
              });
            }
          };
          
          $(circleIcon).css('display', 'none');
          $(circleIconDisplayArea).css('border', '2px solid white');
          $('.createCircleInputs').css('margin-top', '200px');
          $('.preview-container').css('display', 'block');
        }

        reader.readAsDataURL(file);
      } 

      else {
        circleIconDisplayArea.innerHTML = "File not supported!"
      }
});






////////////////////////
// Selector variables //
////////////////////////

var FIREBASE_URL = 'https://social-circle.firebaseio.com/',
    fb           = new Firebase(FIREBASE_URL);


////////////////////////////////
// Login/Logout Functionality //
////////////////////////////////

// On register button click, register and login the user
  $('.register').click(function(event){
    event.preventDefault();
    var $form = $($(this).closest('form')),
        email = $form.find('[type="text"]').val(),
        pass = $form.find('[type="password"]').val();
    fb.createUser({
        email: email,
        password: pass
      },
      function(err){
        if(!err){
              fb.authWithPassword({
                email: email,
                password: pass
              },
                function(err, auth){
                    location.reload(true);
              }
            );
        } else {}
      }
    );

  });

// On login button click, login the user
  $('.loginButton').click(function(event){
    event.preventDefault();

    var $form = $($(this).closest('form')),
        email = $form.find('[type="text"]').val(),
        pass = $form.find('[type="password"]').val();

    fb.authWithPassword({
      email    : email,
      password : pass
      }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        location.reload(true);
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  });

  //if logged in and has profile, go to app page
  //if logged in without a profile, go to the profile page

  fb.child('users').once('value', function(snap){
    function profile() {
         if(snap.val()[fb.getAuth().uid]){
            return true
         } else { return undefined }
    }
    if (fb.getAuth()&&profile()) {
      $('.login').toggleClass('hidden');
      $('.container').toggleClass('hidden');
    } else if (fb.getAuth()) {
      $('.login').toggleClass('hidden');
      $('.loggedIn').toggleClass('hidden');
    }
  });

  // Create User Profile Object

  function createProfileObject(){
    var $avatar = $('.avatarInput').val();
    var $userNameInput = $('.userNameInput').val();
    var $defaultCastLocation = $('input[name="userdefaultcastposition"]:checked').val();
    var $defaultChatBackgroundColor = $('.defaultChatBackgroundColor option:selected').val();
    var $defaultChatTextColor = $('.defaultChatTextColor option:selected').val();

    var profileObject = {avatar: $avatar, username: $userNameInput, defaultCastLocation: $defaultCastLocation,
                         defaultChatBackgroundColor: $defaultChatBackgroundColor, defaultChatTextColor: $defaultChatTextColor}
    return profileObject;
  }

  function saveProfileObject(profileObject){
    var uid = fb.getAuth().uid;
    var profileUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/profile');
    profileUrl.push(profileObject);
  }

  $('.saveProfile').click(function(){
    var profile = createProfileObject();
    saveProfileObject(profile);
  });


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
  center: new google.maps.LatLng(36.12469, -86.7259406),
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

//Create Info to Create Cast With
function createCastInfo(position){
  var $castTitle = $('#castTitle');
  var $castMessageText = $('#castMessageText');
  var $expirationDate = $('#datetimepicker');
  var $castAttachment = $('#castAttachment');
  var $castGroups = [];
  $('.groupSelect input:checked').each(function(){
    $castGroups.push($(this).attr('name'));
    console.log(this);
  });
  var $position = position;

  var castInfo =  {'title': $castTitle.val(), 'text': $castMessageText.val(),
                  'expiration': $expirationDate.val(), 'attachments': $castAttachment.val(),
                  'groups': $castGroups, 'position': $position}

  return castInfo;
}

function saveCastInfo(castInfo){
  var uid = fb.getAuth().uid;
  var castUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/data/casts');
  castUrl.push(castInfo);
}

//Set the cast onto the google maps object, add the width change listener to it
function setMarker(lat, longt) {

  var position = new google.maps.LatLng(lat, longt);
  var castInfo = createCastInfo(position);

  var marker = new RichMarker({
      position: position,
      map: map,
      draggable: true,
      content: createCircleIcon(iconCounter),
      title: castInfo.title,
      zIndex: iconCounter+1
  });

  marker.set('id', iconCounter);
  saveCastInfo(castInfo);
  google.maps.event.addListener(marker, 'click', function(event){
    iconWidthChange(this);
    refreshExpirationStyles();
  });
  iconCounter++;

}

//Cast Width Change Function
function iconWidthChange(that) {
  if($('.'+that.id+'icon').width()===40){
    $('.'+that.id+'icon').width('180px');
    $('.'+that.id+'icon').css('padding-left', '8px');
    $('.'+that.id+'iconTitle').css('display', 'block');
    $('.'+that.id+'iconText').css('display', 'inline-block');
    timeCirclesCreate(that);
  } else {
    $('.'+that.id+'icon').width('40px');
    $('.'+that.id+'icon').css('padding-left', '0px');
    $('.'+that.id+'iconTitle').css('display', 'none');
    $('.'+that.id+'iconText').css('display', 'none');
    var $timeCircleContainer = $('.timeCircle-container');
    $timeCircleContainer.empty();  
  }
}

//Create Time Circles Object to append to footer on click of cast
function timeCirclesCreate(thatother) {
  var $timeCircleContainer = $('.timeCircle-container');
  var $timeCircleTitle = $('<p class="'+thatother.id+'timeCircleTimerTitle timeCircleTimerTitle">'+thatother.title+'</p>');
  $timeCircleContainer.append($timeCircleTitle);
  var expiration = $('.'+thatother.id+'iconExpiration').text();
  var $timeCircle = $('<div class="timeCircle timeCircle'+thatother.id+'" data-date="'+expiration+'"></div>');
  $timeCircleContainer.append($timeCircle);
  $('.timeCircle'+thatother.id).TimeCircles();
}

//Create Cast DOM Elements for Appending
function createCircleIcon(key) {
  var castInfo = createCastInfo();
  var imgSrc = '';
  var iconPic = '<img class="iconPic '+key+'iconPic" src="#"></img>';
  var iconTitle = '<p class="iconTitle '+key+'iconTitle">'+castInfo.title+'</p>';
  var iconText = '<p class="iconText '+key+'iconText">'+castInfo.text+'</p>';
  var expiration = castInfo.expiration;
  var tIndex = expiration.indexOf('T');
  var expirationLength = expiration.length;
  var formattedExpiration = expiration.substr(0,tIndex)+' '+expiration.substr(tIndex+1,expirationLength-1);
  var iconExpiration = '<p class="iconExpiration '+key+'iconExpiration">'+formattedExpiration+'</p>'
  var castContainer = '<div class="icon '+key+'icon">'+iconTitle+iconText+iconExpiration+'</div>';
  return castContainer;
}

// Refresh Expiration Border Colors
function refreshExpirationStyles(){
  var $icons = $('.icon');
  for(i=0;i<$icons.length;i++){
    console.log($($icons[i]).children('.iconExpiration').text());
    var color = expirationColor($($icons[i]).children('.iconExpiration').text());
    $($icons[i]).css('border-color', color);
  }
}

// Finds the Proper Expiration Color Based On Timeleft
function expirationColor(expiration){
  var expirationFormatted = moment(expiration).format();
  var now = moment();
  var timeleft = moment(expirationFormatted).from(now);
  var timeScaleIndex = timeleft.lastIndexOf(' ');
  var timeScale = timeleft.slice(timeScaleIndex+1,timeleft.length);
  var color;

  if(timeScale === 'year' || timeScale === 'years') {
    color = 'purple';
  } else if(timeScale === 'month' || timeScale === 'months') {
    color = 'blue';
  } else if(timeScale === 'day' || timeScale === 'days') {
    color = 'green';
  } else if(timeScale === 'hour' || timeScale === 'hours') {
    color = 'yellow';
  } else if(timeScale === 'minute' || timeScale === 'minutes') {
    color = 'orange';
  } else if(timeScale === 'second' || timeScale === 'seconds') {
    color = 'red';
  }

  return color;
}

// Broadcast and Setup Cast - Set Click Event

function clearCastMessage(){
  var castMessageOverlay = $('.castMessageOverlay');
  castMessageOverlay.css('display', 'none');
  editOverlaySelect.css('border', 'none');
  editOverlaySelect.css('height', 0);
  $castMessageButton.css('z-index', '3');
}


// Submit Cast Info Click Event
$('.submitCastInfo').click(function(){
  var $castAddInfoContainer = $('.castAddInfoContainer');
  clearCastMessage();
  addCastInfoBox();

  var overlay;

  if($('#castPositionChoose').is(':checked')) {
    google.maps.event.addListenerOnce(map, 'click', function(event) {
      $castAddInfoContainer.empty();
      var lat = (event.latLng).k
      var lng = (event.latLng).D
      setMarker(lat,lng);
      refreshExpirationStyles();
    });
  } else if($('#castPositionCurrent').is(':checked')) {
    google.maps.event.addListenerOnce(map, 'click', function(event) {
      $castAddInfoContainer.empty();
      getLocation();
      refreshExpirationStyles();
    });
  }
});

// Add Cast Info Box
function addCastInfoBox(){
  var $castInfoBoxContainer = $('<div class="castInfoBoxContainer"></div>');
  var $castInfoBoxText = $('<p class="castInfoBoxText">Click on the Map Above to Place Your Cast Message</p>');
  $castInfoBoxContainer.append($castInfoBoxText);
  var $castAddInfoContainer = $('.castAddInfoContainer');
  $castAddInfoContainer.append($castInfoBoxContainer);
}

// Geolocation API call

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  setMarker(lat,lng);
  console.log(lat,lng);
  map.setCenter(new google.maps.LatLng(lat, lng));
}

//Reset Cast Info and Close Div
$('.resetCastInfo').click(function(){
  clearCastMessage();

});

//////////////////////////////////////////////////////////////
///////////////////// Navigation //////////////////////////
////////////////////////////////////////////////////////////////


////////////////////////////////
// Navigation Event Listeners //
////////////////////////////////

$castMessageButton.on("click", function(){

    editOverlaySelect.css('height', $('.map-container').height());
    editOverlaySelect.css('border', '2px solid black');
    var castMessageOverlay = $('.castMessageOverlay');
    castMessageOverlay.css('display', 'inline-block');
    $castMessageButton.css('z-index', '10');

});

$searchButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    editOverlaySelect.css('border', '2px solid black');
    var searchOverlay = $('.searchOverlay');
    searchOverlay.css('display', 'inline-block');
    $searchButton.css('z-index', '10');

    $('.submitSearchButton').click(function(){
      searchOverlay.css('display', 'none');
      editOverlaySelect.css('border', 'none');
      editOverlaySelect.css('height', 0);
      $searchButton.css('z-index', '3');
    });

});

$createCircleButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    editOverlaySelect.css('border', '2px solid black');
    var createCircleOverlay = $('.createCircleOverlay');
    createCircleOverlay.css('display', 'inline-block');
    $createCircleButton.css('z-index', '10');

    $('.clearButton').click(function(){
      createCircleOverlay.css('display', 'none');
      editOverlaySelect.css('height', 0);
      editOverlaySelect.css('border', 'none');
      $createCircleButton.css('z-index', '3');
    });

});

$settingsButton.on("click", function(){

    var mapContainerHeight = $('.map-container').height();
    var editOverlaySelect = $('.editOverlay');
    editOverlaySelect.css('height', mapContainerHeight);
    editOverlaySelect.css('border', '2px solid black');
    var settingsOverlay = $('.settingsOverlay');
    settingsOverlay.css('display', 'inline-block');
    $settingsButton.css('z-index', '10');

    $('.saveSettingsButton').click(function(){
      settingsOverlay.css('display', 'none');
      editOverlaySelect.css('height', 0);
      editOverlaySelect.css('border', 'none');
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

  var $circleContainer = $('<div class="circleContainer"></div>');
    $circleContainer.css("display", "inline-block");
    $circleContainer.css("background-color", "#4D4D4D");
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






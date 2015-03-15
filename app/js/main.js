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
      getAndSetMyCastMarkers();
      addCircles(addCircleIncrement, 'owned');
      addCircles(addCircleIncrement, 'subscribed');
    } else if (fb.getAuth()) {
      $('.login').toggleClass('hidden');
      $('.loggedIn').toggleClass('hidden');
    }
  });

/////////////////////////////////////////////////////////
///////////////////// Profile ///////////////////////////
////////////////////////////////////////////////////////

  // Create User Profile Object

  function createProfileObject(image){
    var $userNameInput = $('.userNameInput').val();
    var $defaultCastLocation = $('input[name="userdefaultcastposition"]:checked').val();
    var $defaultChatBackgroundColor = $('.defaultChatBackgroundColor option:selected').val();
    var $defaultChatTextColor = $('.defaultChatTextColor option:selected').val();

    var profileObject = {avatar: image, username: $userNameInput, defaultCastLocation: $defaultCastLocation,
                         defaultChatBackgroundColor: $defaultChatBackgroundColor, defaultChatTextColor: $defaultChatTextColor}
    return profileObject;
  }

  ///////// Get User Avatar //////////

  var $avatarInput = $('.avatarInput');
  var avatarImage = [];
  var profOpts = {
    // CSS Class to add to the drop element when a drag is active
    dragClass: "draggingAvatar",

    // A string to match MIME types, for instance
    accept: 'image/*',
    readAsMap: { },

    // How to read any files not specified by readAsMap
    readAsDefault: 'DataURL',
    on: {
      beforestart: function(e, file) {
          // return false if you want to skip this file
      },
      loadstart: function(e, file) { /* Native ProgressEvent */ },
      progress: function(e, file) { /* Native ProgressEvent */ },
      load: function(e, file) { /* Native ProgressEvent */ },
      error: function(e, file) { /* Native ProgressEvent */ },
      loadend: function(e, file) { 
        var type = '';
        var d = e.target.result;
        var imgURI = d.replace("data:;","data:"+type+";")
        saveProfileClick(imgURI)
        var avatarDisplay = document.getElementById('avatarDisplayArea')
        var img = new Image();
        img.src = imgURI;
        avatarDisplay.appendChild(img);
        $('.avatarInput').toggleClass('hidden');

        var imgPreview = new Image();
        imgPreview.src = imgURI;
        $('#avatarPreview').append(imgPreview);

        //Create variables (in this scope) to hold the API and image size
        var jcrop_api,
            boundx,
            boundy,

            // Grab some information about the preview pane
            $preview = $('.avatarPreview-container'),
            $pcnt = $('.avatarPreview-container #avatarPreview'),
            $pimg = $('.avatarPreview-container #avatarPreview img'),

            xsize = $pcnt.width(),
            ysize = $pcnt.height();

        $(avatarDisplay).Jcrop({
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
        function updatePreview(c) {
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

        var imgwidth = $('#avatarDisplayArea').width();
        $('.avatarResultContainer').width(imgwidth);
        $('.avatarPreview-container').css('display', 'block');
        $('.profileOptions').css('margin-top', '200px');
      },
      abort: function(e, file) { /* Native ProgressEvent */ },
      skip: function(e, file) {
        // Called when a file is skipped.  This happens when:
        //  1) A file doesn't match the accept option
        //  2) false is returned in the beforestart callback
      }
    }
  }
  $('#avatarInput').fileReaderJS(profOpts);

  function saveProfileObject(profileObject){
    var uid = fb.getAuth().uid;
    var profileUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/profile');
    profileUrl.push(profileObject);
  }

  function saveProfileClick(img){
    $('.saveProfile').click(function(){
      var avtImg = img;
      var avtMarginLeft = $('.avatarPreview-container #avatarPreview img').css('margin-left');
      var avtMarginTop = $('.avatarPreview-container #avatarPreview img').css('margin-top');
      var avtImgWidth = $('.avatarPreview-container #avatarPreview img').css('width');
      var avatar = {'url':avtImg,'width':avtImgWidth,'marginLeft':avtMarginLeft,'marginTop':avtMarginTop}
      var profile = createProfileObject(avatar);
      saveProfileObject(profile);
      $('.loggedIn').toggleClass('hidden');
      $('.container').toggleClass('hidden');
      getAndSetMyCastMarkers();
    });
  }

  function fbGetProfileAvatar(callback){
    var uid = fb.getAuth().uid;
    var profileUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/profile');
    profileUrl.once('value', function(res){
      var val = res.val();
      var keys = _.keys(val);
      var avatarUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/profile/'+keys[0]+'/avatar');
      avatarUrl.once('value',function(avt){
        var avatar = avt.val();
        callback(avatar);
      });
    });
  }


///////////////////////////////////////////////////////////////////
///////////////////// Google Maps ///////////////////////////
//////////////////////////////////////////////////////////////////////

// DOM Element Grab

var $footer = $('.footer-container');
var $circleAppender = $('.subscribeCircle-container');
var $castMessageButton = $('#castMessageButton');
var $searchButton = $('#searchButton');
var $createCircleButton = $('#createCircleButton');
var $notificationsAppender = $('#notificationsAppender');
var $settingsButton = $('#settingsButton');

var mapContainerHeight = $('.map-container').height();
var editOverlaySelect = $('.editOverlay');

// Map Options

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
function createCastInfo(position, userImg){
  var $castTitle = $('#castTitle');
  var $castMessageText = $('#castMessageText');
  var $expirationDate = $('#datetimepicker');
  var $castAttachment = $('#castAttachment');
  var $castGroups = [];
  $('.groupSelect input:checked').each(function(){
    $castGroups.push($(this).attr('name'));
  });
  var $position = position;

  var castInfo =  {'title': $castTitle.val(), 'text': $castMessageText.val(),
                  'expiration': $expirationDate.val(), 'attachments': $castAttachment.val(),
                  'groups': $castGroups, 'position': $position, 'image': userImg, 'id': '', 'messages': [], 'owner': fb.getAuth().uid};

  return castInfo;
}
function fbCreateCastInfo(cast){
  var castTitle = cast.title;
  var castMessageText = cast.text;
  var expirationDate = cast.expiration;
  var castAttachments = cast.attachments;
  var castGroups = cast.groups
  var position = cast.position;
  var castPic = cast.image;
  var castId = cast.id;
  var castMessages = cast.messages;

  var castInfo =  {'title': castTitle, 'text': castMessageText,
                  'expiration': expirationDate, 'attachments': castAttachments,
                  'groups': castGroups, 'position': position, 'image': castPic, 'id': castId, 'messages': castMessages, 'owner': cast.owner}

  return castInfo;
}

function saveCastInfo(castInfo){
  var uid = fb.getAuth().uid;
  var castUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/data/casts');
  var pushedCast = castUrl.push(castInfo);
  var id = getId(pushedCast);
  var idUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/data/casts/'+id+'/id');
  idUrl.set(id);
  return id;
}

function getId(pushReturnVal){
  var array = pushReturnVal.path.w;
  var idPos = array.length-1;
  return array[idPos];
}

function getAndSetMyCastMarkers(){
  var uid = fb.getAuth().uid;
  var myCastsUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/data/casts');
  myCastsUrl.once('value', function(res){
      var casts = res.val();
      _.forEach(casts, function(cast){
        var lat = cast.position.k;
        var lng = cast.position.D;
        var castObj = fbCreateCastInfo(cast);
        setMarker(lat,lng,false, castObj, cast.id);
      });
  })
}

//Set the cast onto the google maps object, add the width change listener events to it
function setMarker(lat, longt, drag, castInfoObj, id) {

  var position = new google.maps.LatLng(lat, longt);
  var castInfo = castInfoObj;

  var marker = new RichMarker({
      position: position,
      map: map,
      draggable: drag,
      content: createCircleIcon(id, castInfo),
      title: castInfo.title,
      zIndex: iconCounter+1,
      id: id
  });

  marker.set('id', id);
  google.maps.event.addListener(marker, 'click', function(event){
    iconWidthChange(this);
    turnOnMessageListener(id,castInfo.owner)
    refreshExpirationStyles();
    // fbGetAndAppendChat(castInfo.owner,id);
    // insert chat container change function here
  });
  iconCounter++;

}

//Cast Width Change Function
function iconWidthChange(that) {
  if($('.'+that.id+'icon').width()===40){
    $('.'+that.id+'icon').width('180px');
    $('.'+that.id+'iconTitle').css('display', 'block');
    $('.'+that.id+'iconText').css('display', 'inline-block');
    timeCirclesCreate(that);
    $('.chat-container').toggleClass('hidden');
    $('.subscribeCircle-container').toggleClass('hidden');
  } else {
    $('.'+that.id+'icon').width('40px');
    $('.'+that.id+'iconTitle').css('display', 'none');
    $('.'+that.id+'iconText').css('display', 'none');
    var $timeCircleContainer = $('.timeCircle-container');
    $timeCircleContainer.empty();
    $('.chat-container').attr('data-uid','');
    $('.chat-container').toggleClass('hidden');
    $('.subscribeCircle-container').toggleClass('hidden');
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
function createCircleIcon(key, castInfo) {
  var imgSrc = castInfo.image;
  var iconPic = '<div class="iconPic '+key+'iconPic"><img class="iconPicImage" src="'+imgSrc+'"></img></div>';
  var iconTitle = '<p class="iconTitle '+key+'iconTitle">'+castInfo.title+'</p>';
  var iconText = '<p class="iconText '+key+'iconText">'+castInfo.text+'</p>';
  var expiration = castInfo.expiration;
  var tIndex = expiration.indexOf('T');
  var expirationLength = expiration.length;
  var formattedExpiration = expiration.substr(0,tIndex)+' '+expiration.substr(tIndex+1,expirationLength-1);
  var iconExpiration = '<p class="iconExpiration '+key+'iconExpiration">'+formattedExpiration+'</p>'
  var castContainer = '<div class="icon '+key+'icon">'+iconPic+'<div class="iconInfoHolder">'+iconTitle+iconText+iconExpiration+'</div></div>';
  return castContainer;
}

// Refresh Expiration Border Colors
function refreshExpirationStyles(){
  var $icons = $('.icon');
  for(i=0;i<$icons.length;i++){
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

/////--------------------------------------//////////
// Broadcast and Setup Cast - Set Click Event ///////
/////------------Top Left Icon-------------//////////

function clearCastMessage(){
  var castMessageOverlay = $('.castMessageOverlay');
  castMessageOverlay.css('display', 'none');
  editOverlaySelect.css('border', 'none');
  editOverlaySelect.css('height', 0);
  $castMessageButton.css('z-index', '3');
}

function clearForm(container){
  $(container).find('input[type="text"]').val('');
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
      var lat = (event.latLng).k;
      var lng = (event.latLng).D;
      var position = new google.maps.LatLng(lat, lng);
      var uid = fb.getAuth().uid;
      var profileUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/profile/')
      profileUrl.once('value', function(profile){
        var profileVal = profile.val();
        var key = _.keys(profileVal)[0];
        var avatarUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/profile/'+key+'/avatar/')
          avatarUrl.once('value', function(avatar){
            var avatarVal = avatar.val().url;
            var castInfo = createCastInfo(position, avatarVal);
            var id = saveCastInfo(castInfo);
            setMarker(lat,lng, true, castInfo, id);
            refreshExpirationStyles();
          });
      });
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
  var $castInfoBoxButton = $('<button class="castInfoBoxButton">Set Position</button>');
    $castInfoBoxButton.click(function(){
      var $castAddInfoContainer = $('.castAddInfoContainer');
      $castAddInfoContainer.empty();
      map.setOptions({draggable: false});
    })
  $castInfoBoxContainer.append($castInfoBoxButton);
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
  var position = new google.maps.LatLng(lat, lng);
  var castInfo = createCastInfo(position);
  var id = saveCastInfo(castInfo);
  setMarker(lat,lng, false, castInfo, id);
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

    $('.cancelSearchButton').click(function(){
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

    $('.submitCreateCircleButton').click(function(){

    });

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

var addCircleIncrement = 0;

function addCircles(id,subscriptionType){

  fbGetCircles(subscriptionType,function(circleObj){
    var $circleContainer = $('<div class="'+id+'circleContainer"></div>');
    $circleContainer.css("display", "inline-block");
    $circleContainer.css("width", circleContainerWidth);
    $circleContainer.css("height", circleContainerHeight);
    $circleContainer.css("margin", "5px");
    $circleContainer.css("border", "4px solid black");
    $circleContainer.css("border-radius", "25%");
    var $circleImage = $('<img class="appendedCircleImage" src="'+circleObj.avatar.url+'"></img>');
    var $circleName = $('<p class="appendedCircleName">'+circleObj.name+'</p>');
    $circleContainer.append($circleImage);
    $circleContainer.append($circleName);
    $circleAppender.append($circleContainer);
  });
}


/////////////////////////////////////////////////////////
/////////////////// Create Circle ////////////////////////////
///////////////////////////////////////////////////////

  ///////// Get Circle Avatar //////////

  var $createCircleIconInput = $('.createCircleIcon');
  var circleAvatar = [];
  var circleAvatarOpts = {
    // CSS Class to add to the drop element when a drag is active
    dragClass: "draggingCircleAvatar",

    // A string to match MIME types, for instance
    accept: 'image/*',
    readAsMap: { },

    // How to read any files not specified by readAsMap
    readAsDefault: 'DataURL',
    on: {
      beforestart: function(e, file) {
          // return false if you want to skip this file
      },
      loadstart: function(e, file) { /* Native ProgressEvent */ },
      progress: function(e, file) { /* Native ProgressEvent */ },
      load: function(e, file) { /* Native ProgressEvent */ },
      error: function(e, file) { /* Native ProgressEvent */ },
      loadend: function(e, file) { 
        var type = '';
        var d = e.target.result;
        var imgURI = d.replace("data:;","data:"+type+";")
        saveCircleClick(imgURI);
        var circleIconDisplayArea = document.getElementById('circleDisplayArea');
        var img = new Image();
        img.src = imgURI;

        circleIconDisplayArea.appendChild(img);

        var imgPreview = new Image();
        imgPreview.src = imgURI;
        $('#preview').append(imgPreview);
        $('#createCircleIcon').toggleClass('hidden');

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

        $('.createCircleInputs').css('margin-top', '200px');
        $('.preview-container').css('display', 'block');
        },
        abort: function(e, file) { /* Native ProgressEvent */ },
        skip: function(e, file) {
          // Called when a file is skipped.  This happens when:
          //  1) A file doesn't match the accept option
          //  2) false is returned in the beforestart callback
      }
    }
  }
  $('#createCircleIcon').fileReaderJS(circleAvatarOpts);


// Create Circle Object

function createCircleObject(circleAvatarObj){
  var circleName = $('#createCircleName').val();
  var circleDescription = $('#createCircleDescription').val();
  var circleObj = {'avatar': circleAvatarObj, 'name': circleName, 'description': circleDescription, 'owner': fb.getAuth().uid}
  return circleObj;
}

function saveCircleObject(circleObject){
  var uid = fb.getAuth().uid;
  var myCircleUrl = new Firebase(FIREBASE_URL+'/users/'+uid+'/data/circles/owned');
  var allCircleUrl = new Firebase(FIREBASE_URL+'/circles/');
  myCircleUrl.push(circleObject);
  allCircleUrl.push(circleObject);
}

function saveCircleClick(img){
    $('.submitCreateCircleButton').click(function(){
      var avtImg = img;
      var avtMarginLeft = $('.preview-container #preview img').css('margin-left');
      var avtMarginTop = $('.preview-container #preview img').css('margin-top');
      var avtImgWidth = $('.preview-container #preview img').css('width');
      var avatar = {'url':avtImg,'width':avtImgWidth,'marginLeft':avtMarginLeft,'marginTop':avtMarginTop}
      var circle = createCircleObject(avatar);
      saveCircleObject(circle);
    });
  }

function fbGetCircles(subscriptionType, callback){
  var uid = fb.getAuth().uid;
  var fbCirclesURL = new Firebase(FIREBASE_URL+'/users/'+uid+'/data/circles/'+subscriptionType);
  fbCirclesURL.once('value', function(subscKey){
      var circles = subscKey.val();
        _.forEach(circles,function(circle){
          var id = (_.keys(circle))[0];
          var circleObj = {'avatar': circle.avatar, 'name': circle.name, 'description': circle.description, 'owner': circle.owner, 'id': id};
          callback(circleObj);
      });
  });
}

///////////////////////////////////////////////////////////
/////////////// Search and Filter Functions ////////////////
//////////////////////////////////////////////////////////

$('.submitSearchCirclesButton').click(function(){
  var searchValue = $('#searchCircleInput').val();
  searchCircles(function(val,key){
    checkAndAppendSearchCriteria(val,key,searchValue);
    saveSubscribedCircleClick();
  });
});

$('.submitSearchButton').click(function(){
  toggleSearchResults();
});

function toggleSearchResults(){
  $('.searchuser-container').toggleClass('hidden');
  $('.searchcircle-container').toggleClass('hidden');
  $('.searchresults-container').toggleClass('hidden');
}

function resetSearchResults(){
  var editOverlaySelect = $('.editOverlay');
  var searchOverlay = $('.searchOverlay');
  var $searchButton = $('#searchButton');
  //toggleSearchResults();
  searchOverlay.css('display', 'none');
  editOverlaySelect.css('border', 'none');
  editOverlaySelect.css('height', 0);
  $searchButton.css('z-index', '3');
  ('#searchCircleInput').val = '';
  ('#searchUserInput').val = '';
}

function searchCircles(callback){
  var url = new Firebase(FIREBASE_URL+'/circles/');
  url.once('value', function(circles){
    var circlesVal = _.keys(circles.val());
    _.forEach(circlesVal, function(key){
      var circleUrl = new Firebase(FIREBASE_URL+'/circles/'+key+'/');
      circleUrl.once('value',function(circle){
        var val = circle.val();
        callback(val,key)
      });
    });
  });
}

function checkAndAppendSearchCriteria(circle, key, searchText){
  var circleName = circle.name;
  var circleDescription = circle.description;
  var circleOwner = circle.owner;
  if (circleName.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
      circleDescription.toLowerCase().indexOf(searchText.toLowerCase()) >= 0||
      circleOwner.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
    appendSearchResults(circle, key);
  } else {}
}

function appendSearchResults(circle, key){
  var circleAvatar = $('<img class="searchResultsImg" src="'+circle.avatar.url+'"></img>');
  var circleName = $('<p class="searchResultsName">'+circle.name+'</p>');
  var circleDescription = $('<p class="searchResultsDescription">'+circle.description+'</p>');
  var circleOwner = $('<p class="searchResultsOwner">'+circle.owner+'</p>');
  var searchInfoContainer = $('<div class="searchResultsInfoContainer"></div>');
  var searchResultContainer = $('<div class="searchResultContainer" data-uid="'+key+'"></div>');
  var searchButtons = $('<div class="searchResultsButtonContainer" data-uid="'+key+'"><button class="'+key+'searchResultsFilter searchResultsFilter">Filter</button><button class="searchResultsSubscribe">Subscribe</button></div>');
  searchResultContainer.append(circleAvatar);
  searchInfoContainer.append(circleName);
  searchInfoContainer.append(circleDescription);
  searchInfoContainer.append(circleOwner);
  searchResultContainer.append(searchInfoContainer);
  searchResultContainer.append(searchButtons);
  $('.searchresults-container').append(searchResultContainer);
}

function saveSubscribedCircleClick(){
  if($('.searchResultsSubscribe').context.onclick === null){
    $('.searchResultsSubscribe').click(function(){
      var uuid = $(this).closest('.searchResultContainer').attr('data-uid');
      if($(this).context.disabled===false){
        searchCircles(function(val,key){
          if(uuid===key){
            var user = fb.getAuth().uid;
            var pushUrl = new Firebase(FIREBASE_URL+'/users/'+user+'/data/circles/subscribed/');
            val.uuid = key;
            pushUrl.push(val);
            resetSearchResults();
            addCircles(addCircleIncrement,'subscribed');
          }
        });
      }
    });
  }else{}
}

$('.cancelSearchButton').click(function(){
  clearForm('.searchOverlay');
  toggleSearchResults();
})


/////////////////////////////////////////////////////////
/////////////////// Chat Functions /////////////////////////
/////////////////////////////////////////////////////////

//// Create Chat Container ////

function appendChatContainerMessages(messages){
  var $chatContainerMessages = $('.chatContainerMessages');
  $chatContainerMessages.empty();
  var $mContainer = $('<div class="messageContainer"></div>');
  _.forEach(messages, function(message){
    var $message = $('<p class="chatContainerMessageOwner">'+message.author+'</p><p class="chatContainerMessage">'+message.message+'</p>');
    $mContainer.append($message);
    $chatContainerMessages.append($mContainer);
  });
}

function appendSingleMessage(message){
  var $chatContainerMessages = $('.chatContainerMessages');
  var $mContainer = $('<div class="messageContainer"></div>');
  var $message = $('<p class="chatContainerMessageOwner">'+message.author+'</p><p class="chatContainerMessage">'+message.message+'</p>');
  $mContainer.append($message);
  $chatContainerMessages.append($mContainer);
}

function appendChatContainerTitle(title,text){
  var $chatContainerTitle = $('.chatContainerTitle');
  var $chatContainerText = $('.chatContainerText');
  $chatContainerTitle.empty();
  $chatContainerText.empty();
  var $title = $('<p class="chatContainerTitleText">'+title+'</p>');
  var $text = $('<p class="chatContainerDescText">'+text+'</p>');
  $chatContainerTitle.append($title);
  $chatContainerText.append($text);
}

//// Get and Append Chat Messages

function fbGetAndAppendChat(owner,id){
  var url = new Firebase(FIREBASE_URL+'/users/'+owner+'/data/casts/'+id+'/');
  url.once('value',function(res){
    var val = res.val();
    $('.chat-container').attr('data-uid',id);
    appendChatContainerTitle(val.title,val.text);
    appendChatContainerMessages(val.messages);
  });
}

//// Save Chat Messages On Click////

$('.chatContainerReplyButton').click(function(){
  var user = fb.getAuth().uid;
  var uid = $(this).closest('.chat-container').attr('data-uid');
  var url = new Firebase(FIREBASE_URL+'/users/'+user+'/data/casts/'+uid+'/messages/');
  var message = $('.chatContainerReply').val();
  var messageObj = {'message': message,'author':fb.getAuth().uid}
  url.push(messageObj);
  $('.chatContainerReply').val('');
})

//Turn on Message Listener

function turnOnMessageListener(id,owner){
  var url = new Firebase(FIREBASE_URL+'/users/'+owner+'/data/casts/'+id+'/messages/');
  url.on('child_added',function(childSnap,prevChildName){
    var val = childSnap.val();
    $('.chat-container').attr('data-uid',id);
    appendSingleMessage(val);
  });
}

function appendOwnerTextMessage(id,owner){
  var url = new Firebase(FIREBASE_URL+'/users/'+owner+'/data/casts/'+id+'/');
  url.once('value',function(res){
    var val = res.val();
    var $chatContainerMessages = $('.chatContainerMessages');
    var $mContainer = $('<div class="messageContainer"></div>');
    var $message = $('<p class="chatContainerMessageOwner">'+val.owner+'</p><p class="chatContainerMessage">'+val.text+'</p>');
    $mContainer.append($message);
    $chatContainerMessages.append($mContainer);
  })
}









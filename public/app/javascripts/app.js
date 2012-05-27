var uid = 0
var accessToken = 0;
var user = new Object;

window.fbAsyncInit = function() {
	FB.init({
		appId : '364683150255491', // App ID
		channelUrl : '//localhost:5000/channel.html', // Channel File
		status : true, // check login status
		cookie : true, // enable cookies to allow the server to access the session
		xfbml : true  // parse XFBML
	});

	FB.getLoginStatus(function(response) {
		if(response.status === 'connected') {
			uid = response.authResponse.userID;
			accessToken = response.authResponse.accessToken;
			console.log('calling /me');
			FB.api('/me', function(response) {
				tmp = user;
				user = response;
				user.location = tmp.location;
				update_login_info();
			});
		} else if(response.status === 'not_authorized') {
			login_dialog();
		} else {
			login_dialog();
		}
	});
	// Additional initialization code here
};
// Load the SDK Asynchronously
( function(d) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if(d.getElementById(id)) {
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

$(document).ready(function() {
	var myOptions = {
		center : new google.maps.LatLng(51.507222, -0.1275),
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	$('body').prepend('<div id="map_canvas"></div>');
	$('#map_canvas').height($(window).height());
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	navigator.geolocation.getCurrentPosition(GetLocation);
});
var login_dialog = function() {
	var title = '<i class="icon-lock icon-white"></i> Login?';
	var content = 'Hi!, would you like to login with Facebook?';
	var login_dialog = $('<div></div>').html(content).dialog({
		autoOpen : false,
		title : title,
		draggable : false,
		resizable : false
	});

	login_dialog.dialog("option", "buttons", [{
		text : "No!",
		click : function() {
			$(this).dialog("close");
		}
	}, {
		text : "Yes!",
		click : function() {
			window.location = '/fb_authorize';
			$(this).dialog("close");
		}
	}]);
	login_dialog.dialog('open');
}
var update_login_info = function() {
	if(user.first_name) {
		$('#login').attr('href', '');
		$('#login').html('Hi ' + user.first_name + '!');
	}
	$.ajax('http://localhost:5000/user/save?user=' + JSON.stringify(user)).done(function(){
		alert('dude');
	});
}

function GetLocation(location, callback) {
    user.location = location;
    gmap = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    map.panTo(gmap);
    var marker = new google.maps.Marker({
        position: gmap, 
        map: map
    }); 
}
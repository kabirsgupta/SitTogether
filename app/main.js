// ************************************************************
// TODO
//
// - SOC help - http://web-app.usc.edu/ws/soc_archive/20081/ws/help/REST_Analysis.txt
//
// - Names:
// 		- Social Schedule
// 		- Trojan Schedule
// 		- Classmate Finder
// 		- Sit With Me/Us
// - Redo courses area
// - Tooltips for new people
// - Click on friend's name to see what classes they're taking
// - Fix typeahead
//   	- http://stackoverflow.com/questions/19525184/angularui-bootstraps-typeahead-cant-read-length-property-of-undefined
// 		- Typeahead on course input not working properly - Look into Bloodhound - http://twitter.github.io/typeahead.js/
// - Check for duplicates when trying to add a course
// - Facebook status='connected' case in facebook login
// - Share/Invite friends button
// - Chrome extension to automatically take info from web registration (?)
// - Google Analytics
// - Create google calendar out of your schedule which can be imported
// - Rate my Professors? - http://stackoverflow.com/questions/23971776/python-httplib2-access-ratemyprofessor-search-results
// - Caching for courses or some kind of web crawler to scrape SOC for info
// - Find out how to delete cookies on page load to get rid of FB.Init has already been called warning
// ************************************************************

// ************************************************************
// Modules
// ************************************************************

var app = angular.module('main', ['login', 'registration','ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
		.otherwise("/");

	$stateProvider
		.state('registration', {
			url: '/registration',
			templateUrl: 'app/components/registration/registrationView.html',
			controller: 'RegistrationController'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'app/components/login/loginView.html',
			controller: 'LoginController'
		});
}); // end app.config(function($stateProvider, $urlRouterProvider))

// ************************************************************
// Facebook/Parse Initialization
// ************************************************************

app.run(function($rootScope, UserService, $state) {
	// Initialize Parse
	Parse.initialize("VNNuGAW6vPJJII6NKGrEcijCNNVncdtqHWoghDEZ", "WbEpAWASXJuZXrDA8yr4TKt2i2jcPzJkl9hfFoih");

	$rootScope.sessionUser = UserService.current();

	// Initialize Facebook
	window.fbAsyncInit = function() {
  		Parse.FacebookUtils.init({
	    	appId: '780035898743647',
	    	channelUrl : 'other/channel.html',
	    	// status: true,
	    	cookie: true,
	    	xfbml: true
		});
	}; // end function window.fbAsyncInit

	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if(d.getElementById(id)) {
	    	return;
	 	}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js";
		fjs.parentNode.insertBefore(js, fjs);
  	} (document, 'script', 'facebook-jssdk'));

  	$rootScope.initializeUser = function() {
		// Initialize
		$rootScope.sessionUser = UserService.current();

  		$rootScope.sessionUser.getUserCourses()
  			.then(function() {
  				console.log('done getting user courses');
  				return $rootScope.sessionUser.getFriendsCourses();
  			})
  			.then(function() {
  				console.log('done getting friends courses');
  				return $rootScope.sessionUser.associateFriendsCourses();
  			})
  			.then(function() {
  				console.log('done with init, user:',$rootScope.sessionUser);
  				$rootScope.sessionUser.loggedIn = true;
  				$state.go('registration');
  			});
  	}; // end function $rootScope.initializeUser

	$rootScope.fbLogout = function() {
		// Log user out of Parse
		UserService.logOut();
		$rootScope.sessionUser = null;

		// Redirect and refresh
		$state.go('login');
	}; // end $rootScope.fbLogout

	if($rootScope.sessionUser !== null) {
		$rootScope.initializeUser();
	} else {
		$state.go('login');
	}
}); // end app.run(function($rootScope))
angular.module('login', ['facebook', 'user', 'toaster'])
.controller('LoginController', function($rootScope, $scope, UserService, toaster, FacebookService, $q) {
	//// Login ////
	$scope.fbLogin = function() {
		// If already logged in they shouldn't get here anyway lol
		if($rootScope.sessionUser === null) {
			// FIXME - Check if all this actually works :)
			// Log in the user
	  		Parse.FacebookUtils.logIn('user_friends', {
	  			success: function(user) {
		  			console.log('not here, user:',user);
		  			$rootScope.sessionUser = user;
		  			$rootScope.sessionUser.userCourses = [];
					$rootScope.sessionUser.numUserCourses = 0;
	  				// If they didn't exist get and update information
	  				if(!user.existed()) {
	  					// Get Facebook info
	  					FacebookService.getFacebookInfo()
	  						.then(function(info) {
	  							var deferred = $q.defer();
	  							$rootScope.sessionUser.setFacebookInfo(info);
	  							// Then get Facebook friends
	  							FacebookService.getFacebookFriends().then(function(friends) {
	  								UserService.facebookFriends = friends;
	  								deferred.resolve();
	  							});
	  							return deferred.promise;
	  						})
	  						.then(function() {
	  							// Initialize and display success message
			  					$rootScope.initializeUser();
		    		    		toaster.pop('success', "", "Hi " + $rootScope.userData.firstName + ", you have signed up and logged in through Facebook!");
	  						});
	  				} // end if user existed
	  				else {
	  					// Otherwise update friends and initialize
	  					FacebookService.getFacebookFriends().then(function(friends) {
	  						console.log('friends:',friends);
	  						UserService.facebookFriends = friends;
	  						$rootScope.initializeUser();
	  						toaster.pop('success', "", "Welcome back " + $rootScope.sessionUser.firstName + "!");
	  					});
	  				} // end else(user already existed)
	  			} // end Parse.FacebookUtils.logIn.success(user)
	  		}); // end Parse.FacebookUtils.logIn('user_friends')
	  	} // end if($rootScope.sessionUser === null)
	}; // end function $rootScope.fbLogin
}); // end app.controller('UserController', function($rootScope, $window, $location, toaster))
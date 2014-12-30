angular.module('facebook', [])
.factory('FacebookService', function($q) {
	return {
		getFacebookInfo: function() {
			var deferred = $q.defer();
			FB.api('/me', function(response) {
				deferred.resolve(response);
			});
			return deferred.promise;
		}, // end function getFacebookInfo

		getFacebookFriends: function() {
			var deferred = $q.defer();
			FB.api('/me/friends', function(response) {
				deferred.resolve(response.data);
			});
			return deferred.promise;
		}, // end function updateFacebookFriends
	};
}); // end app.factory('FacebookService', function($q))
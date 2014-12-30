angular.module('registrationService', [])
.factory('RegistrationApi', function($http) {
	return {
		getSchools: function() {
			return $http.get('assets/scripts/schools.php');
		}, // end function getSchools

		getCourses: function(code) {
			return $http({
				method: 'GET',
				url: 'assets/scripts/courses.php',
				params: {
					code: code
				}
			});
		} // end function getCourses(code)
	}; // end return
}); // end app.factory('RegistrationApi', function($http))
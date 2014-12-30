angular.module('registration', ['registrationService', 'ui.bootstrap', 'focusMe', 'course', 'user', 'toaster'])
.controller('RegistrationController', function($rootScope, $scope, RegistrationApi, Course, toaster) {
	//// Initialize ////
	$scope.resetInputs = function() {
		// Department
		$scope.departmentInput = undefined;
		$scope.departmentCode = undefined;
		$scope.chosenDepartment = undefined;
		// Course
		$scope.courses = undefined;
		$scope.courseInput = undefined;
		$scope.chosenCourse = undefined;
	}; // end function $scope.resetInputs

	$scope.schools = [];
	$scope.departments = [];
	$scope.resetInputs();

	//// Get schools - only needs to be done once ////
	RegistrationApi.getSchools().then(function(response) {
		$scope.schools = response.data.department;

		for(var i = 0; i < $scope.schools.length; i++) {
			if($scope.schools[i].department != 'undefined') {
				var deps = $scope.schools[i].department;
				if(deps instanceof Array) {
					$scope.departments.push.apply($scope.departments, deps);
				} else {
					$scope.departments.push(deps);
				}
			}
		}
	}); // end RegistrationApi.getSchools

	//// Populate inputs and lists ////
	$scope.chooseDepartment = function($item, $model, $label) {
		$scope.departmentCode = $item.code;

		var code = angular.lowercase($scope.departmentCode);
		RegistrationApi.getCourses(code).then(function(response) {
			$scope.chosenDepartment = $item;
			$scope.courses = response.data.OfferedCourses.course;
			$scope.courseInput = undefined;
			$scope.chosenCourse = undefined;
		});
	}; // end function $scope.setCourses($item, $model, $label)

	$scope.chooseCourse = function($item, $model, $label) {
		$scope.chosenCourse = $item;
	}; // end function $scope.chooseCourse($item, $model, $label)

	$scope.courseInputKeydown = function(event) {
		if(event.keyCode == 8 && $scope.chosenCourse === undefined && $scope.courseInput === undefined) {
			$scope.departmentInput = undefined;
			$scope.departmentCode = undefined;
			$scope.chosenDepartment = undefined;
		}
		else if(!(event.keyCode == 9 || event.keyCode == 13)) {
			$scope.chosenCourse = undefined;
		}
	}; // end function $scope.courseInputKeydown(event)

	//// Form submit ////
	$scope.addCourse = function() {
		// Display success message
		toaster.pop('success', "", "Adding course: " + $scope.departmentCode + '-' + $scope.courseInput);

		var newCourse = {
			userID: $rootScope.sessionUser.facebookID,
			userName: $rootScope.sessionUser.fullName,
			schoolCode: $scope.schoolCode,
			schoolName: $scope.schoolInput,
			departmentCode: $scope.departmentCode,
			departmentName: $scope.departmentInput,
			courseName: $scope.departmentCode + '-' + $scope.courseInput,
		};

		// Create entry in Parse
		Course.addCourse(newCourse).then(function(course) {
			console.log('Adding course:',course);
			// Add to userCourses
			course.friends = [];
			$rootScope.sessionUser.userCourses.push(course);
			$rootScope.sessionUser.numUserCourses++;
		});

		$scope.resetInputs();
	}; // end function $scope.addCourse

	// Whenever a userCourse is added, add Facebook friends to it
	$scope.$watchCollection('sessionUser.userCourses', function(userCourses, oldUserCourses) {
		if($rootScope.sessionUser.numUserCourses > 0 && (userCourses.length > oldUserCourses.length) && (oldUserCourses.length !== 0)) {
			console.log('userCourses:',userCourses,'oldUserCourses:',oldUserCourses);
			$rootScope.sessionUser.facebookFriends.forEach(function(friend, index, userFriends) {
				friend.courses.forEach(function(friendCourse, friendCourseIndex, friendCourses) {
					if(userCourses[$rootScope.sessionUser.numUserCourses - 1].courseName == friendCourse.courseName) {
						userCourses[$rootScope.sessionUser.numUserCourses - 1].friends.push(friend.name);
					}
				}); // end friend.friendCourses.forEach
			}); // end userFriends.forEach
		} // end if(numUserCourses > 0)
	}); // end $rootScope.$watchCollection('userCourses')

	$scope.deleteCourse = function(courseID, index) {
		Course.deleteCourse(courseID).then(function(deletedCourse) {
			toaster.pop('success', "", "Deleted course: " + deletedCourse.courseName);
		});
		$rootScope.sessionUser.userCourses.splice(index, 1);
		$rootScope.numUserCourses--;
	}; // end function $scope.deleteCourse(courseID, index)
}); // end app.controller('RegistrationController', function($rootScope, $scope, RegistrationApi, toaster))
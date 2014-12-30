angular.module('user', ['course'])
.factory('UserService', function($rootScope, Course, $q) {
	var User = Parse.User.extend({
		// Instance methods
		setFacebookInfo: function(info) {
			// FIXME - check if works
			this.firstName = firstName;
			this.lastName = lastName;
			this.fullName = fullName;
			this.facebookID = facebookID;
			console.log('setting info:',info.first_name,info.last_name,info.name,info.id);
		}, // end function setFacebookInfo(info)

		getUserCourses: function() {
			var deferred = $q.defer();
			Course.newGetCoursesByUser(this.facebookID).then(function(courses) {
				$rootScope.sessionUser.userCourses = courses;
				$rootScope.sessionUser.numUserCourses = courses.length;
				deferred.resolve();
			});
			return deferred.promise;
		}, // end function getUserCourses

		getFriendsCourses: function() {
			// console.log('getting friends courses');
			var deferred = $q.defer();
			$rootScope.sessionUser.facebookFriends.forEach(function(friend, index, array) {
				friend.courses = [];
				Course.newGetCoursesByUser(friend.facebookID).then(function(courses) {
					// console.log('friend courses:',courses);
					friend.courses = courses;
					if(index === (array.length - 1)) {
						// console.log('resolve in getFriendsCourses');
						deferred.resolve();
					}
				});
			}); // end $rootScope.sessionUser.facebookFriends.forEach
			return deferred.promise;
		}, // end function getFriendsCourses

		associateFriendsCourses: function() {
			var deferred = $q.defer();
			// console.log('starting association,:',$rootScope.sessionUser);
			// console.log('friends:',$rootScope.sessionUser.facebookFriends);
			$rootScope.sessionUser.userCourses.forEach(function(userCourse, userCourseIndex, userCourses) {
				userCourse.friends = [];
				$rootScope.sessionUser.facebookFriends.forEach(function(friend, friendIndex, friends) {
					// console.log('associating friend:',friend);
					friend.courses.forEach(function(friendCourse, friendCourseIndex, friendCourses) {
						// console.log('friendCourse:',friendCourse);
						if(friendCourse.courseName == userCourse.courseName) {
							userCourse.friends.push(friend.name);
							// console.log('pushing:',friend.name);
						}
					});
					if(friendIndex == (friends.length - 1)) {
						deferred.resolve();
					}
				});
			});
			return deferred.promise;
		} // end function associateFriendsCourses
	}); // end Parse.User.extend

	Object.defineProperty(User.prototype, "firstName", {
		get: function() {
			return this.get("firstName");
		},
		set: function(firstName) {
			this.set("firstName", firstName);
		}
	}); // end property User.firstName

	Object.defineProperty(User.prototype, "lastName", {
		get: function() {
			return this.get("lastName");
		},
		set: function(lastName) {
			this.set("lastName", lastName);
		}
	}); // end property User.lastName

	Object.defineProperty(User.prototype, "fullName", {
		get: function() {
			return this.get("fullName");
		},
		set: function(fullName) {
			this.set("fullName", fullName);
		}
	}); // end property User.fullName

	Object.defineProperty(User.prototype, "facebookID", {
		get: function() {
			return this.get("facebookID");
		},
		set: function(facebookID) {
			this.set("facebookID", facebookID);
		}
	}); // end property User.facebookID

	Object.defineProperty(User.prototype, "facebookFriends", {
		get: function() {
			return this.get("facebookFriends");
		},
		set: function(friends) {
			console.log('setting facebookFriends:',friends);
			friends.forEach(function(friend, index, array) {
				this.addUnique("facebookFriends", {
					name: friend.name,
					facebookID: friend.id
				});
			});
		}
	}); // end property User.facebookFriends

	return User;
}); // end app.factor
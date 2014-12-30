angular.module('course', [])
.factory('Course', function(toaster) {
	var Course = Parse.Object.extend("Course", {
		// Instance methods
	}, {
		// Class methods
		addCourse: function(course) {
			var newCourse = new Course();
			return newCourse.save({
				userID: course.userID,
				userName: course.userName,
				schoolCode: course.schoolCode,
				schoolName: course.schoolName,
				departmentCode: course.departmentCode,
				departmentName: course.departmentName,
				courseName: course.courseName
			}, {
				success: function(newCourse) {
					return newCourse;
				}
			}); // end newCourse.save
		}, // end function Course.addCourse(course)

		deleteCourse: function(courseID) {
			var query = new Parse.Query(Course);
			return query.get(courseID, {
				success: function(course) {
					return course.destroy({
						success: function(deletedCourse) {
							return deletedCourse;
						},
						error: function(course, error) {
							console.log('error destroying course:',error); // TODO - console.log
						}
					}); // end course.destroy
				}, // end function query.get(courseID).success
				error: function(course, error) {
					console.log('error getting course',error); // TODO - console.log
				}
			}); // end function query.get(courseID)
		}, // end function Course.deleteCourse(courseID)

		getCoursesByUser: function(userID) {
			var query = new Parse.Query(Course);
			query.equalTo("userID", userID);
			return query.collection();
		}, // end function getCoursesByUser(userID)

		newGetCoursesByUser: function(userID) {
			var query = new Parse.Query(Course);
			query.equalTo("userID", userID);
			return query.find();
		}, // end function Course.newGetCoursesByUser(userID)

		getCoursesByName: function(courseName) {
			var query = new Parse.Query(Course);
			query.equalTo("courseName", courseName);
			return query.find();
		} // end function Course.getCoursesByName(courseName)
	}); // end Parse.Object.extend('Course')

	Object.defineProperty(Course.prototype, "userID", {
		get: function() {
			return this.get("userID");
		},
		set: function(userID) {
			this.set("userID", userID);
		}
	}); // end Course.property userID

	Object.defineProperty(Course.prototype, "userName", {
		get: function() {
			return this.get("userName");
		},
		set: function(userName) {
			this.set("userName", userName);
		}
	}); // end Course.property userName

	Object.defineProperty(Course.prototype, "schoolCode", {
		get: function() {
			return this.get("schoolCode");
		},
		set: function(schoolCode) {
			this.set("schoolCode", schoolCode);
		}
	}); // end Course.property schoolCode

	Object.defineProperty(Course.prototype, "schoolName", {
		get: function() {
			return this.get("schoolName");
		},
		set: function(schoolName) {
			this.set("schoolName", schoolName);
		}
	}); // end Course.property schoolName

	Object.defineProperty(Course.prototype, "departmentCode", {
		get: function() {
			return this.get("departmentCode");
		},
		set: function(departmentCode) {
			this.set("departmentCode", departmentCode);
		}
	}); // end Course.property departmentCode

	Object.defineProperty(Course.prototype, "departmentName", {
		get: function() {
			return this.get("departmentName");
		},
		set: function(departmentName) {
			this.set("departmentName", departmentName);
		}
	}); // end Course.property departmentName

	Object.defineProperty(Course.prototype, "courseName", {
		get: function() {
			return this.get("courseName");
		},
		set: function(courseName) {
			this.set("courseName", courseName);
		}
	}); // end Course.property courseName

	return Course;
}); // end app.factory('Course', function(toaster))
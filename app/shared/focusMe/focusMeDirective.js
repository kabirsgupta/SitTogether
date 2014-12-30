angular.module('focusMe', [])
.directive('focusMe', function($timeout) {
	return {
    	scope: {
    		trigger: '@focusMe'
    	},

    	link: function(scope, element) {
	      	scope.$watch('trigger', function(value) {
	        	if(value.length != 0) {
	          		$timeout(function() {
	            		element[0].focus();
		          });
		        }
		    });
		} // end function link(scope, element)
	}; // end focusMe.return
}); // end app.directive('focusMe')
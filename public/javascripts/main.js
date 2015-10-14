angular.module('lingoApp', [])

angular.module('lingoApp')
	.controller('lingoController', ['$scope', '$http', function($scope, $http){
		$scope.greeting = "hello"
		$scope.translateWord = function(){
			$http.post('/api/translation', $scope.translate)
				.then(function(returnData){
					console.log(returnData)
				if (returnData.data.translatedText){
					$scope.translatedWord = returnData.data.translatedText
				}
				else {
					$scope.translatedWord = "Sorry there was an issue"
				}

				} )
				
		}




	}])
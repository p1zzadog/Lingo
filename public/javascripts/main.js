angular.module('lingoApp', [])

angular.module('lingoApp')
	.controller('lingoController', ['$scope', '$http', function($scope, $http){
		$scope.greeting = "hello"
		$scope.translateWord = function(){
			$http.post('/api/translation', $scope.translate)
				.then(function(returnData){
					console.log(returnData)
					$scope.translatedWord = returnData.data.translatedText
				})
		}




	}])
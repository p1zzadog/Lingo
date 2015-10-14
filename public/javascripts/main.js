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
angular.module('lingoApp')
	.controller('quizController', ['$scope', '$http', function($scope, $http){
		$scope.languageSelectForm = true
		$scope.languageSelect = function(){
		$http.post('/languageSelect', { languageSelection : $scope.languageSelection } )
			.then(function(returnData){
				console.log(returnData)
				$scope.words = returnData.data
				console.log(returnData.data)
			})
		}


		// $scope.words= wordBank
	}])
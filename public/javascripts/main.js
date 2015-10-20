angular.module('lingoApp', []);

angular.module('lingoApp').service('authService', ['$http', '$location', function($http){
	this.authCheck = function(cb){
		$http.get('/api/me')
			.then(function(returnData){
				cb(returnData.data);
			});
	};
}]);

angular.module('lingoApp').controller('indexController', ['$scope', '$http', 'authService', function($scope, $http, authService){
	authService.authCheck(function(user){
		console.log('user: ', user);
		$scope.user = user;
	});
}]);

angular.module('lingoApp').controller('lingoController', ['$scope', '$http', function($scope, $http){
	$scope.greeting = "hello";
	
	$scope.translateWord = function(){
		$http.post('/api/translation', $scope.translate)
			.then(function(returnData){
				console.log(returnData);
				if (returnData.data.translatedText){
					$scope.translatedWord = returnData.data.translatedText;
				}
				else {
					$scope.translatedWord = "Sorry there was an issue";
				};
			});				
		};

}]);

angular.module('lingoApp').controller('quizController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){

	// see the translated word bank
	$scope.enableCheatMode = function(){
		console.log("YOU CHEATER")
	$scope.cheatMode = true;
	$http.get('/quiz/cheatMode').then(function(returnData){
		$scope.quizBankEN = returnData.data
	});
	};

	// utility functions

	var getNextQuestion = function(){
		$http({
			method: 'get',
			url: '/quiz/get-next-question'
		}).then(function(nextQuestion){
			if(nextQuestion.data==='All Done!') $scope.quizShow = false
			$scope.question = nextQuestion.data;
		});
	}

	// var finishQuiz = function(){
	// 	$http({
	// 		method: 'get',
	// 		url: '/quiz/finish-quiz'
	// 	})
	// }

	// View related functions
	
	$scope.languageSelectForm = true
	$scope.languageSelect = function(){
		$http.post('/quiz/language-select', { languageSelection : $scope.languageSelection } )
			.then(function(returnData){
				returnData.data ? $scope.beginQuizShow = true : console.log('something went wrong!');
			});
		};

	$scope.beginQuiz = function(){
		$scope.beginQuizShow = !$scope.beginQuizShow;
		$scope.quizShow = true;
		getNextQuestion();
	};

	$scope.submitResponse = function(){
		console.log($scope.quizResponse)
		$http({
			method: 'post',
			url: '/quiz/check-response',
			data: {response : $scope.quizResponse},
		}).then(function(returnData){
			console.log(returnData.data)
			switch (returnData.data.status) {
				case 'correct':
					$scope.feedbackMessage = returnData.data.reason;
					$scope.disableSubmit = true;
					$timeout(function(){
						getNextQuestion();
						$scope.disableSubmit = false;						
						$scope.feedbackMessage = '';
					}, 2000);
					break;
				case 'provisional correct':
					$scope.feedbackMessage = returnData.data.reason;
					$scope.disableSubmit = true;
					$timeout(function(){
						getNextQuestion();
						$scope.disableSubmit = false;						
						$scope.feedbackMessage = '';
					}, 2000);
					break;
				default:
					$scope.feedbackMessage = returnData.data.reason;
			};
			
		});
		
		$scope.quizResponse = '';
	};



}]);
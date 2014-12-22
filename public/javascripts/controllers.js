var weddingAppControllers = angular.module('weddingAppControllers', ['ui.bootstrap']);

weddingAppControllers.controller('collapseCtrl', function($scope) {
  $scope.isCollapsed = true;
})

weddingAppControllers.controller('rsvpCtrl', ['$scope', '$http', 'weddingStorage', 
    function($scope, $http, weddingStorage) {
      $scope.rsvps = [];
      weddingStorage.get()
                    .success(function(data) {
                      $scope.rsvps = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addRsvp = function() {
        var newRsvp = {
          firstName: $scope.firstName.trim(),
          lastName: $scope.lastName.trim(),
          email: $scope.email,
          sleepPref: $scope.sleepPrefChoice
        };
        if(!newRsvp.firstName || !newRsvp.lastName) {
          return;
        }

        weddingStorage.post(newRsvp)
                      .success(function(data) {
                        $scope.firstName = '';
                        $scope.lastName = '';
                        $scope.email = '';
                        $scope.rsvps = data;
                      })
                      .error(function(data) {
                        $scope.error = 'Error: ' + data;
                        console.log('Error: ' + data);
                      });
      }      
    
    }])

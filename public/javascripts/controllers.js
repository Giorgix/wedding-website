var weddingAppControllers = angular.module('weddingAppControllers', ['ui.bootstrap', 'flash']);

weddingAppControllers.controller('collapseCtrl', function($scope) {
  $scope.isCollapsed = true;
})

weddingAppControllers.controller('rsvpCtrl', ['$scope', '$http', 'weddingStorage','flash', 
    function($scope, $http, weddingStorage, flash) {
      $scope.rsvps = [];
      $scope.message = '';
      $scope.sortField = 'lastName';
      $scope.reverse = false;
      weddingStorage.get()
                    .success(function(data) {
                      $scope.rsvps = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addRsvp = function() {
        if(!$scope.firstName || !$scope.lastName || !$scope.email) {
          flash('danger', 'Error: Please fill the fields');
          return;
        }
        var newRsvp = {
          firstName: $scope.firstName.trim(),
          lastName: $scope.lastName.trim(),
          email: $scope.email.trim(),
          assist: $scope.assistChoice,
          sleepPref: $scope.sleepPrefChoice
        };
        
        weddingStorage.post(newRsvp)
                      .success(function(data) {
                        $scope.firstName = '';
                        $scope.lastName = '';
                        $scope.email = '';
                        $scope.sleepPrefChoice = '';
                        $scope.rsvps = data;
                        flash('success', 'Confirmation sent!');
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });
      }      

      $scope.removeRsvp = function(itemId) {
        weddingStorage.delete(itemId)
                      .success(function(data) {
                        $scope.rsvps = data;
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });        
      }
    
    }])

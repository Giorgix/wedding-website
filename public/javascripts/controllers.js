var weddingAppControllers = angular.module('weddingAppControllers', ['ui.bootstrap', 'flash']);

weddingAppControllers.controller('collapseCtrl', function($scope) {
  $scope.isCollapsed = true;
})

weddingAppControllers.controller('rsvpCtrl', ['$scope', '$http', 'rsvpStorage','flash', 
    function($scope, $http, rsvpStorage, flash) {
      $scope.rsvps = [];
      $scope.message = '';
      $scope.sortField = 'lastName';
      $scope.reverse = false;
      rsvpStorage.get()
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
        
        rsvpStorage.post(newRsvp)
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
        rsvpStorage.delete(itemId)
                      .success(function(data) {
                        $scope.rsvps = data;
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });        
      }
    
    }])

weddingAppControllers.controller('adviceCtrl', ['$scope', '$http', 'adviceStorage','flash', 
    function($scope, $http, adviceStorage, flash) {
      $scope.adviceList = [];
      $scope.message = '';
      $scope.orderField = 'created.ISODate';
      adviceStorage.get()
                    .success(function(data) {
                      $scope.adviceList = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addAdvice = function() {
        if(!$scope.name || !$scope.content) {
          flash('danger', 'Error: Please fill the fields');
          return;
        }
        var newAdvice = {
          name: $scope.name.trim(),
          content: $scope.content.trim()
        };
        
        adviceStorage.post(newAdvice)
                      .success(function(data) {
                        $scope.name = '';
                        $scope.content = '';
                        $scope.adviceList = data;
                        flash('success', 'Advice sent!');
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });
      }      

      $scope.removeAdvice = function(itemId) {
        adviceStorage.delete(itemId)
                      .success(function(data) {
                        $scope.adviceList = data;
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });        
      }
    
    }])

weddingAppControllers.controller('musicCtrl', ['$scope', '$http', 'musicStorage','flash', 
    function($scope, $http, musicStorage, flash) {
      $scope.musicList = [];
      $scope.message = '';
      musicStorage.get()
                    .success(function(data) {
                      $scope.musicList = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addSong = function() {
        if(!$scope.name || !$scope.artist || !$scope.title) {
          flash('danger', 'Error: Please fill the fields');
          return;
        }
        var newSong = {
          name: $scope.name.trim(),
          artist: $scope.artist.trim(),
          title: $scope.title.trim(),
        };
        
        musicStorage.post(newSong)
                      .success(function(data) {
                        $scope.name = '';
                        $scope.artist = '';
                        $scope.title = '';
                        $scope.musicList = data;
                        flash('success', 'Song requested!');
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });
      }      

      $scope.removeSong = function(itemId) {
        musicStorage.delete(itemId)
                      .success(function(data) {
                        $scope.musicList = data;
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        console.log('Error: ' + data);
                      });        
      }
    
    }])

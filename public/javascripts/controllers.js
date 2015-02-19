var weddingAppControllers = angular.module('weddingAppControllers', ['ui.bootstrap']);

weddingAppControllers.controller('collapseCtrl', function($scope) {
  $scope.isCollapsed = true;
})

weddingAppControllers.controller('rsvpCtrl', ['$scope', '$http', 'rsvpStorage','flash', 
    function($scope, $http, rsvpStorage, flash) {
      $scope.rsvps = [];
      $scope.sortField = 'lastName';
      $scope.langu = '';
      $scope.reverse = false;
      rsvpStorage.get()
                    .success(function(data) {
                      $scope.rsvps = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addRsvp = function(form) {
        console.log($scope.assistChoice);
        if(!$scope.firstName || !$scope.lastName || !$scope.email || $scope.assistChoice === undefined){
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
                        if($scope.langu === 'en') {
                          flash.to('rsvp-msg').success =  "Confirmation sent! Thanks!";
                        } else {
                          flash.to('rsvp-msg').success =  'Confirmación mandada! Gracias!';
                        }

                        form.$setPristine();
                        form.$setUntouched();
                      })
                      .error(function(data) {
                        flash.to('rsvp-msg').error =  'Error: ' + data;
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
      $scope.limit = 3;
      $scope.langu = '';
      $scope.orderField = 'created.ISODate';
      adviceStorage.get()
                    .success(function(data) {
                      $scope.adviceList = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addAdvice = function(form) {
        if(!$scope.name || !$scope.content){
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
                        if($scope.langu === 'en') {
                          flash.to('advice-msg').success =  'Advice sent!';
                        } else {
                          flash.to('advice-msg').success =  'Consejo mandado!';
                        }
                        form.$setPristine();
                        form.$setUntouched();
                      })
                      .error(function(data) {
                        flash.to('advice-msg').error =  'Error: ' + data;
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
      $scope.limit = 3;
      $scope.langu = 'en';
      musicStorage.get()
                    .success(function(data) {
                      $scope.musicList = data;
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });


      $scope.addSong = function(form) {
        if(!$scope.name || !$scope.artist || !$scope.title){
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
                        if($scope.langu === 'en') {
                          flash.to('music-msg').success =  'Song requested!';
                        } else {
                          flash.to('music-msg').success =  'Canción pedida!';
                        }
                        form.$setPristine();
                        form.$setUntouched();
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        flash.to('music-msg').error =  'Error: ' + data;
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


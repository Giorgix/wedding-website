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

weddingAppControllers.controller('adviceCtrl', ['$scope', '$http', '$upload', '$timeout', 'adviceStorage','flash', 
    function($scope, $http, $upload, $timeout, adviceStorage, flash) {
      $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
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
     
      $scope.generateThumb = function(file) {
        if (file != null) {
          if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = function(e) {
                $timeout(function() {
                  file.dataUrl = e.target.result;
                });
              }
            });
          }
        }
      }
 
      $scope.addAdvice = function(form, files) {
        if(!$scope.name || !$scope.content){
          return;
        }

        if($scope.files && $scope.files.length) {
          $upload.upload({
            url: '/api/advice',
            file: $scope.files[0],
            fields: {
               name: $scope.name.trim(),
               content: $scope.content.trim(),
            }
          }).progress(function(evt) {
              $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total); 
          }).success(function(data) {
              $scope.name = '';
              $scope.content = '';
              $scope.adviceList = data;
              $scope.files = {};
              if($scope.langu === 'en') {
                flash.to('advice-msg').success =  'Advice sent!';
              } else {
                flash.to('advice-msg').success =  'Consejo mandado!';
              }
              form.$setPristine();
              form.$setUntouched();
            });

        } else {
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
      }
      
      $scope.saveEditedAdvice = function(advice) {
        adviceStorage.put(advice)
                     .success(function(data) {
                       $scope.adviceList = data;
                     })
                     .error(function(data) {
                       console.log('Error: ' + data);
                     })
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

function youtube_parser(url){
  if(url != undefined) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
      return match[7];
    } else {
      alert("Url incorrecta");
    }
  }
}

weddingAppControllers.controller('musicCtrl', ['$scope', '$http', 'musicStorage','flash', 
    function($scope, $http, musicStorage, flash) {
      var videoUrl = 'https://www.youtube.com/watch?v=IBo8QwfmYSM';
      $scope.videoID = youtube_parser(videoUrl);
      $scope.musicList = [];
      $scope.limit = 3;
      $scope.langu = 'en';
      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }
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
          videoID: youtube_parser($scope.videoUrl)
        };
        
        musicStorage.post(newSong)
                      .success(function(data) {
                        $scope.name = '';
                        $scope.artist = '';
                        $scope.title = '';
                        $scope.videoUrl = '';
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


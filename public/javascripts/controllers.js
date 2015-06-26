//TODO 
// Add action bar when rsvp items selected(send email, mark as paid, amount..)

var weddingAppControllers = angular.module('weddingAppControllers', ['ui.bootstrap', 'angularFileUpload']);

weddingAppControllers.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
weddingAppControllers.controller('collapseCtrl', function($scope) {
  $scope.isCollapsed = true;
})

weddingAppControllers.controller('rsvpCtrl', ['$scope', '$http', 'rsvpStorage', 'emailService', 'flash', 'ngDialog', 
    function($scope, $http, rsvpStorage, emailService, flash, ngDialog) {
      $scope.rsvps = [];
      $scope.guestMails = [];
      $scope.sortField = '';
      $scope.langu = '';
      $scope.reverse = false;
      $scope.emailDialog = function() {
        ngDialog.open({
          template: 'views/email.html',
          scope: $scope,
          className: 'ngdialog-theme-default ngdialog-theme-plain'
        });
      }
      rsvpStorage.get()
                    .success(function(data) {
                      $scope.rsvps = data.reverse();
                    
                    })
                    .error(function(data) {
                      $scope.error = 'Error: ' + data;
                      console.log('Error: ' + data);
                    });

      $scope.getTotalAssist = function() {
        var total = 0;
        for(var i = 0; i < $scope.rsvps.length; i++){
          if($scope.rsvps[i].assist == true) total += 1;
        }
        return total; 
      }
      
      $scope.getTotalNoAssist = function() {
        var total = 0;
        for(var i = 0; i < $scope.rsvps.length; i++){
          if($scope.rsvps[i].assist == false) total += 1;
        }
        return total; 
      }

    $scope.addRecipient = function(email) {
        console.log($scope.guestMails.indexOf(email));
        if($scope.guestMails.indexOf(email) === -1) {
          $scope.guestMails.push(email);
        }
        else {
        var index = $scope.guestMails.indexOf(email);
          $scope.guestMails.splice(index, 1);
        }
        console.log($scope.guestMails);
        
    }
    $scope.sendEmail = function(form) {
        console.log($scope.guestMails);
        var subject = form.emailSubject.$modelValue;
        var email = form.emailText.$modelValue;
        if(!subject || !email || !$scope.guestMails){
          return;
        }
        var newEmail = {
          guests: $scope.guestMails,
          subject: subject.trim(),
          text: email.trim()
        };
        
        emailService.post(newEmail)
                      .success(function(data) {
                        $scope.emailSubject = '';
                        $scope.emailText = '';
                        flash.to('email-msg').success =  'Email Sent!';
                        form.$setPristine();
                        form.$setUntouched();
                      })
                      .error(function(data) {
                        flash('danger', 'Error: ' + data);
                        flash.to('email-msg').error =  'Error: ' + data;
                        console.log('Error: ' + data);
                      });
      }   
      
      $scope.addRsvp = function(form) {
        console.log($scope.sleepPrefChoice);
        if(!$scope.firstName || !$scope.lastName || !$scope.email || $scope.assistChoice === undefined){
          return;
        }
        if($scope.sleepPrefChoice === undefined) {
          if($scope.langu === 'en') {
            flash.to('rsvp-msg').error =  "Are you not sleeping anywhere that night?";
          } else {
            flash.to('rsvp-msg').error =  "¿No duermes en ningun sitio esa noche?";
          }
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

weddingAppControllers.controller('albumCtrl', ['$scope', '$http', 'FileUploader', '$timeout', 'albumStorage','flash', 
    function($scope, $http, FileUploader, $timeout, albumStorage, flash) {
      $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
      $scope.albumList = [];
      var uploader = $scope.uploader = new FileUploader({
        url: '/api/album'
      });
      $scope.limit = 3;
      $scope.imgLimit = 5;
      $scope.langu = '';
      $scope.orderField = 'created.ISODate';
      albumStorage.get()
                    .success(function(data) {
                      $scope.albumList = data;
                    
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
 
      $scope.addAlbum = function(form) {
        if(!$scope.title){
          return;
        }
          uploader.onBeforeUploadItem = function(item) { 
            var fields = {
              title: $scope.title.trim()
            }
            item.formData.push(fields);
          }
          uploader.uploadAll();
          uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessIteddum', fileItem, response, status, headers);
          };
          uploader.onCompleteAll = function() {
            //console.log('all done!');
            if($scope.langu === 'en') {
                flash.to('album-msg').success =  'Pictures uploaded!';
              } else {
                flash.to('album-msg').success =  'Fotos subidas!';
              }
              albumStorage.get()
                .success(function(data) {
                  $scope.albumList = data;
                  })
                .error(function(data) {
                  $scope.error = 'Error: ' + data;
                  console.log('Error: ' + data);
                  });
 
            uploader.clearQueue();
          }
              form.$setPristine();
              form.$setUntouched();

      }
      
      $scope.saveEditedAdvice = function(advice) {
        adviceStorage.patch(advice)
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


weddingAppControllers.controller('adviceCtrl', ['$scope', '$http', 'FileUploader', '$timeout', 'adviceStorage','flash', 
    function($scope, $http, FileUploader, $timeout, adviceStorage, flash) {
      $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
      $scope.adviceList = [];
      $scope.limit = 3;
      $scope.langu = '';
      $scope.orderField = 'created.ISODate';
      var uploader = $scope.uploader = new FileUploader({
        url: '/api/advice',
        queueLimit: 1
      });

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
        console.log(uploader.getNotUploadedItems());
        if(uploader.getNotUploadedItems().length > 0) {
          console.log('with image');
        uploader.onBeforeUploadItem = function(item) { 
            var fields = {
              name: $scope.name.trim(),
              content: $scope.content.trim()
            }
            item.formData.push(fields);
          }
          uploader.uploadAll();
          uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessIteddum', fileItem, response, status, headers);
          };
          uploader.onCompleteAll = function() {
            //console.log('all done!');
            if($scope.langu === 'en') {
                flash.to('advice-msg').success =  'Advice sent!';
              } else {
                flash.to('advice-msg').success =  'Consejo mandado!';
              }
              adviceStorage.get()
                .success(function(data) {
                  $scope.adviceList = data;
                  })
                .error(function(data) {
                  $scope.error = 'Error: ' + data;
                  console.log('Error: ' + data);
                  });
 
            uploader.clearQueue();
          }

        } else {
          console.log('without image');
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
        adviceStorage.patch(advice)
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
      return 'URL Error';
    }
  }
}

weddingAppControllers.controller('musicCtrl', ['$scope', '$http', 'musicStorage','flash', 
    function($scope, $http, musicStorage, flash) {
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
        if(youtube_parser($scope.videoUrl) === 'URL Error') {
          flash.to('music-msg').error =  'URL not valid';
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

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var DB = null;
var DB_NAME = "ndma.db";


angular.module('NDMA', [
    'ionic',
    'ngCordova',
    'ngMaterial',
    'ngMap',
    'google.places',
    'app.controllers',
    "app.services",
    "app.database",
    "app.hsna_database",
    "app.states",
    "app.directives"
])

        .constant("SERVER_URL", "http://104.236.52.240/api/v1/")
        // .constant("SERVER_URL", "http://localhost:8000/v1/")

        .constant("DEBUG", false)

        .constant("GPS_OPTIONS", {
            maximumAge: 0,
            timeout: 1000 * 60 * 3, // 10 mins
            enableHighAccuracy: true
        })



        .run(["$ionicPlatform", "$cordovaSQLite", "DBService", "HSNADBService", function ($ionicPlatform, $cordovaSQLite, DBService, HSNADBService) {
                $ionicPlatform.ready(function () {
                    if (window.cordova && window.cordova.plugins.Keyboard) {
                        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                        // for form inputs)
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                        // Don't remove this line unless you know what you are doing. It stops the viewport
                        // from snapping when text inputs are focused. Ionic handles this internally for
                        // a much nicer keyboard experience.
                        cordova.plugins.Keyboard.disableScroll(true);
                    }
                    if (window.StatusBar) {
                        StatusBar.styleDefault();
                    }


                    if (window.cordova) {
                        DB = $cordovaSQLite.openDB({
                            name: DB_NAME,
                            location: 2
                        });
                    } else {
                        DB = window.openDatabase(DB_NAME, "1.0", "NDMA", -1);
                    }

                    DBService.initialize();
                    HSNADBService.initialize();

                });
            }])

        //Authentication related run block

        .run(["$state", "$rootScope", "AuthService", "UserService", "NotificationService",
            "$ionicPlatform",
            function ($state, $rootScope, AuthService, UserService, NotificationService,
                $ionicPlatform) {
                var authLogin = function(evt, toState) {
                    UserService.getLoggedInUsers()
                    .then(function(results){
                        if(results.rows.length <= 0 && toState.name !== 'registration'){
                            evt.preventDefault();
                            $state.go("login");
                        }
                    })
                    .catch(function(errror){
                        NotificationService.showError(error);
                    });
                };
                $rootScope.$on("$stateChangeStart", function (evt, toState, toParams, fromState, fromParams) {
                    /*if (!AuthService.isAuthenticated()) {
                        if (next.name !== "login") {
                            evt.preventDefault();
                            $state.go("login");
                        }
                    }*/
                    $ionicPlatform.ready(function () {
                        if(window.cordova){
                            authLogin(evt, toState);
                        } else{
                            authLogin(evt, toState);
                        }
                    });
                });
                $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
                    $ionicPlatform.ready(function () {
                        if (fromState.name === ''){
                            event.preventDefault();
                            UserService.getLoggedInUsers()
                            .then(function(results){
                                if(results.rows.length <= 0 && toState.name !== 'registration'){
                                    $state.go("login");
                                } else {
                                    $state.go('app.gis');
                                }
                            })
                            .catch(function(errror){
                                NotificationService.showError(error);
                            });
                        }
                    });
                });
            }
        ])

        .config(["$httpProvider", function ($httpProvider) {
            $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
            $httpProvider.defaults.xsrfCookieName = "csrftoken";
            $httpProvider.defaults.headers.common = {
                "Accept": "application/json, */*",
                'Access-Control-Allow-Origin': '*',
            };
        }])

        .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('default')
          .accentPalette('light-green');
          $mdThemingProvider.theme('default')
          .accentPalette('light-green', {
            'default': '800' // use shade 200 for default, and keep all other shades the same
          });
        })


        .config(["$urlRouterProvider", "$ionicConfigProvider",
            function ($urlRouterProvider, $ionicConfigProvider) {
                $ionicConfigProvider.views.maxCache(0);
                // if none of the above states are matched, use this as the fallback
                $urlRouterProvider.otherwise("/gis");
            }
        ]);


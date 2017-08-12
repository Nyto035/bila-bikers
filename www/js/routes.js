angular.module('starter.routes', [])
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $stateProvider

    .state('app', {
    url: '/app?id&refresh',
    cache: false,
    abstract: true,
    views: {
          "content": {
              templateUrl: 'templates/menu.html',
              controller: 'app.controllers.aBusinessController'
          }
      }
  })

  .state("login", {
      url: "/login",
      views: {
          "content": {
              templateUrl: "templates/login.html",
              controller: "providerPortal.auth.controllers.loginAuth"
          }
      }
  })

  .state("businesses", {
      cache: false,
      url: "/business",
      redirectTo: 'businesses.list',
      views: {
          "content": {
              templateUrl: "templates/businesses.html",
              controller: "app.controllers.businessController"
          }
      }
  })
  .state("businesses.list", {
      cache: false,
      url: '/list',
      views: {
        'menuContent@businesses': {
            templateUrl: 'templates/business_lists.html',
            controller: "app.controllers.businessController"
        }
      }
  })

  .state('app.dashboard', {
      cache: false,
      url: '/dashboard',
      views: {
        'menuContent@app': {
          templateUrl: 'templates/home.html',
          controller: 'app.controllers.aBusinessController'
        }
      }
  })

  .state('app.sales', {
      cache: false,
      url: '/sales?sales_id',
      views: {
          'menuContent': {
            templateUrl: 'templates/sales.html',
            controller: 'app.controllers.aBusinessController'
          }
      }
  })

  .state('app.sales.create', {
      cache: false,
      url: '/new',
      views: {
          'new_sale@app.sales': {
              templateUrl: 'templates/new_sale.html'
          }
      }
  })

  .state('app.contact', {
      url: '/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html'
        }
      }
    })
.state('app.signup', {
      url: '/signup',
      views: {
        'menuContent': {
          templateUrl: 'templates/signup.html',
          controller:'homeCtrl'
        }
      }
    })
  .state('app.pricing', {
    url: '/pricing',
    views: {
      'menuContent': {
        templateUrl: 'templates/pricing.html',
      
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
})

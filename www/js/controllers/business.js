(function (angular, _) { // eslint-disable-line func-names
    angular.module('app.controllers.business', [
        'app.services.businessInputs'
    ])
    .controller('app.controllers.businessController', businessController)
    .controller('app.controllers.aBusinessController', aBusinessController);

    businessController.$inject = [
        '$scope','app.services.businessInputs.form','sil.oauth2.authConfig', 
        'UserService', '$ionicPlatform', '$state',
    ];

    function businessController($scope, frmService, authConfig, UserService, $ionicPlatform, $state) {
        $scope.title = 'My Businesses';
        $scope.createFields = frmService.createBusiness();
        $scope.currencies = [
            { 'value': 'KES', 'label': 'KSHS' }
        ];
        // $scope.user = authConfig.getUser();
        $ionicPlatform.ready(function () {
            UserService.getLoggedInUsers().then(function (results) {
                if (results.rows.length > 0) {
                    $scope.user = results.rows.item(0);
                    $scope.user.businesses = JSON.parse($scope.user.businesses);
                }
            }, function (error) {
                NotificationService.showError(error);
            });
        });

        $scope.logOutUser = function() {
            UserService.logoutUser().then(function (results) {
                if (results.rows.length > 0) {
                    $state.go('login');
                }
            }, function (error) {
                NotificationService.showError(error);
            }); 
        };
    }

    aBusinessController.$inject = [
        '$scope', '$stateParams','$state' ,'UserService', '$ionicPlatform',
        'silDataStoreFactory', 'apiBackend', '$ionicModal', 'app.services.businessInputs.form',
        '$filter', '$ionicPopover', '$window'
    ];

    function aBusinessController($scope, $stateParams, $state, UserService, $ionicPlatform,
        silDataStoreFactory, callApi, $ionicModal, frmService, $filter, $ionicPopover, $window) {
        $scope.title = 'Home';
        $scope.loaded = true;
        $scope.dashboard = [
            { 'value': 0, 'type': 'Revenue'},
            { 'value': 0, 'type': 'Expenses'},
            { 'value': 0, 'type': 'Net Profit'},
        ];
        $scope.an_item = {};
        $scope.sale = {};
        $scope.a_payment = {};
        $scope.items = [];
        $scope.payments = [];
        $scope.totals = 0.00;
        $scope.pay_totals = 0.00;
        $scope.createFields = frmService.createSale();
        $scope.itemFields = frmService.addItem();
        $scope.setItemPrice = function itemPriceFxn() {
            var selected_item = _.findWhere(
                $scope.sales_items, { 'id': $scope.an_item.id});
            $scope.an_item.price = selected_item.selling_price;
            $scope.an_item.name = selected_item.name;
            $scope.an_item.tax_id = selected_item.taxid;
            $scope.an_item.tax_status = selected_item.taxstatus;
        };
        $scope.setTotal = function totalFxn() {
            if (!_.isUndefined($scope.an_item.qty) &&
                !_.isUndefined($scope.an_item.price)) {
                $scope.an_item.total = $scope.an_item.qty * $scope.an_item.price;
            }
        };
        $scope.salesTotals = function salesFxn(){
            $scope.totals = 0.00;
            _.each($scope.items, function(item) {
                $scope.totals += item.total;
            });
        };
        /* Add Item to a sale in the frontend*/
        $scope.addItem = function addFxn(){
            var anObj = {};
            anObj = $scope.an_item;
            anObj.discount = $scope.an_item.discount || null,
            anObj.tax_amount = null,
            anObj.tax_id = $scope.an_item.tax_id,
            anObj.tax_rate = null,
            anObj.tax_name = null,
            anObj.tax_status = $scope.an_item.tax_status,
            $scope.items.push(anObj);
            $scope.salesTotals();
            $scope.an_item = {};
        };/* Add a payment*/
        $scope.addPayment = function addPay() {
            var anObj = {};
            anObj = $scope.a_payment;
            anObj.account_name = $scope.prefillName('account', $scope.a_payment.account, $scope.accounts);
            $scope.payments.push(anObj);
            $scope.a_payment = {};
            $scope.paymentTotal();
            $scope.closePopover();
        };
        $scope.paymentTotal = function payTots() {
            $scope.pay_totals = 0.00;
            _.each($scope.payments, function(pay) {
                $scope.pay_totals += pay.amount;
            });
        };
        $scope.removePay = function rmPayFxn(obj){
            $scope.payments = _.without($scope.payments, obj);
            $scope.paymentTotal();
        };
        $scope.removeItem = function rmFxn(obj){
            $scope.items = _.without($scope.items, obj);
            $scope.salesTotals();
        };
        /* Get business taxes*/
        $scope.getTaxes = function taxesFxn(obj){
            callApi.postApi(obj)
            .then(function(response){
                $scope.taxes = response.data.data;
            })
            .catch(function(err) {
                console.log(err);
            });
        };
        $scope.getPaymentAccounts = function paymentFxn(obj){
            callApi.postApi(obj)
            .then(function(response){
                $scope.accounts = response.data.data;
            })
            .catch(function(err) {
                console.log(err);
            });
        };

        $scope.getSalesItems = function salesItemsFxn(obj){
            callApi.postApi(obj)
            .then(function(response){
                $scope.loaded = false;
                $scope.sales_items = response.data.data;
            })
            .catch(function(err) {
                $scope.loaded = false;
                console.log(err);
            });
        };
        $scope.getBusinessCustomers = function bizCustFxn(obj){
            callApi.postApi(obj)
            .then(function(response){
                $scope.customers = response.data.data.page_data;
            })
            .catch(function(err) {
                console.log(err);
            });
        };
        $scope.bizStats = function getBusinessStats(obj) {
            callApi.postApi(obj)
            .then(function(response){
                $scope.loaded = false;
                $scope.business_data = response.data.data;
                $scope.business_data.type = $scope.type;
            })
            .catch(function(err) {
                $scope.loaded = false;
                console.log(err);
                 if (err.status === -1 && $stateParams.refresh !== 1) {
                    $scope.loaded = true;
                    var paramObj = { refresh: 1 };
                    _.extendOwn($stateParams, paramObj);
                    $state.transitionTo($state.current, $stateParams, { notify: false} );
                    $window.location.reload(true);
                }
            });
        };

        $scope.businessesOperations = function optFxn(){
            var postObj = {};
            switch($state.current.name){
            case 'app.dashboard': // str = str.replace(/^"(.*)"$/, '$1');
                postObj = {
                    get_dash_stats: $scope.business.id,
                    token: $scope.user.token
                };
                $scope.type = 'dashboard';
                $scope.bizStats(postObj);
                break;
            case 'app.sales': // str = str.replace(/^"(.*)"$/, '$1');
                postObj = {
                    get_business_sales_list: $scope.business.id,
                    page: 0,
                    limit: 100,
                    token: $scope.user.token
                };
                var custObj = {
                    get_business_customers: $scope.business.id,
                    token: $scope.user.token
                };
                var itemsObj = {
                    get_sale_items: $scope.business.id,
                    token: $scope.user.token
                };
                var taxObj = {
                    get_business_taxes: $scope.business.id,
                    token: $scope.user.token
                };
                var payAcc = {
                    get_business_payment_accounts: $scope.business.id,
                    token: $scope.user.token
                };
                $scope.bizStats(postObj);
                $scope.getBusinessCustomers(custObj);
                $scope.getSalesItems(itemsObj);
                $scope.getTaxes(taxObj);
                $scope.getPaymentAccounts(payAcc);
                break;
            default:
                postObj = {
                    get_dash_stats: $scope.business.id,
                    token: $scope.user.token
                };
            }
        };

        $scope.getBusinessDetails = function bizGet() {
            UserService.getLoggedInUsers().then(function (results) {
                if (results.rows.length > 0) {
                    $scope.user = results.rows.item(0);
                    $scope.user.businesses = JSON.parse($scope.user.businesses);
                    $scope.business = _.findWhere($scope.user.businesses, { 'id': $stateParams.id});
                    $scope.businessesOperations();
                }
            }, function (error) {
                NotificationService.showError(error);
            });            
        };
        $scope.prefillName = function(key, value, src) {
            var obj = _.findWhere(src, {'id': value});
            return obj[key];
        };
        $scope.getDate = function() {
            var curr_date = new Date();
            curr_date = $filter('date')(curr_date, 'dd/MM/yyyy');
            return curr_date;
        }
        /* Save the whole sale on form submission*/
        $scope.saveSale = function saveFxn() {
            var saleObj = {
                business_sale: $stateParams.id,
                client_id: $scope.sale.client_id,
                client_name: $scope.prefillName('name', $scope.sale.client_id, $scope.customers),
                transaction_date: $scope.getDate(),
                items: $scope.items,
                branch_id: null,
                payments: $scope.payments,
                token: $scope.user.token,
                notes: null,
            };
            callApi.postApi(saleObj)
            .then(function(response){
                $scope.saved_sale = response.data.data;
                $scope.modal.hide();
                $scope.sale = {};
                $scope.items = [];
                $scope.payments = [];
                $scope.totals = 0.00;
                $scope.pay_totals = 0.00;
                $scope.getBusinessDetails();
            })
            .catch(function(err) {
                console.log(err);
            });
        };
        /* End of save fuxn*/
        $ionicPlatform.ready(function () {
            $scope.getBusinessDetails();
        });

        $scope.createModal = function() {
            $ionicModal.fromTemplateUrl('templates/new_sale.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });
        };
        $scope.createModal();
        $scope.openModal = function($event) {
            $scope.modal.show($event);
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        /* Ionic popover*/
        /* $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });*/

        // .fromTemplateUrl() method
        $scope.createPopover = function popFxn($event) {
            $ionicPopover.fromTemplateUrl('templates/add_payment.html', {scope: $scope})
            .then(function(popover) {
                $scope.popover = popover;
            });
        };
        $scope.createPopover();
        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
            $scope.modal.remove();
        });
        // Execute action on hidden popover
        $scope.$on('popover.hidden', function() {
            angular.noop;
        });
        $scope.$on('modal.hidden', function() {
            $scope.popover.hide();
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            angular.noop;
        });
        /* Logout user*/
        $scope.logOutUser = function() {
            UserService.logoutUser().then(function (results) {
                if (results.rows.length > 0) {
                    $state.go('login');
                }
            }, function (error) {
                NotificationService.showError(error);
            }); 
        };
    }
}(window.angular, window._));

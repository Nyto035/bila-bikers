angular.module('app.services.businessInputs', [])

.service('app.services.businessInputs.form', businessInputs);
    businessInputs.$inject = [];
    function businessInputs() {
        const self = this;

        self.createSale = function saleFrm() {
            return [
                {
                    'name': 'client_id',
                    'type': 'select',
                    'verbous_name': 'Customer',
                },
            ];
        };

        self.addItem = function itemFxn() {
            return [
                {
                    'name': 'id',
                    'type': 'select',
                    'verbous_name': 'Item',
                    'class': 'margin-b-10'
                },
                {
                    'name': 'price',
                    'type': 'number',
                    'verbous_name': 'Item Price',
                    'class': 'col-6 inline-block margin-b-10'
                },
                {
                    'name': 'qty',
                    'type': 'number',
                    'verbous_name': 'Quantity',
                    'class': 'col-6 inline-block margin-b-10'
                },
                {
                    'name': 'discount',
                    'type': 'number',
                    'verbous_name': 'Discount',
                    'class': 'col-6 inline-block margin-b-10'
                },
                {
                    'name': 'total',
                    'type': 'number',
                    'readonly': true,
                    'verbous_name': 'Total Price',
                    'class': 'col-6 inline-block margin-b-10'
                },
            ];
        }

        self.createBusiness = function createInputs() {
            return [
                {
                    'name': 'business_name',
                    'type': 'text',
                    'verbous_name': 'Business Name',
                },
                {
                    'name': 'agent_code',
                    'type': 'text',
                    'verbous_name': 'Agent Code',
                },
                {
                    'name': 'business_pin',
                    'type': 'number',
                    'verbous_name': 'Business Pin',
                },
                {
                    'name': 'currency',
                    'type': 'select',
                    'verbous_name': 'Business Currency',
                },
                {
                    'name': 'Phone Number',
                    'type': 'text',
                    'verbous_name': 'Phone Number',
                },
                {
                    'name': 'Email Address',
                    'type': 'email',
                    'verbous_name': 'Email Address',
                },
                {
                    'name': 'Postal Address',
                    'type': 'text',
                    'verbous_name': 'Postal Address',
                },
                {
                    'name': 'Pysical Address',
                    'type': 'text',
                    'verbous_name': 'Physical Address',
                },
            ];
        };
    };

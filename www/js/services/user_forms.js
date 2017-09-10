angular.module('app.services.userInputs', [])

.service('app.services.userInputs.forms', userInputs);
    userInputs.$inject = [];
    function userInputs() {
        const self = this;

        self.createUser = function createInputs() {
            return [
                {
                    'name': 'first_name',
                    'type': 'text',
                    'verbous_name': 'First Name',
                },
                {
                    'name': 'last_name',
                    'type': 'text',
                    'verbous_name': 'Last Name',
                },
                {
                    'name': 'phone_number',
                    'type': 'text',
                    'verbous_name': 'Phone Number',
                },
                {
                    'name': 'email',
                    'type': 'email',
                    'verbous_name': 'Email Address',
                },
                {
                    'name': 'user_type',
                    'type': 'select',
                    'verbous_name': 'Select type of user',
                },
                {
                    'name': 'password',
                    'type': 'password',
                    'verbous_name': 'Password',
                },
                {
                    'name': 'confirm_password',
                    'type': 'password',
                    'verbous_name': 'Confirm Password',
                },
            ];
        };
    };

(function (angular) {
    angular.module("app.services.users", [])
            .service("UserService", ["$cordovaSQLite",
                function ($cordovaSQLite) {
                    this.getByEmail = function (email) {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM users WHERE email = ?", [email]);
                    };

                    this.getLoggedInUsers = function () {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM users WHERE logged_in = 1");
                    };

                    this.logoutUser = function () {
                        return $cordovaSQLite.execute(DB, "UPDATE users SET logged_in = 0 WHERE logged_in = 1");
                    };

                    this.createUser = function (user) {
                        var query = "INSERT INTO users (id, email, password, county, token, logged_in) VALUES(?, ?, ?, ?, ?, ?)";
                        return $cordovaSQLite.execute(DB, query, [user.UserId, user.LoweredEmail, user.Password, user.County, user.Token, 1])
                    };

                    this.registerUser = function (user) {
                        var query = "INSERT INTO users (first_name, last_name, phone_number, email, password, is_courier) VALUES(?, ?, ?, ?, ?, ?)";
                        return $cordovaSQLite.execute(DB, query, 
                            [user.first_name, user.last_name, user.phone_number, user.email, user.password, user.is_courier])
                    };

                    this.loginUser = function (user) {
                        var query = "UPDATE users set logged_in=? WHERE email = ?";
                        return $cordovaSQLite.execute(DB, query, [ 1, user.email])
                    };

                    this.updateUser = function (user) {
                        var query = "UPDATE users set email=?, password=?, county=?, token=?, logged_in=? WHERE id = ?";
                        return $cordovaSQLite.execute(DB, query, [user.LoweredEmail, user.Password, user.County, user.Token, 1, user.UserId])
                    };
                }]);
})(window.angular);



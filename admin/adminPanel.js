/**
 * Created by mayankbansal on 6/14/16.
 */

casanylaApp.currentPage = casanylaApp.pages.admin;

casanylaApp.angular.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/overview.html",
            controller: "overviewControl"
        })
        .when("/users", {
            templateUrl: "templates/users.html",
            controller: "usersControl"
        })
        .when("/projects", {
            templateUrl: "templates/projects.html",
            controller: "projectsControl"
        })
        .when("/designers", {
            templateUrl: "templates/designers.html",
            controller: "designersControl"
        })
        .when("/clients", {
            templateUrl: "templates/clients.html",
            controller: "clientsControl"
        })
        .when("/styles", {
            templateUrl: "templates/styles.html",
            controller: "stylesControl"
        })
        .when("/quiz", {
            templateUrl: "templates/quiz.html",
            controller: "quizControl"
        })
        .when("/help", {
            templateUrl: "templates/help.html",
            controller: "helpControl"
        })
        .when("/settings", {
            templateUrl: "templates/settings.html",
            controller: "quizControl"
        })
        .otherwise({
            templateUrl: "templates/overview.html",
            controller: "overviewControl"
        });
});

casanylaApp.angular.controller("overviewControl", function ($scope) {

});

casanylaApp.angular.controller("usersControl", function ($scope) {

});

casanylaApp.angular.controller("projectsControl", function ($scope) {

});

casanylaApp.angular.controller("designersControl", function ($scope) {

});

casanylaApp.angular.controller("clientsControl", function ($scope) {

});

casanylaApp.angular.controller("stylesControl", function ($scope) {

});

casanylaApp.angular.controller("quizControl", function ($scope) {

});

casanylaApp.angular.controller("helpControl", function ($scope) {

});

casanylaApp.angular.controller("settingsControl", function ($scope) {

});

casanylaApp.angular.controller("adminDashboardControl", function ($scope, $localStorage, $location, $filter, $sessionStorage, $rootScope, $interval) {

    $scope.endpoint = function (endpoint){
        $location.path(endpoint);
    };

    $scope.init = function () {

        if ($localStorage.ngMyUser) {
            $scope.ngMyUser = $localStorage.ngMyUser;
            showDashboard();
        } else {
            $scope.ngMyUser = false;
            hideDashboard();
        }

        $scope.users = [];
        $scope.projects = [];
        $scope.questionModel = [];
        $scope.styles = [];
        $scope.currentEditQuestion = null;
        $scope.currentEditOption = null;
        $scope.optionEdit = false;


        $scope.requests.showUsers(function (response) {
            $scope.users = response;
        });

        $scope.requests.getStyles(function (response) {
            $scope.styles = response;
        });

        $scope.requests.getQuiz(function (response) {
            $scope.questionModel = response;
        });

    };


    $scope.getClientCount = function(){
        return $filter('filter')($scope.users, { role: 'client' }).length;
    };

    $scope.editQuestion = function (question) {
        $scope.currentEditQuestion = question;
    };

    $scope.questionSave = function () {

        var myvar = JSON.parse(angular.toJson($scope.currentEditQuestion));
        $scope.requests.putQuiz(myvar, $scope.currentEditQuestion._id, function (response) {
        });
    };

    $scope.editOption = function (option) {
        $scope.optionEdit = true;
        $scope.currentEditOption = option;
    };

    $scope.optionSave = function () {
        //upload script here
    };

    $scope.logout = function () {
        $scope.$parent.logout();
        hideDashboard();
    };

    $scope.init();

});


function showDashboard() {

    $(".viewPanel").hide();
    $(".menuLeft")
        .find(".optionSelected").removeClass("optionSelected")
        .find(".viewOverview").parent().addClass("optionSelected");
    $("#viewOverview").fadeIn(500);

    setTimeout(function () {
        $('.contentOverlay').fadeIn(1000);
    }, 1000);
}

function hideDashboard() {
    setTimeout(function () {
        $('.contentOverlay').fadeOut(500);
    }, 1000);

    setTimeout(function () {
        $('.loginOverlay').fadeIn(500);
        showAlert("Successfully logged out.");
    }, 1500);
}

$(document).ready(function () {

    
    $(".menuOption").click(function () {
        var menuGroupSelected = $(this).parent().find('.menuGroupLabel').text();
        var menuOptionSelected = $(this).find('.menuOptionText').text();
        $('.menuGroupSelected').html(menuGroupSelected);
        $('.menuOptionSelected').html(menuOptionSelected);
        $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
        $(this).addClass("optionSelected");
    })

});

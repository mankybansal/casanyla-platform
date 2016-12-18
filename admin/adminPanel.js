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

casanylaApp.angular.controller("usersControl", function ($scope, $filter) {

    $scope.addUser = function () {
        $scope.showOptionOverlay();
        $scope.userControllerView = $scope.userControllerViews.addUser;
    };

    $scope.editUser = function (userID) {
        $scope.showOptionOverlay();
        $scope.userControllerView = $scope.userControllerViews.editUser;
        $scope.selectedUser = $filter('filter')($scope.$parent.users, {_id: userID})[0];
    };

    $scope.init = function () {
        $scope.userControllerViews = {
            addUser: 0,
            editUser: 1
        };

        $scope.selectedUser = null;
    };

    $scope.init();
});

casanylaApp.angular.controller("projectsControl", function ($scope) {

});

casanylaApp.angular.controller("designersControl", function ($scope) {
    $scope.addDesigner = function () {
        $scope.showOptionOverlay();
        $scope.designerControllerView = $scope.designerControllerViews.addDesigner;
    };

    $scope.editDesigner = function (userID) {
        $scope.showOptionOverlay();
        $scope.designerControllerView = $scope.designerControllerViews.editDesigner;
        $scope.selectedDesigner = $filter('filter')($scope.$parent.users, {_id: userID})[0];
    };

    $scope.assignProject = function () {
        $scope.showOptionOverlay();
        $scope.designerControllerView = $scope.designerControllerViews.assignProject;
    };

    $scope.init = function () {
        $scope.designerControllerViews = {
            addDesigner: 0,
            editDesigner: 1,
            assignProject: 2
        };

        $scope.selectedDesigner = null;
    };

    $scope.init();
});

casanylaApp.angular.controller("clientsControl", function ($scope) {

});

casanylaApp.angular.controller("stylesControl", function ($scope) {

    $scope.addStyle = function () {
        $scope.showOptionOverlay();
        $scope.stylesControllerView = $scope.stylesControllerViews.addStyle;
    };

    $scope.uploadImage = function () {
        var file_data = $('#file').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('folder',$scope.addStyleObject.name);
        $.ajax({
            url: '../scripts/styleImageUpload.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(php_script_response){
                console.log(php_script_response); // display response from the PHP script, if any
                var data = JSON.parse(php_script_response);

                if(data.fileName){
                    $scope.addStyleObject.images.push({
                        active: true,
                        file: data.fileName,
                        name: $("#fileDesc").val().trim(),
                        order: parseInt($("#fileOrder").val().trim())
                    });
                }
            }
        });
    };
    
    $scope.postStyle = function(){
        console.log($scope.addStyleObject);
        $scope.requests.addStyle($scope.addStyleObject,function(response){
            console.log(response);
        });
    };

    $scope.editStyle = function (styleID) {
        $scope.showOptionOverlay();
        $scope.styleControllerView = $scope.stylesControllerViews.editStyle;
        $scope.selectedStyle = $filter('filter')($scope.$parent.styles, {_id: styleID})[0];
    };

    $scope.init = function () {
        $scope.stylesControllerViews = {
            addStyles: 0
        };

        $scope.addStyleObject = {
            name: "",
            description: "",
            images: [],
            active: true
        };

        $scope.selectedStyle = null;
    };

    $scope.init();
});

casanylaApp.angular.controller("quizControl", function ($scope) {

});

casanylaApp.angular.controller("helpControl", function ($scope) {

});

casanylaApp.angular.controller("settingsControl", function ($scope) {

});

casanylaApp.angular.controller("adminDashboardControl", function ($scope, $localStorage, $location, $filter, $sessionStorage, $rootScope, $interval) {

    $scope.endpoint = function (endpoint) {
        $location.path(endpoint);
    };

    $scope.showOptionOverlay = function () {
        $scope.overlayOpen = true;
        $(".optionOverlay").fadeIn();
    };

    $scope.closeOptionOverlay = function () {
        $scope.overlayOpen = false;
        $(".optionOverlay").fadeOut();
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
        $scope.overlayOpen = false;


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


    $scope.getClientCount = function () {
        return $filter('filter')($scope.users, {role: 'client'}).length;
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

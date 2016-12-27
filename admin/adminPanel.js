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

    $scope.postUser = function () {
        //TODO CHANGE THIS TO ANGULAR MODEL
        $scope.requests.userRegisterForm($scope.addNewUser.name, $scope.addNewUser.email, $scope.addNewUser.password, $scope.addNewUser.role, function (response) {
            $scope.safeApply(function () {
                $scope.closeOptionOverlay();
                $scope.$parent.updateAdmin();
                $scope.init();
                showMessage("Added User","green");
            });
        });
    };

    $scope.deleteUser = function () {
        $scope.requests.deleteUser($scope.selectedUser._id, function () {
            $scope.safeApply(function () {
                $scope.closeOptionOverlay();
                $scope.$parent.updateAdmin();
                $scope.init();
                showMessage("Deleted User","red");
            });
        });
    };

    $scope.editUser = function (userID) {
        $scope.showOptionOverlay();
        $scope.userControllerView = $scope.userControllerViews.editUser;
        $scope.selectedUser = $filter('filter')($scope.$parent.users, {_id: userID})[0];
    };

    $scope.updateUser = function (userID){
        $scope.requests.updateUser(userID, JSON.parse(angular.toJson($scope.selectedUser)), function (response) {
            console.log(response);
            $scope.$parent.updateAdmin();
            $scope.init();
            $scope.closeOptionOverlay();
            showMessage("Successfully Updated","yellow");
        });
        $scope.closeOptionOverlay();
    };

    $scope.init = function () {
        $scope.userControllerViews = {
            addUser: 0,
            editUser: 1
        };

        $scope.addNewUser = {
            name: '',
            email: '',
            password: '',
            role: ''
        };

        $scope.selectedUser = null;
    };

    $scope.init();
});

casanylaApp.angular.controller("projectsControl", function ($scope) {
    
    $scope.addProject = function () {
        $scope.showOptionOverlay();
        $scope.projectsControllerView = $scope.projectsControllerViews.addProjects;
    };

    $scope.postProject = function () {
        console.log($scope.addProjectObject);
        $scope.requests.addProject($scope.addProjectObject, function (response) {
            console.log(response);
            $scope.$parent.updateAdmin();
            $scope.init();
            $scope.closeOptionOverlay();
            showMessage("Successfully Added","green");
        });
    };

    $scope.deleteProject = function (projectID) {
        $scope.requests.deleteProject(projectID, function (response) {
            console.log(response);
            $scope.$parent.updateAdmin();
            $scope.init();
            $scope.closeOptionOverlay();
            showMessage("Successfully Deleted","red");
        });
    };

    $scope.editSelectedProject = function (projectID) {
        $scope.showOptionOverlay();
        $scope.projectsControllerView = $scope.stylesControllerViews.editMyProject;
        $scope.selectedProject = $filter('filter')($scope.$parent.projects, {_id: projectID})[0];
    };

    $scope.updateProject = function (projectID) {

        console.log(angular.toJson($scope.selectedStyle));
        $scope.requests.updateProject(projectID, JSON.parse(angular.toJson($scope.selectedProject)), function (response) {
            console.log(response);
            $scope.$parent.updateAdmin();
            $scope.init();
            $scope.closeOptionOverlay();
            showMessage("Successfully Updated","yellow");
        });
        $scope.closeOptionOverlay();
    };

    $scope.init = function () {
        $scope.projectsControllerViews = {
            addProjects: 0,
            editMyProject: 1
        };

        $scope.projectsControllerView = null;

        $scope.addProjectObject = {
            name: "",
            owner: "",
            designer: "",
            estimate: "",
            createdBy: $scope.ngMyUser._id,
            milestones: [],
            address: ""
        };

        $scope.selectedProject = null;
    };

    $scope.init();
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

casanylaApp.angular.controller("stylesControl", function ($scope, $filter) {

    $scope.addStyle = function () {
        $scope.showOptionOverlay();
        $scope.stylesControllerView = $scope.stylesControllerViews.addStyles;
    };

    $scope.uploadImage = function () {
        if ($scope.addStyleObject.name == '' || $scope.addStyleObject.name == null) {
            showMessage("First Enter Style Name","red");
            return;
        }

        var file_data = $('#file').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('folder', $scope.addStyleObject.name);
        $.ajax({
            url: '../scripts/styleImageUpload.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (php_script_response) {
                console.log(php_script_response); // display response from the PHP script, if any
                var data = JSON.parse(php_script_response);

                //TODO: ADD MESSAGES IF THE UPLOAD FAILS
                //TODO: ADD VALIDATION
                //TODO: REMOVE IMAGE
                $scope.safeApply(function () {
                    if (data.fileName) {
                        $scope.addStyleObject.images.push({
                            active: true,
                            file: data.fileName,
                            name: $("#fileDesc").val().trim(),
                            order: parseInt($("#fileOrder").val().trim())
                        });
                    }
                });
            }
        });
    };

    $scope.uploadImage2 = function () {
        var file_data = $('#file2').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('folder', $scope.selectedStyle.name);
        $.ajax({
            url: '../scripts/styleImageUpload.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (php_script_response) {
                console.log(php_script_response); // display response from the PHP script, if any
                var data = JSON.parse(php_script_response);

                //TODO: ADD MESSAGES IF THE UPLOAD FAILS
                //TODO: ADD VALIDATION
                //TODO: REMOVE IMAGE
                $scope.safeApply(function () {
                    if (data.fileName) {
                        $scope.selectedStyle.images.push({
                            active: true,
                            file: data.fileName,
                            name: $("#fileDesc2").val().trim(),
                            order: parseInt($("#fileOrder2").val().trim())
                        });
                    }
                });
            }
        });
    };

    $scope.postStyle = function () {
        console.log($scope.addStyleObject);
        $scope.requests.addStyle($scope.addStyleObject, function (response) {
            console.log(response);
            $scope.$parent.updateAdmin();
            $scope.init();
            $scope.closeOptionOverlay();
            showMessage("Successfully Added","green");
        });
    };

    $scope.deleteImage = function (imageIndex) {
        $scope.selectedStyle.images.splice(imageIndex, 1);
        console.log($scope.selectedStyle.images);
    };

    $scope.deleteStyle = function (styleID) {
        $scope.requests.deleteStyle(styleID, function (response) {
            console.log(response);
            $scope.$parent.updateAdmin();
            $scope.init();
            $scope.closeOptionOverlay();
            //TODO: DELETE IMAGE FOLDER BEFORE DELETE
            showMessage("Successfully Deleted","red");
        });
    };

    $scope.editSelectedStyle = function (styleID) {
        $scope.showOptionOverlay();
        $scope.stylesControllerView = $scope.stylesControllerViews.editMyStyle;
        $scope.selectedStyle = $filter('filter')($scope.$parent.styles, {_id: styleID})[0];
    };

    $scope.updateStyle = function (styleID) {

        if ($scope.selectedStyle.images.length == 0) {
            $scope.selectedStyle.images = [];
        }

        console.log(angular.toJson($scope.selectedStyle));
        $scope.requests.updateStyle(styleID, JSON.parse(angular.toJson($scope.selectedStyle)), function (response) {
            console.log(response);
            $scope.$parent.updateAdmin();
            $scope.init();
            $scope.closeOptionOverlay();
            showMessage("Successfully Updated","yellow");
        });
        $scope.closeOptionOverlay();
    };

    $scope.init = function () {
        $scope.stylesControllerViews = {
            addStyles: 0,
            editMyStyle: 1
        };

        $scope.stylesControllerView = null;

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

casanylaApp.angular.controller("adminDashboardControl", function ($scope, $localStorage, $location, $filter) {

    $scope.endpoint = function (endpoint) {
        $location.path(endpoint);
    };

    $scope.showOptionOverlay = function () {
        $scope.overlayOpen = true;
        $(".optionOverlay").fadeIn();
    };

    $scope.showOptionOverlay2 = function () {
        $scope.overlayOpen2 = true;
        $(".optionOverlay2").fadeIn();
    };

    $scope.closeOptionOverlay = function () {
        $scope.overlayOpen = false;
        $(".optionOverlay").fadeOut();
    };

    $scope.closeOptionOverlay2 = function () {
        $scope.overlayOpen2 = false;
        $(".optionOverlay2").fadeOut();
    };

    $scope.updateAdmin = function () {
        $scope.requests.showUsers(function (response) {
            $scope.users = response;
        });

        $scope.requests.getStyles(function (response) {
            $scope.styles = response;
        });
        
        $scope.requests.getProjects(function (response) {
            $scope.projects = response;
        });

        $scope.requests.getQuiz(function (response) {
            $scope.questionModel = response;
        });
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
        $scope.overlayOpen2 = false;

        $scope.updateAdmin();

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
        showAlert("Successfully logged out.","green");
    }, 1500);
}

function showMessage(message, color) {

    switch (color) {
        case 'green':
            $('.messageOverlay').css("background", "green");
            break;
        case 'red':
            $('.messageOverlay').css("background", "salmon");
            break;
        case 'yellow':
            $('.messageOverlay').css("background", "#F8BB40");
            break;
        default:
            $('.messageOverlay').css("background", "#333");
    }
    $('.messageOverlay').fadeIn(500);
    $('.messageSpan').html(message);
    setTimeout(function () {
        $('.messageOverlay').fadeOut(500);
    }, 5000);
}

$(document).ready(function () {

    $(".menuOption").click(function () {
        var menuGroupSelected = $(this).parent().find('.menuGroupLabel').text();
        var menuOptionSelected = $(this).find('.menuOptionText').text();
        $('.menuGroupSelected').html(menuGroupSelected);
        $('.menuOptionSelected').html(menuOptionSelected);
        $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
        $(this).addClass("optionSelected");
    });

    $(".closeMessage").click(function(){
        $(".messageOverlay").fadeOut();
    });

});

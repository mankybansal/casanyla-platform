var homeluxeApp = angular.module('homeluxeApp', ['ngStorage', 'ngRoute']);

homeluxeApp.directive('homeluxeAppControl', function () {
    return {
        controller: function ($scope, $interval) {

            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };
            $scope.serverRequest = function (requestType, url, data, callback) {
                console.log($scope.apiBaseURL + url);
                $.ajax({
                    type: requestType,
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded",
                    xhrFields: {withCredentials: true},
                    url: $scope.apiBaseURL + url,
                    data: data,
                    timeout: 25000, // sets timeout
                    success: function (response) {
                        $scope.safeApply(function () {
                            console.log(response);
                            callback && callback(response);
                        });
                    },
                    error: function (response) {
                        $scope.safeApply(function () {
                            console.log("SERVER REQUEST ERROR");
                            console.log(response);
                            callback && callback(response);
                        });
                    }
                });
            };

            $scope.requests = {

                userLogin: function (username, password, callback) {
                    var myObject = {
                        "email": username,
                        "password": password
                    };
                    $scope.serverRequest("POST", "login", myObject, callback);
                },

                logout: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("POST", "logout", myObject, callback);
                },

                userRegisterForm: function (name, email, password, type, callback) {
                    var myObject = {
                        "name": name,
                        "email": email,
                        "password": password,
                        "role": type,
                    };
                    $scope.serverRequest("POST", "register", myObject, callback);
                },

                showUsers: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("GET", "user/list", myObject, callback);
                },

                getUser: function (userID, callback) {
                    var myObject = {};
                    $scope.serverRequest("GET", "user/" + userID, myObject, callback);
                },

                updateUser: function (userID, myName, myEmail, callback) {
                    var myObject = {
                        name: myName,
                        email: myEmail
                    };
                    $scope.serverRequest("PUT", "user/" + userID, myObject, callback);
                },

                getQuiz: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("GET", "question", myObject, callback);
                },

                putQuiz: function (quizModel, questionID, callback) {
                    console.log(quizModel);
                    $scope.serverRequest("PUT", "question/" + questionID, quizModel, callback)
                },

                submitQuiz: function (answerModel, callback) {
                    $scope.serverRequest("POST", "quiz", answerModel, callback);

                },

                getStyles: function (callback) {
                    var myObject = {}
                    $scope.serverRequest("GET", "style", myObject, callback);
                },

                /*
                 userRegisterFacebook: function (name, email, oAuth, profilePic, callback) {
                 $scope.$watch("guestToken", function (n, o) {
                 if (!n || !o) return;
                 var myObject = {
                 "token": $scope.guestToken,
                 "name": name,
                 "email": email,
                 "password": oAuth,
                 "oauth": oAuth,
                 "profile_pic": profilePic
                 };
                 $scope.serverRequest("member/register", myObject, callback);
                 }, true);
                 },




                 getLikes: function (userToken, callback) {
                 var myObject = {
                 "token": userToken
                 };
                 $scope.serverRequest("member/likes", myObject, callback);
                 },

                 likeNode: function (userToken, nodeID, callback) {
                 var myObject = {
                 "token": userToken,
                 "like_node": nodeID
                 };
                 $scope.serverRequest("member/like", myObject, callback);
                 }
                 */
            };

            $scope.init = function () {
                $scope.apiBaseURL = "http://manky.me/";
                $scope.baseURL = "http://casanyla.com/";
            };

            $scope.init();
        }
    };
});

homeluxeApp.directive('userControl', function () {
    return {
        controller: function ($scope, $localStorage, $sessionStorage, $interval) {
            $scope.hideLoginOverlay = function () {
                $('.loginOverlay').fadeOut(500);
            };

            $scope.isValid = function (value) {
                return (typeof value != 'undefined' && value != "");
            };

            $scope.login = function () {
                if ($scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password)) {
                    $scope.requests.userLogin($scope.guest.email, $scope.guest.password, function (response) {
                        if (response.name) {
                            $localStorage.ngMyUser = response;
                            $scope.ngMyUser = $localStorage.ngMyUser;
                            $scope.loginSuccess();
                        }
                        else showAlert('Wrong username or password.');
                    });
                }
                else
                    showAlert('Please enter a username & password.');
            };

            $scope.submitRegister = function () {
                if ($scope.isValid($scope.guest.name) && $scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password))
                    $scope.requests.userRegisterForm($scope.guest.name, $scope.guest.email, $scope.guest.password, function (response) {
                        if (response.name)
                            $scope.login();
                        else if (response.responseText == "User exists.")
                            showAlert('You already have an account.');
                        else showAlert('Please fill the form correctly.');
                    });
                else showAlert('Please fill the form correctly.');
            };

            $scope.showLogin = function () {
                $(".loginContainer").animate({"height": "520px"}, 500);
                $(".registerPanel").hide();
                setTimeout(function () {
                    $(".loginPanel").fadeIn(500);
                }, 200);
                var spacerHeight = $(".loginSpacer").height();
                $(".loginSpacer").animate({"height": spacerHeight + 35}, 500);
            };

            $scope.userRegister = function () {
                $(".loginContainer").animate({"height": "590px"}, 500);
                $(".loginPanel").hide();
                setTimeout(function () {
                    $(".registerPanel").fadeIn(500);
                }, 200);
                var spacerHeight = $(".loginSpacer").height();
                $(".loginSpacer").animate({"height": spacerHeight - 35}, 500);
            };

            /*
             $scope.facebookRegister = function () {
             $scope.requests.userRegisterFacebook($scope.facebook.name, $scope.facebook.email, $scope.facebook.id, $scope.facebook.dp, function (response) {
             console.log(response);
             $scope.facebook.connected = true;
             $scope.login($scope.facebook.email, $scope.facebook.id);
             });
             };

             $scope.facebookLogin = function () {
             FB.login(function (response) {
             console.log(response);
             if (response.authResponse) {
             showAlert("Please wait... &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");

             FB.api('/me/picture?type=normal', function (response) {
             $scope.facebook.dp = response.data.url;
             });

             FB.api('/me?fields=name,picture,email,id,link', function (response) {

             $scope.facebook.name = response.name;
             $scope.facebook.id = response.id;
             $scope.facebook.email = response.email;

             $scope.requests.userLogin(response.email, response.id, function (response) {
             if (response.status == "Success") {
             $scope.ngMyUser = response;
             $scope.facebook.connected = true;
             $scope.loginSuccess();
             }
             else $scope.facebookRegister();
             });
             console.log($scope.facebook);
             });
             }
             else showAlert('Facebook Login Failed.');
             }, {scope: 'email,public_profile'});
             };

             $scope.checkCookie = function () {
             if (!($scope.ngMyUser = Cookies.getJSON('myUser')))
             $scope.ngMyUser = false;
             };
             */

            $scope.init = function () {

                if ($localStorage.ngMyUser)
                    $scope.ngMyUser = $localStorage.ngMyUser;
                else
                    $scope.ngMyUser = false;

                //$scope.checkCookie();
                $scope.accountOptions = false;
                //$scope.facebook = {};
                $scope.guest = {};

                /*
                 $scope.cookieChecker = $interval(function () {
                 $scope.checkCookie();
                 }, 3000); */
            };

            $scope.accountOptionsTrigger = function () {
                if (!$scope.ngMyUser) loginButtonClick();
                else $scope.accountOptions = !$scope.accountOptions;
            };

            $scope.gotoAdminDashboard = function () {
                window.location = $scope.baseURL + "admin";
            };

            $scope.gotoDesignerDashboard = function () {
                window.location = $scope.baseURL + "designer";
            };

            $scope.gotoClientDashboard = function () {
                window.location = $scope.baseURL + "client";
            };

            $scope.logout = function () {
                $scope.requests.logout(function (response) {
                    if (response.responseText = "Successfully logged out") {
                        $localStorage.$reset();
                        $scope.init();
                    }
                });

            };

            $scope.loginSuccess = function () {
                // SET COOKIES
                //if ($scope.facebook.connected) $scope.ngMyUser.fbConnected = $scope.facebook.connected;
                $('.alertMessage').hide();
                $('.loginOverlay').hide();
                if (typeof dashboard != 'undefined' && dashboard) showDashboard();
            };

            $scope.init();
        }
    };
})
;


homeluxeApp.controller("quizAppControl", function ($scope, $rootScope) {

    $scope.startQuiz = function () {
        $scope.currentQuestion = 0;
        $scope.myAnswers = [];
        $scope.myProgress = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        $scope.requests.getQuiz(function (response) {
            $scope.questions = response;
            $scope.getNextQuestion();
        });
    };

    $scope.getNextQuestion = function () {
        $scope.myProgress += 100 / ($scope.questions.length + 1);
        if (!($scope.question = $scope.questions[$scope.currentQuestion])) {
            $scope.quizOver = true;
            $scope.requests.submitQuiz($scope.myAnswers.join(), function (response) {
                $rootScope.styles = response;
                $scope.$parent.viewStyle(0);
            });
        }
    };

    $scope.saveAnswer = function (myAnswer) {
        $scope.myAnswers.push(myAnswer);
        $scope.currentQuestion++;
        $scope.getNextQuestion();
    };
});


homeluxeApp.controller("browseStyleControl", function ($scope, $rootScope) {
    $scope.mySplit = function (string, nb) {
        var array = string.split('.');
        return array[nb];
    };

    console.log($scope.guestToken);

    $scope.getStyles = function () {
        $scope.requests.getStyles(function (response) {
            $rootScope.styles = response;

            $('.mainCard').fadeIn(1000).animate({marginTop: '0px'}, 500);

            if (urlStyle != null) {
                var styleNumber;
                for (var i = 0; i < $rootScope.styles.length; i++)
                    if ($rootScope.styles[i].catalogueKey == urlStyle)
                        styleNumber = i;
                $scope.viewStyle(styleNumber);
            }
        });
    };

    $scope.getStyles();

    $scope.viewStyle = function (styleNum) {
        $scope.$parent.viewStyle(styleNum);
    }
});

homeluxeApp.controller("styleViewerControl", function ($scope, $rootScope) {

    $scope.init = function () {
        $rootScope.styles = [];
        $scope.current = {
            image: 0,
            images: [],
            style: null,
            styleNode: null,
            imageNode: null
        };
    };

    $scope.updateLikes = function (styleNode, imageNode) {
        if ($scope.$parent.ngMyUser = Cookies.getJSON("myUser"))
            $scope.requests.getLikes($scope.$parent.ngMyUser.token, function (response) {
                if (response.success != "false") {
                    var flag1 = false, flag2 = false;
                    $.each(response, function (index, item) {
                        if (item.id == styleNode) {
                            $(".changeHeartStyle").removeClass("fa-heart-o").addClass("fa-heart");
                            flag1 = true;
                        }
                        if (item.id == imageNode) {
                            $(".changeHeartRoom").removeClass("fa-heart-o").addClass("fa-heart");
                            flag2 = true;
                        }
                    });
                    if (!flag1) $(".changeHeartStyle").removeClass("fa-heart").addClass("fa-heart-o")
                    if (!flag2) $(".changeHeartRoom").removeClass("fa-heart").addClass("fa-heart-o");
                }
            });
    };

    $scope.likeStyle = function () {
        if ($scope.$parent.ngMyUser = Cookies.getJSON("myUser"))
            $scope.requests.likeNode($scope.$parent.ngMyUser.token, $scope.current.styleNode, function (response) {
                if (response.status == "Success")
                    $(".changeHeartStyle").removeClass("fa-heart-o").addClass("fa-heart");
                else if (response.message == "Invalid token detected")
                    $scope.$parent.logout();
                else
                    console.log("Some Error Occurred");
            });
        else loginButtonClick();
    };

    $scope.likeRoom = function () {
        if ($scope.$parent.ngMyUser = Cookies.getJSON("myUser"))
            $scope.requests.likeNode($scope.$parent.ngMyUser.token, $scope.current.imageNode, function (response) {
                if (response.status == "Success")
                    $(".changeHeartRoom").removeClass("fa-heart-o").addClass("fa-heart");
                else if (response.message == "Invalid token detected")
                    $scope.$parent.logout();
                else
                    console.log("Some Error Occurred");
            });
        else
            loginButtonClick();
    };

    $scope.viewStyle = function (styleNum) {

        $('.coverContainer').fadeIn(500);
        $('.resultCard').fadeIn(500);
        $('.centerDesc').fadeIn(500);

        $scope.current = {
            image: 0,
            images: [],
            style: styleNum,
            styleNode: $rootScope.styles[styleNum].id
        };

        changeUrlParam('style', $rootScope.styles[styleNum].catalogueKey);

        if (typeof myRandomToken !== 'undefined') {
            changeUrlParam('token', myRandomToken);
        }

        if ($rootScope.styles[styleNum].images.length != 0) {
            for (var i = 0; i < $rootScope.styles[styleNum].images.length; i++)
                $scope.current.images[i] = {
                    "img": $rootScope.styles[styleNum].name + '/' + $rootScope.styles[styleNum].images[i].file,
                    "id": $rootScope.styles[styleNum].images[i].id
                };
            $scope.loadImage();
        }
    };

    $scope.leftNavClick = function () {
        $scope.current.image -= 1;
        if ($scope.current.image <= 0)
            $scope.current.image = 0;
        $scope.loadImage();
    };

    $scope.rightNavClick = function () {
        $scope.current.image++;
        if ($scope.current.image >= ($scope.current.images.length - 1))
            $scope.current.image = $scope.current.images.length - 1;
        $scope.loadImage();
    };

    $scope.loadImage = function () {
        $scope.current.imageNode = $scope.current.images[$scope.current.image].id;
        $scope.updateLikes($scope.current.styleNode, $scope.current.imageNode);
    };

    $scope.fbShare = function () {
        FB.ui({
            method: 'feed',
            name: $rootScope.styles[$scope.current.style].name + ' on HomeLuxe.in',
            link: window.location.href,
            picture: 'http://www.homeluxe.in/images/styles/' + $rootScope.styles[$scope.current.style].name + '/' + $rootScope.styles[$scope.current.style].images[0].file.img,
            caption: 'This style is available on HomeLuxe.in',
            description: $rootScope.styles[$scope.current.style].description,
            message: 'Check out this style. It looks absolutely beautiful! :)'
        });
    };

    $scope.callDesigner = function () {
        window.location = 'index.php#contactUsX';
    };

    $scope.coverContainerClose = function () {
        $('.coverContainer').hide();
    };

    $scope.init();
});


homeluxeApp.directive("headerMenu", function ($templateRequest, $compile) {

    var template = "../templates/headerMenu.html";

    return {
        restrict: "AE",
        link: function (scope, element) {
            $templateRequest(template).then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

homeluxeApp.directive("loginOverlay", function ($templateRequest, $compile) {

    var template = "../templates/loginOverlay.html";

    return {
        restrict: "AE",
        link: function (scope, element) {
            $templateRequest(template).then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

/*
 homeluxeApp.directive("styleViewer", function ($templateRequest, $compile) {

 var template;
 if (typeof dashboard != 'undefined') template = "../templates/styleViewer.html";
 else template = "templates/styleViewer.html";

 return {
 restrict: "AE",
 link: function (scope, element) {
 $templateRequest(template).then(function (html) {
 var template = angular.element(html);
 element.append(template);
 $compile(template)(scope);
 });
 }
 }
 });

 function getURLParameter(name) {
 return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
 }

 var urlStyle = getURLParameter('style');

 function changeUrlParam(param, value) {
 var currentURL = window.location.href + '&';
 var change = new RegExp('(' + param + ')=(.*)&', 'g');
 var newURL = currentURL.replace(change, '$1=' + value + '&');

 if (getURLParameter(param) !== null) {
 try {
 window.history.replaceState('', '', newURL.slice(0, -1));
 } catch (e) {
 console.log(e);
 }
 } else {
 var currURL = window.location.href;
 if (currURL.indexOf("?") !== -1) {
 window.history.replaceState('', '', currentURL.slice(0, -1) + '&' + param + '=' + value);
 } else {
 window.history.replaceState('', '', currentURL.slice(0, -1) + '?' + param + '=' + value);
 }
 }
 }
 */

// Show Alert Message
function showAlert(message) {
    $(".alertMessage").fadeIn(300).html(message);
}

/*
 // INITIALIZE Facebook App Access
 window.fbAsyncInit = function () {
 FB.init({
 appId: '607233152758333',
 cookie: true,  // enable cookies to allow the server to access the session
 xfbml: true,  // parse social plugins on this page
 version: 'v2.6' // use graph api version 2.5
 });
 };

 // Load Facebook SDK
 (function (d) {
 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
 if (d.getElementById(id)) {
 return;
 }
 js = d.createElement('script');
 js.id = id;
 js.async = true;
 js.src = "//connect.facebook.net/en_US/all.js";
 ref.parentNode.insertBefore(js, ref);
 }(document));

 */

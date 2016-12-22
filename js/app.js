var casanylaApp = {
    angular: null,
    currentPage: null,
    currentUser: null,
    requireLogin: false,
    pages: {
        home: 0,
        quiz: 1,
        browse: 2,
        admin: 3,
        designer: 4,
        client: 5
    },
    userRoles: {
        admin: 1,
        manager: 2,
        designer: 3,
        client: 4,
        guest: 5
    }
};

casanylaApp.angular = angular.module('casanylaApp', ['ngStorage', 'ngRoute', 'duScroll']);

casanylaApp.angular.directive('casanylaAppControl', function () {

    return {
        controller: function ($scope) {

            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function'))
                        fn();
                } else
                    this.$apply(fn);
            };

            $scope.serverRequest = function (requestType, url, data, callback, content) {
                console.log($scope.apiBaseURL + url);
                $.ajax({
                    type: requestType,
                    dataType: "json",
                    contentType: "application/" + content,
                    xhrFields: {withCredentials: true},
                    url: $scope.apiBaseURL + url,
                    data: data,
                    timeout: 25000,
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
                    $scope.serverRequest("POST", "login", myObject, callback, "x-www-form-urlencoded");
                },

                logout: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("POST", "logout", myObject, callback, "x-www-form-urlencoded");
                },

                userRegisterForm: function (name, email, password, type, callback) {
                    var myObject = {
                        "name": name,
                        "email": email,
                        "password": password,
                        "role": type,
                    };
                    $scope.serverRequest("POST", "register", myObject, callback, "x-www-form-urlencoded");
                },

                showUsers: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("GET", "user/list", myObject, callback, "x-www-form-urlencoded");
                },

                getUser: function (userID, callback) {
                    var myObject = {};
                    $scope.serverRequest("GET", "user/" + userID, myObject, callback, "x-www-form-urlencoded");
                },

                updateUser: function (userID, myName, myEmail, callback) {
                    var myObject = {
                        name: myName,
                        email: myEmail
                    };
                    $scope.serverRequest("PUT", "user/" + userID, myObject, callback, "x-www-form-urlencoded");
                },

                deleteUser: function (userID, callback) {
                    var myObject = {};
                    $scope.serverRequest("DELETE", "user/" + userID, myObject, callback, "x-www-form-urlencoded");
                },

                getQuiz: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("GET", "question", myObject, callback, "x-www-form-urlencoded");
                },

                putQuiz: function (quizModel, questionID, callback) {
                    console.log(quizModel);
                    $scope.serverRequest("PUT", "question/" + questionID, quizModel, callback, "x-www-form-urlencoded")
                },

                submitQuiz: function (answerModel, callback) {
                    $scope.serverRequest("POST", "quiz", answerModel, callback, "json");
                },

                getStyles: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("GET", "style", myObject, callback, "x-www-form-urlencoded");
                },

                addStyle: function (styleObject, callback) {
                    $scope.serverRequest("POST", "style", styleObject, callback, "x-www-form-urlencoded");
                },

                deleteStyle: function (styleID, callback) {
                    var myObject = {};
                    $scope.serverRequest("DELETE", "style/" + styleID, myObject, callback, "x-www-form-urlencoded");
                },

                updateStyle: function (styleID, styleObject, callback) {
                    $scope.serverRequest("PUT", "style/" + styleID, styleObject, callback, "x-www-form-urlencoded");
                }
            };

            $scope.serverSelect = function () {
                if (location.hostname === "localhost") {
                    $scope.apiBaseURL = "http://manky.me/";
                    $scope.baseURL = "http://localhost:8080/casanyla-platform/";
                } else {
                    $scope.apiBaseURL = "http://manky.me/";
                    $scope.baseURL = "http://casanyla.com/";
                }
            };

            $scope.init = function () {
                $scope.serverSelect();
            };

            $scope.init();
        }
    };
});

casanylaApp.angular.directive('userControl', function () {
    return {
        controller: function ($scope, $localStorage) {
            $scope.hideLoginOverlay = function () {
                $('.loginOverlay').fadeOut(500);
            };

            $scope.isValid = function (value) {
                return (typeof value != 'undefined' && value != "");
            };

            $scope.login = function () {
                if ($scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password))
                    $scope.requests.userLogin($scope.guest.email, $scope.guest.password, function (response) {
                        $scope.safeApply(function () {
                            if (response.name) {
                                $localStorage.ngMyUser = response;
                                $scope.ngMyUser = $localStorage.ngMyUser;
                                $scope.loginSuccess();
                            }
                            else showAlert('Wrong username or password.');
                        });
                    });
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

            $scope.userReset = function () {
                $scope.ngMyUser = false;
                $scope.accountOptions = false;
                //$scope.facebook = {};
                $scope.guest = {};
                casanylaApp.currentUser = null;

                if (casanylaApp.requireLogin) {
                    $scope.requireLogin = true;
                    setTimeout(function () {
                        $('.loginOverlay').fadeIn(500);
                    }, 500);
                } else {
                    $scope.requireLogin = false;
                }
            };

            $scope.accountOptionsTrigger = function () {
                if (!$scope.ngMyUser) $scope.loginButtonClick();
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
                    $scope.safeApply(function () {
                        if (response.responseText == "Successfully logged out") {
                            $localStorage.$reset();
                            $scope.userReset();
                        }
                    });
                });
            };

            $scope.loginSuccess = function () {
                //if ($scope.facebook.connected) $scope.ngMyUser.fbConnected = $scope.facebook.connected;
                $('.alertMessage').hide();
                $('.loginOverlay').hide();
                if (typeof dashboard != 'undefined' && dashboard) showDashboard();
            };

            $scope.init = function () {
                if ($localStorage.ngMyUser)
                    $scope.ngMyUser = $localStorage.ngMyUser;
                else $scope.userReset();

            };

            $scope.init();
        }
    };
});

casanylaApp.angular.controller("quizAppControl", function ($scope, $rootScope) {

    $scope.startQuiz = function () {
        $scope.currentQuestion = 0;
        $scope.myProgress = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        $scope.requests.getQuiz(function (response) {
            $scope.safeApply(function () {
                $scope.questions = response;
                $scope.getNextQuestion();
            });
        });
    };

    $scope.getNextQuestion = function () {
        $scope.myProgress += 100 / ($scope.questions.length + 1);
        if (!($scope.question = $scope.questions[$scope.currentQuestion])) {
            $scope.quizOver = true;
            $scope.requests.submitQuiz(angular.toJson($scope.questions), function (response) {
                $scope.safeApply(function () {
                    $scope.answers = response;
                    if ($scope.answers.length > 0) {
                        $rootScope.viewStyle($scope.answers[0]);
                    } else alert("NO STYLES FOUND FOR THIS COMBINATION");
                });
            });
        }
    };

    $scope.saveAnswer = function (myAnswer) {
        $scope.questions[$scope.currentQuestion].options[myAnswer].answered = true;
        $scope.currentQuestion++;
        $scope.getNextQuestion();
    };
});

casanylaApp.angular.controller("browseStyleControl", function ($scope, $rootScope) {

    $scope.getStyles = function () {
        $scope.requests.getStyles(function (response) {
            $scope.safeApply(function () {
                $rootScope.styles = response;
            });
        });
    };

    $scope.init = function () {
        $rootScope.styles = null;
        $scope.getStyles();
    };

    $scope.init();

    $scope.viewStyle = function (styleNum) {
        $rootScope.viewStyle(styleNum);
    }

});

casanylaApp.angular.directive("styleViewer", function ($templateRequest, $compile) {

    var template = "../templates/styleViewer.html";

    return {
        restrict: "AE",
        controller: function ($scope) {
            $scope.init = function () {
                $scope.currentStyle = null;
            };

            /*
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
             */

            $scope.viewStyle = function (style) {

                $scope.currentStyle = {
                    styleObject: style,
                    currentImage: 0,
                    currentImageFile: null
                };

                $('.coverContainer').fadeIn(500);
                $('.resultCard').fadeIn(500);
                $('.centerDesc').fadeIn(500);

                if ($scope.currentStyle.styleObject.images.length != 0)
                    $scope.loadImage();
            };

            $scope.leftNavClick = function () {
                $scope.currentStyle.currentImage -= 1;
                if ($scope.currentStyle.styleObject.currentImage <= 0)
                    $scope.currentStyle.styleObject.currentImage = 0;
                $scope.loadImage();
            };

            $scope.rightNavClick = function () {
                $scope.currentStyle.currentImage++;
                if ($scope.currentStyle.styleObject.currentImage >= ($scope.currentStyle.styleObject.images.length - 1))
                    $scope.currentStyle.styleObject.currentImage = $scope.currentStyle.styleObject.images.length - 1;
                $scope.loadImage();
            };

            $scope.loadImage = function () {
                $scope.safeApply(function () {
                    $scope.currentImageFile = $scope.currentStyle.styleObject.images[$scope.currentStyle.currentImage].file;
                    //$scope.updateLikes($scope.current.styleNode, $scope.current.imageNode);
                });

            };

            /*
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
             */

            $scope.callDesigner = function () {
                window.location = '../home/index.php#contactUsX';
            };

            $scope.menuBrowseClick = function () {
                if (casanylaApp.currentPage == casanylaApp.pages.browse) {
                    $('.resultCard').fadeOut(500);
                    $('.centerDesc').fadeOut(500);
                }else{
                    window.location = "../browse"
                }
            };

            $scope.coverContainerClose = function () {
                $('.coverContainer').hide();
            };

            $scope.init();
        },
        link: function (scope, element) {
            $templateRequest(template).then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

casanylaApp.angular.directive("headerMenuBeta", function ($templateRequest, $compile) {

    var template = "../templates/headerMenuBeta.html";

    return {
        restrict: "AE",
        controller: function ($scope, $document) {

            $scope.menuHomeClick = function () {
                if (casanylaApp.currentPage == casanylaApp.pages.home)
                    $document.scrollToElement(document.getElementsByClassName("introSection"), 0, 500);
                else window.location = "../home";
            };

            $scope.menuHowItWorksClick = function () {
                if (casanylaApp.currentPage == casanylaApp.pages.home)
                    $document.scrollToElement(document.getElementsByClassName("howItWorksSection"), 0, 500);
                else window.location = "../home/#!#howItWorksSection";

            };

            $scope.menuBrowseClick = function () {
                window.location = "../browse"
            };

            $scope.menuQuizClick = function () {
                window.location = "../quiz"
            };

            $scope.menuWhoWeAreClick = function (){
                if (casanylaApp.currentPage == casanylaApp.pages.home)
                    $document.scrollToElement(document.getElementsByClassName("whoWeAreSection"), 0, 500);
                else window.location = "../home/#!#whoWeAreSection";
            };

            $scope.menuContactUsClick = function () {
                if (casanylaApp.currentPage == casanylaApp.pages.home)
                    $document.scrollToElement(document.getElementsByClassName("contactUsSection"), 0, 500);
                else window.location = "../home/#!#contactUsSection";
            };

            $scope.menuClicked = function () {
                if (!$scope.menuState)
                    $scope.menuOpen();
                else
                    $scope.menuClose();
            };

            $scope.menuContainerClicked = function () {
                if ($scope.menuState)
                    $scope.menuClose();
            };

            $scope.menuClose = function () {
                $scope.menuState = false;
                $(".menuCloseFeedback").stop(true, true).animate({opacity: 0}, 175);
                $(".menuContainer").stop(true, true).fadeOut(175);
                $(".menu").stop(true, true).animate({left: '-270px'}, 175);
                $("#fullpage").stop(true, true).animate({left: '0px'}, 175);
            };

            $scope.menuOpen = function () {
                $scope.menuState = true;
                $(".menuCloseFeedback").stop(true, true).animate({opacity: 1}, 250);
                $(".menuContainer").stop(true, true).fadeIn(250);
                $(".menu").stop(true, true).animate({left: '0px'}, 250);
                $("#fullpage").stop(true, true).animate({left: '100px'}, 250);
            };

            $scope.loginButtonClick = function () {
                $('.loginOverlay').fadeIn(500);
            };

            $scope.init = function () {
                $scope.menuState = false;
            };

            $scope.init();

        },
        link: function (scope, element) {
            $templateRequest(template).then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

casanylaApp.angular.directive("headerMenu", function ($templateRequest, $compile) {

    var template = "../templates/headerMenu.html";

    return {
        restrict: "AE",
        controller: function ($scope, $document) {

            $scope.menuHomeClick = function () {
                if (casanylaApp.currentPage == casanylaApp.pages.home)
                    $document.scrollToElement(document.getElementsByClassName("introSection"), 0, 500);
                else window.location = "../home";
            };

            $scope.menuBrowseClick = function () {
                window.location = "../browse"
            };

            $scope.menuHowItWorksClick = function () {
                if (casanylaApp.currentPage == casanylaApp.pages.home)
                    $document.scrollToElement(document.getElementsByClassName("howItWorksSection"), 0, 500);
            };


            $scope.menuContactUsClick = function () {
                if (casanylaApp.currentPage == casanylaApp.pages.home)
                    $document.scrollToElement(document.getElementsByClassName("contactUsSection"), 100, 500);
            };

            $scope.init();

        },
        link: function (scope, element) {
            $templateRequest(template).then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

casanylaApp.angular.directive("loginOverlay", function ($templateRequest, $compile) {

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



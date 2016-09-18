// create the module and name it pixelUpApp
var pixelUpApp = angular.module('pixelUpApp', ['ngRoute', 'ngResource', 'pixelUpApp.services', 'updateMeta']);

// configure our routes
pixelUpApp.config(function($routeProvider, $locationProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : '/p/home',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/speakers', {
            templateUrl : '/p/speakers',
            controller  : 'scheduleController'
        })


        // route for the about page
        .when('/speakers/:speaker', {
            templateUrl : function(params) {
                return '/p/speakers/' + params.speaker  ;
            },
            controller  : 'speakerController'
        })

        // route for the about page
        .when('/schedule', {
            templateUrl : '/p/schedule',
            controller  : 'scheduleController'
        })

        // route for the about page
        .when('/workshops', {
            templateUrl : '/p/workshops',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/workshops/:workshop', {
            templateUrl : function(params) {
                return '/p/workshops/' + params.workshop  ;
            },
            controller  : 'mainController'
        })

        // route for the about page
        .when('/venue', {
            templateUrl : '/p/venue',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/sponsors', {
            templateUrl : '/p/sponsors',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/blog', {
            templateUrl : '/p/blog',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/blog/:post', {
            templateUrl : function(params) {
                return '/p/blog/' + params.post  ;
            },
            controller  : 'mainController'
        })

        // route for the about page
        .when('/blog/articles-about/:category', {
            templateUrl : function(params) {
                return '/p/blog/articles-about/' + params.category  ;
            },
            controller  : 'mainController'
        })

        // route for the contact page
        .when('/tickets', {
            templateUrl : '/p/tickets',
            controller  : 'mainController'
        })

        // route for the contact page
        .when('/code-of-conduct', {
            templateUrl : '/p/code-of-conduct',
            controller  : 'mainController'
        })

        // route for the contact page
        .when('/privacy', {
            templateUrl : '/p/privacy',
            controller  : 'mainController'
        })

        // route for the contact page
        .when('/volunteer', {
            templateUrl : '/p/volunteer',
            controller  : 'mainController'
        })

        // route for the contact page
        .when('/terms', {
            templateUrl : '/p/terms',
            controller  : 'mainController'
        })

        // route for the contact page
        .when('/convince-your-boss', {
            templateUrl : '/p/convince-your-boss',
            controller  : 'mainController'
        })

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
});

// create the controller and inject Angular's $scope
pixelUpApp.controller('mainController', function($scope, $location, Speaker) {
    if(window.Intercom){
        window.Intercom("boot", {
            app_id: "qxctwqvi"
        });
    }
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.speakers = Speaker.query();
    $scope.currentSection = "";

    $scope.$on('$locationChangeStart', function(event, next, current) {
        $scope.section = $location.path().split("/")[1]||"";
        if(window.Intercom){
            window.Intercom("update");
        }
    });

});

pixelUpApp.controller('speakerController', function($scope) {
    //$scope.speaker = $routeparams.speaker;

});

pixelUpApp.controller('scheduleController', function($scope) {
    $scope.currentTab = 1;
    $scope.setCurrentTab = function(nextTab){
        $scope.currentTab = nextTab;
    };
    $scope.isCurrentTab = function(aTab){
        return $scope.currentTab === aTab;
    };
});

pixelUpApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

$( document ).ready(function() {
    eraseCookie("onList");
    $("#news-signup-form__submit").attr('disabled','disabled')

    var q = 0,
        g = document.body,
        onList = readCookie('onList')

    $(function () {
        function c(atTop) {
            if(atTop==0) {
                $(".top-bar").removeClass("top-bar--active");
                // $(".news-signup-footer").removeClass("news-signup-footer--active");
            }
            $(".top-bar").removeClass("top-bar--asleep");
        }
        function d(val) {
            $(".top-bar").addClass("top-bar--asleep top-bar--active");
            // (onList==null) ? $(".news-signup-footer").addClass("news-signup-footer--active") : $();
        }
        $(window).on({
            scroll: function () {
                $(".body").outerHeight();
                var a = $(document).height(),
                    l = $(window).height(),
                    b = $(window).scrollTop();
                if(b>-1){
                    b < g || b + l >= a - 200 ? c(1) : b > q ? d(b) : c(b);
                    q = b;
                }
            }
        });

    })
    $("#toggle").click(function(n) {
        n.preventDefault();
        $(".top-bar__nav").css("opacity", 0);
        $(".top-bar").toggleClass("top-bar--open");
        $(".top-bar__nav").delay(.5).animate({ opacity: 1 }, 100);
    })

    $(".nav__link").click(function(n) {
        if($(".top-bar").hasClass('top-bar--open'))
        {
            $(".top-bar").toggleClass("top-bar--open");
        }
    })


    $('#news-signup-form').validate({
		onKeyup : true,
		eachValidField : function() {
			$(this).removeClass('error').addClass('success');
            $("#news-signup-form__submit").removeAttr('disabled')
		},
		eachInvalidField : function() {
			$(this).removeClass('success').addClass('error');
            $("#news-signup-form__submit").attr('disabled','disabled')
		}
	});

	$.validateExtend({
		email : {
			required : true,
			pattern : /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
		}
	});

    // process the form
    $('#news-signup-form').submit(function(event) {
        $(".news-signup-msg").hide()
        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = { 'email' : $('input[name=email]').val()};

        // process the form
        var xhr = $.post('/email',formData)
        .done(function(data) {
            // show a success message
            $('#news-signup-form')
            .html("<p><strong>Thanks for signing up!</strong> You'll hear from us again soon.</p>")

            var timeoutID = window.setTimeout(function() {
                $(".news-signup-footer").removeClass("news-signup-footer--active")
                window.clearTimeout(timeoutID);
            }, 900);
            // set a cookie
            onList = true;
            createCookie('onList', onList, 180);
        })
        .fail(function(data) {
            $(".news-signup-msg").show()
            $(".news-signup-msg").text(data.responseJSON.error)
            $(".news-signup-msg").addClass("news-signup-msg--error")
        })

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

    $('.Tab-nav.active').each(function(){
        // For each set of tabs, we want to keep track of
        // which tab is active and its associated content
        var $active, $content, $links = $(this).find('a');

        // If the location.hash matches one of the links, use that as the active tab.
        // If no match is found, use the first link as the initial active tab.
        $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
        $active.addClass('Tab-nav-item--selected');

        $content = $($active[0].hash);

        // Hide the remaining content
        $links.not($active).each(function () {
          $(this.hash).hide();
        });

        // Bind the click event handler
        $(this).on('click', 'a', function(e){
          // Make the old tab inactive.
          $active.removeClass('Tab-nav-item--selected');
          $content.hide();

          // Update the variables with the new link and content
          $active = $(this);
          $content = $(this.hash);
          window.location.hash = this.hash;

          // Make the tab active.
          $active.addClass('Tab-nav-item--selected');
          $content.show();

          // Prevent the anchor's default click action
          e.preventDefault();
        });
      });

    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }
});

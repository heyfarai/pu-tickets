$(function() {
    var distance  = $(window).scrollTop();
    var nav = $('.top-bar'); // Name of the div
    var nav_class = 'top-bar--active'; // Change to class name
    var threshold = 10; // Change to pixels scrolled
    $(window).scroll(function () {
        drawNavShadow();
        var val = 1 - $(window).scrollTop() / 250;
        $(".header-inner").css("opacity", val).css("transform", "translateY(" + val*5 + "px)");
    });
    var drawNavShadow = function(){
        var distance = $(this).scrollTop();
        if (distance > threshold) { // If scrolled past threshold
            nav.addClass(nav_class); // Add class to nav
        } else { // If user scrolls back to top
            if (nav.hasClass(nav_class)) { // And if class has been added
                nav.removeClass(nav_class); // Remove it
            }
        }
    }

    drawNavShadow()
    $("#toggle").click(function(n) {
        n.preventDefault();
        $(".top-bar__nav").css("opacity", 0);
        $(".top-bar").toggleClass("top-bar--open");
        $(".top-bar__nav").delay(1).animate({ opacity: 1 }, 100);
    })

})

$( document ).ready(function() {
    var q = 0,
        g = document.body

    $(function () {
        function c(atTop) {
            if(atTop==0) {
                $(".top-bar").removeClass("top-bar--active");
            }
            $(".top-bar").removeClass("top-bar--asleep");
        }
        $(window).on({
            scroll: function () {
                $(".body").outerHeight();
                var a = $(document).height(),
                    l = $(window).height(),
                    b = $(window).scrollTop();
                if(b>-1){
                    b < g || b + l >= a - 200 ? c(1) : b > q ? ($(".top-bar").addClass("top-bar--asleep top-bar--active")) : c(b);
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
});

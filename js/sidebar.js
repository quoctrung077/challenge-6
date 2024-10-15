$(document).ready(function () {
    $('.btn__toggle').click(function () {
        $('.sidebar').toggleClass('collapsed');
        if ($('.sidebar').hasClass('collapsed')) {
            $('.logo-a').fadeOut(400, function () {
                $('.logo-b').fadeIn(400);
            });
        } else {
            $('.logo-b').fadeOut(400, function () {
                $('.logo-a').fadeIn(400);
            });
        }
    });
});


$('.carousel').each(function() {
    const carousel = $(this);
    const ul = carousel.find("ul");

    const left = carousel.find("#carousel-l");
    const right = carousel.find("#carousel-r");

    const count = carousel.find('li').length;

    ul.css("width", count * 100 + "vw");

    // Button functionality

    let position = 0;

    right.click(function () {
        if (position < (count - 1)) {
            position++;
            var m = "-" + (100 * position) + "vw";
            ul.animate({
                "left": m
            }, 500);
            greyButton();
        }
    });

    left.click(function () {
        if (position > 0) {
            position--;
            var m = "-" + (100 * position) + "vw";
            ul.animate({
                "left": m
            }, 500);
            greyButton();
        }
    });

    // Grey out buttons if not useable 

    const greyButton = function () {
        if (position == 0) {
            left.css("opacity", "0.3");
            left.css("cursor", "default");
        } else if (position == (count - 1)) {
            right.css("opacity", "0.3");
            right.css("cursor", "default");
        } else {
            right.css("opacity", "1");
            right.css("cursor", "pointer");
            left.css("opacity", "1");
            left.css("cursor", "pointer");
        }
    }

    greyButton();

    if (count == 1) {
        carousel.find('.carousel-control').css('display', 'none');
    }

});
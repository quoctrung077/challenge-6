
$(document).ready(function () {
    $(window).scroll(function () {
        var navbar = $('.basic-header-content-wrapper');
        if ($(this).scrollTop() > 0) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });
    sliderAuto();
    sliderManage();
    showTabContent();
    clickTags();
    playVideo();
    isOpen();
});

let selectedWrappers = [];
function clickTags() {
    $('.tag').on('click', function () {

        const checkbox = $(this).find('.form-check-input');
        checkbox.prop('checked', !checkbox.prop('checked'));

        const index = $('.form-check-input').index(checkbox);
        const targetPictureWrapper = $('.picture-wrapper').eq(index);
        $('.picture-wrapper').removeClass('selected');
        if (checkbox.is(':checked')) {
            targetPictureWrapper.addClass('selected');
            $('.default-asset').removeClass('active');

            const existingIndex = selectedWrappers.indexOf(targetPictureWrapper[0]);
            if (existingIndex !== -1) {
                selectedWrappers.splice(existingIndex, 1);
            }
            selectedWrappers.unshift(targetPictureWrapper[0]);

        } else {
            targetPictureWrapper.removeClass('selected');
            selectedWrappers = selectedWrappers.filter(item => item !== targetPictureWrapper[0]);
            if (selectedWrappers.length > 0) {
                $(selectedWrappers[0]).addClass('selected');
            }
        }
        const anyChecked = $('.form-check-input:checked').length > 0;
        if (!anyChecked) {
            $('.default-asset').addClass('active');
        }

        console.log(selectedWrappers);
    });
}

function sliderManage() {
    $('.list-card').slick({
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 2,
        prevArrow: false,
        nextArrow: false
    });

    $('.cs-next').click(function () {
        $('.list-card').slick('slickNext');
    });
    $('.cs-prev').click(function () {
        $('.list-card').slick('slickPrev');
    });
};

function sliderAuto() {

    $('.list-carousel').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        prevArrow: false,
        nextArrow: false,
        infinite: true,
        dot: true,
    });

    $('.list-carousel').on('afterChange', function (event, slick, currentSlide) {
        $('.lable').removeClass('selected');
        $('.lable').eq(currentSlide).addClass('selected');
    });

    $('.lable').on('click', function () {
        var index = $(this).index();
        $('.list-carousel').slick('slickGoTo', index);
    });

    $('.list-carousel').on('afterChange', function (event, slick, currentSlide) {
        var $currentSlide = $('.list-carousel').find('.slick-slide').eq(currentSlide);
        var video = $currentSlide.find('.video-wrap')[0]; // Tìm video trong slide hiện tại
        if (video) {
            video.play(); // Chỉ phát video nếu nó tồn tại
        }
    });
};

function showTabContent() {

    $('.right-arrow-container').on('click', function () {
        $('.tabs .tab').slice(0, 6).appendTo('.tabs');
        $('.tab-content .tab-content-container').slice(0, 6).appendTo('.tab-content')

    });

    $('.left-arrow-container').on('click', function () {
        $('.tabs .tab').slice(-6).prependTo('.tabs');
        $('.tab-content .tab-content-container').slice(-6).prependTo('.tab-content')
    });

    $('.tab').on('click', function () {
        let index = $(this).index();
        $('.tab').removeClass('selected');
        $(this).addClass('selected');
        $('.tab-content-container').addClass('hidden');
        $('.tab-content-container').eq(index).removeClass('hidden');
    });
}


function playVideo() {
    const video = $('video');
    $('.background-image-card').hover(
        function () {
            const currentVideo = $(this).find('.background-video');
            const currentCardImage = $(this).find('.card-image');
            currentVideo.addClass('active');
            currentCardImage.addClass('active');
            video.get(0).play();
        },
        function () {
            const currentVideo = $(this).find('.background-video');
            const currentCardImage = $(this).find('.card-image');
            video.get(0).pause();
            video.get(0).currentTime = 0;
            currentVideo.removeClass('active');
            currentCardImage.removeClass('active');
        }
    );
}

function isOpen() {
    const items = $('.language-picker-component, .link-item-with-menu-component');
    const headerMenus = $('.header-menu-component-wrapper');

    items.on('click', function () {
        const index = items.index(this);
        const targetMenu = headerMenus.eq(index);
        
        // Kiểm tra nếu phần tử được click đã có class 'is-open'
        if ($(this).hasClass('is-open')) {
            $(this).removeClass('is-open');
            targetMenu.hide();  // Ẩn menu tương ứng
        } else {
            // Loại bỏ class 'is-open' khỏi tất cả các thẻ
            items.removeClass('is-open');
            // Ẩn tất cả các menu
            headerMenus.hide();
            // Thêm class 'is-open' cho thẻ được click
            $(this).addClass('is-open');
            // Hiển thị menu tương ứng
            targetMenu.show();
        }
    });
}
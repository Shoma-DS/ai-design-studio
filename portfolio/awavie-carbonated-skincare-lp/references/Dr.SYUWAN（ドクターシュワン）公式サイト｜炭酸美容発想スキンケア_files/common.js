// トグルメニュー
$(function(){
    $('.js-toggle').click(function(e){
        $(this).next('.js-nav').fadeToggle();
        $(this).toggleClass('active');
        if (window.matchMedia('(max-width: 767px)').matches) {
            if ($(this).hasClass('active')) {
                document.addEventListener('touchmove', handleTouchMove, {passive: false})
                document.addEventListener('mousewheel', handleTouchMove, {passive: false});
            } else {
                document.removeEventListener('touchmove', handleTouchMove, {passive: false});
                document.removeEventListener('mousewheel', handleTouchMove, {passive: false});
            }
        }
    });
    $(".openbtn2").click(function () {
        $(this).toggleClass('active');
    });

    function handleTouchMove(event) {
        event.preventDefault();
    }
    // PCメニュー
    $(".online").mouseover(
        () => $('#online_shop_list').fadeIn()
    );
    $("#online_shop_list").mouseleave(
        () => $('#online_shop_list').fadeOut()
    );
    $(".pc_nav .site_nav li").not(".online").mouseover(
        () => $('#online_shop_list').fadeOut()
    )
    $(".pc_nav .sns_list").mouseover(
        () => $('#online_shop_list').fadeOut()
    )
});


/**
 * モーダルウィンドウ
 */
$(function () {
    var scrollPosition;

    // モーダルウィンドウを開く
    $('.js-modal-open').on('click', function () {
        var target = $(this).data('target');
        var modal = document.getElementById(target);
        scrollPosition = $(window).scrollTop();
        $(modal).fadeIn(function () {
            var iframe = $(this).find('iframe')[0];
            if (iframe !== undefined) {
                iframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            }
            $('body').css('overflow-y', 'hidden').css('position', 'fixed');
        });
        $.each(ps, function () {
            this.update();
        });
        return false;
    });

    // モーダルウィンドウを閉じる
    $('.js-modal-close').on('click', function () {
        var iframe = $(this).parent().find('iframe')[0];
        if (iframe !== undefined) {
            iframe.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        }
        var html = $('html');
        html.css('scroll-behavior', 'unset');
        $('body').css('overflow-y', 'auto').css('position', 'relative');
        window.scrollTo(0, scrollPosition);
        $('.js-modal').fadeOut();
        html.css('scroll-behavior', '');
        scrollPosition = 0;
        return false;
    });
});

/**
 * アコーディオン
 */
$(function(){
    //クリックで動く
    $('.js-accordion-open').click(function(){
        $(this).toggleClass('active');
        $(this).next('.js-accordion-content').slideToggle();
    });
});

// スクロールでimg_titが表示された時にアニメーション
$(function(){
    const options = {
        root: null,
        threshold: 1
    }
    const intersect = (entries) => {
        entries.forEach(entry => {
            // 一旦active付与したら以降そのまま
            if (entry.isIntersecting) {
                console.log(entry.target)
                $(entry.target).addClass('active');
            }
            })
    }
    const observer = new IntersectionObserver(intersect, options);

    const titles = document.querySelectorAll(".img_tit .img")
    titles.forEach(title => {
        observer.observe(title)
    })
})

$(function () {
    var breakPoint = 768;
    $(window).scroll(function () {
        $('.scrollIn').each(function () {
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if ($(window).innerWidth() >= breakPoint) {
                if (scroll > elemPos - windowHeight + 200) {
                    $(this).addClass('active');
                }
            } else {
                if (scroll > elemPos - windowHeight + 50) {
                    $(this).addClass('active');
                }
            }

        });
    });
});

/**
 * vh 高さフォールバック
 */

const setFillHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

let vw = window.innerWidth;

window.addEventListener('resize', () => {
    if (vw === window.innerWidth) {
        // 画面の横幅にサイズ変動がないので処理を終える
        return;
    }

    // 画面の横幅のサイズ変動があった時のみ高さを再計算する
    vw = window.innerWidth;
    setFillHeight();
});

// 初期化
setFillHeight();

/**
 * fadein アニメーション
 */
$(window).scroll(function (){
    $('.fadein').each(function(){
        var elemPos = $(this).offset().top,
            scroll = $(window).scrollTop(),
            windowHeight = $(window).height();

        if (scroll > elemPos - windowHeight){
            $(this).addClass('scrollIn');
        }
    });
});

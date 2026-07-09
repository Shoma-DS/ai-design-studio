$(function(){
    $('.fade').slick({
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnFocus: false,
        pauseOnHover: false,
        pauseOnDotsHover: false,
    });
    $('.fade').slick('slickPause')
    $('.main_visual > .slick-dots').hide()
    $('.banner_content.slider').slick({
        arrows: false,
        dots: false,
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: "9%",
                },
            },
        ],
    });
    $('.topics_list').slick({
        slidesToShow: 3, // 表示させるスライド数
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: "12%",
                },
            },
        ],
    });

    // $('.banner_slider, .topics_list').on('wheel', function(e) {
    //     e.preventDefault()
    //     if (e.originalEvent.deltaX < 0) {
    //         $(this).slick('slickNext')
    //       } else {
    //         $(this).slick('slickPrev')
    //       }
    // })

    // スクロールで要素が表示された時にclassを付与する
    const options = {
        root: null,
        rootMargin: '50px 0px 50px',
        threshold: 0.3
      };
    const intersect = (entries) => {
        entries.forEach(entry => {
            // 一旦active付与したら以降そのまま
            if (entry.isIntersecting) {
                $(entry.target).addClass('active');
            }
          });
    }
    const observer = new IntersectionObserver(intersect, options);

    observer.observe(document.querySelector(".diamond_skin_area"));



    // オープニングアニメーション
    if (!sessionStorage.getItem('visited')) {
        console.log('first time')
        $('body').addClass("scroll_fixed");
        $('.header').hide()
        $('.scroll_area').hide()

        sessionStorage.setItem('visited', 'true')

        $('#overlay').on('animationend', function() {
            
            $('.init_logo').children('img').fadeOut(2000)
            $('.main_visual::after').fadeIn(1000)

            window.setTimeout(() => {
                $('.init_visual').addClass('fade_out')
                // $('.slider').addClass('blur_fading')
                $('.scroll_area').fadeIn(2000)
                $('.main_visual > .slick-dots').fadeIn(2000)
                $('.header').fadeIn(2000, function() {
                    $('body').removeClass("scroll_fixed")
                    $('.fade').slick('slickPlay')
                    $('#opening').css('z-index', -999)
                })

            }, 1000)

        });
    } else {
        $('.init_visual').hide()
        $('.main_visual > .fade').css('filter', 'none')
        $('.fade').slick('slickPlay')
    }

    /**
     * SPの場合のみ
     * トップページのSNSリンクをタップした際にグラデーションが表示された後に画面遷移する
     */
    $('.top_container .sns_sec .sns_link_area .sns_list > li a.cv-official_sns').on('click', function() {
        $(this).removeClass('mouse_leave');
        if (!navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
            return true;
        }
        setTimeout(() => {
            location.href = $(this).attr('href');
            setTimeout(() => {
                $(this).addClass('mouse_leave');
            }, 1500);
        }, 500);
        return false;
    });

});
$(function(){
    let targets = document.querySelectorAll('.js-scroll-check'); //ターゲット要素
//スクロールイベント
    window.addEventListener('scroll', function () {
        var scroll = window.scrollY;
        var windowHeight = window.innerHeight; //画面の高さを取得
        var windowHalfHeight = (windowHeight /2);
        for (let target of targets) {
            var targetPos = target.getBoundingClientRect().top + scroll;
            if (scroll > targetPos - windowHalfHeight) {
                target.classList.add('checked');
            }
        }
    });
});

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();



   // testimonial carousel
   $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    items: 1,
    smartSpeed: 1500,
    dots: true,
    dotsData: true,
    loop: true,
    margin: 25,
    nav : true,
    navText : [
        '<i class="bi bi-arrow-left"></i>',
        '<i class="bi bi-arrow-right"></i>'
    ]
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').addClass('show');
    } else {
        $('.back-to-top').removeClass('show');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Smooth scroll for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Active nav link on scroll - FIXED to only add active when appropriate
    $(window).scroll(function() {
        var scrollPos = $(document).scrollTop();
        var found = false;
        
        $('.navbar-nav .nav-link').each(function() {
            var refElement = $($(this).attr('href'));
            if(refElement.length) {
                if (refElement.offset().top - 200 <= scrollPos && refElement.offset().top + refElement.height() - 200 > scrollPos) {
                    $('.navbar-nav .nav-link').removeClass('active');
                    $(this).addClass('active');
                    found = true;
                }
            }
        });
        
        // If no section is in view, remove all active classes
        if(!found) {
            $('.navbar-nav .nav-link').removeClass('active');
        }
    });

    // Mobile menu toggle
    var navOpen = false;
    $(window).on('resize', function() {
        if($(window).width() < 992) {
            if(!navOpen) {
                $('.nav-section .navbar').css('visibility', 'visible');
            }
        }
    });

    // Lazy loading for images
    if('IntersectionObserver' in window) {
        let imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if(entry.isIntersecting) {
                    let img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
    }

    // Responsive menu toggle (if needed)
    $(window).resize(function() {
        if($(window).width() < 992) {
            // Mobile specific adjustments
            $('.nav-section').addClass('mobile-nav');
        } else {
            $('.nav-section').removeClass('mobile-nav');
        }
    }).trigger('resize');

    // Form validation (if forms are added)
    $('form').on('submit', function(e) {
        let isValid = true;
        $(this).find('input[required], textarea[required]').each(function() {
            if($(this).val() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        if(!isValid) {
            e.preventDefault();
        }
    });

    // Parallax effect for header (optional)
    $(window).scroll(function() {
        var scrollPos = $(window).scrollTop();
        if($(window).width() > 768) {
            $('.header-img').css('transform', 'translateY(' + scrollPos * 0.5 + 'px)');
        }
    });

})(jQuery);

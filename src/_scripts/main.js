'use strict';
global.jQuery = require('jquery');
require('./jquery.counter');
require('./jquery.scrollme.min');
require('fancybox')(jQuery);

var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0.5) {
      dataLayer.push({
        event: 'impression',
        elementID: entry.target.id
      });
    }
  });
}, {
  threshold: [0.5]
});

document.querySelectorAll('[data-print="true"]').forEach(function (element) {
  io.observe(element);
});

jQuery(document).ready(function ($) {
  $('.percentage-number').counter({
    minForIncrement: 0
  });

  var bg_pos_init_x = $('.home .header-site').css('background-position-x');
  var offsetTop;
  if ($('body').hasClass('home')) {
    $(window).on('scroll', function () {
      offsetTop = $('.home .header-site').offset().top;

      if ((offsetTop < $(window).scrollTop() ||
          offsetTop > $(window).scrollTop() &&
          offsetTop < $(window).scrollTop() + $(window).height())) {
        var vitesse = window.innerWidth < 768 ? 1 : 2;
        var position = -((((($(window).scrollTop()) - offsetTop) * 100 / $('.home .header-site').outerHeight()) + parseInt(bg_pos_init_x)) * vitesse);
        //    var position = ((($(window).scrollTop()) - offsetTop)  * 100 /  $('.home .header-site').outerHeight() );

        position = parseInt(position);
        position += '%';
        $('.home .header-site').css('background-position', position + ' bottom');
      }
    });
  }

  // video modal fancybox
  $('a[id^="video"]').fancybox({
    padding: 0
  });
  $('a[href="#registerForm"]').fancybox({
    'hideOnContentClick': true
  })
});

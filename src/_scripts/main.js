'use strict';
global.jQuery = require('jquery');
require('./jquery.counter');
require('./jquery.scrollme.min');
var noui = require('nouislider');
require('fancybox')(jQuery);
require('bootstrap');
require('bootstrap-material-design');

jQuery.material.init();

noui.create(document.getElementById('room-number-slider'), {
    start: 40,
    connect: "lower",
    range: {
        min: 0,
        max: 100
    }
  });

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
  $('a[href="#registerForm"]').on('click', function(event) {
    var button = $(event.target);
    var image = button.data('img');
    $('#registerForm').find('.contract-img img').attr('src', image);
    $('#emailgroup').removeClass('has-error')
    $('#registerForm').modal('toggle');
  });
  $('#inscription').on('click', function() {
    var email = $('#email').val();
    if (email) {
      var data = {
        city: $('#ville').val(),
        email: email
      }
      $.post('subscribe.php', data, function(result) {
        console.log(result);
      });
      $('#registerForm').modal('toggle');
    } else {
      $('#emailgroup').addClass('has-error')
    }
  });

  var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

});

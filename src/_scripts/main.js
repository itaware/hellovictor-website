'use strict';
global.jQuery = require('jquery');
require('./jquery.counter');
require('./jquery.scrollme.min');
var noui = require('nouislider');
require('fancybox')(jQuery);
require('bootstrap');
require('bootstrap-material-design');
require('intersection-observer');

jQuery.material.init();
if(document.getElementById('room-number-slider')){

noui.create(document.getElementById('room-number-slider'), {
    start: 40,
    connect: "lower",
    range: {
        min: 0,
        max: 100
    }
  });
}
if(document.getElementById('flat-value')){
noui.create(document.getElementById('flat-value'), {
    start: 3,
    connect: "lower",
    range: {
        min: 1,
        max: 5
    }
  });
}

var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0.5) {
      dataLayer.push({
        event: 'impression',
        elementID: entry.target.id+'-impr'
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
  $('.slogan').addClass('anim');
    var timeout = new Array();
    var bubble_tab = new Array();
    var bubble_interval = new Array();
  $(window).on('scroll', function(){
    // parallax
    if($('.bg-parallax').size() > 0){
      var position = get_position($('.bg-parallax'));
      $('.bg-parallax').css({
        'background-position': 'center ' + position
      });
    }
    /*if($('.cover-parallax').size() > 0){
      var position = get_position($('.cover-parallax'), 1);
      position = parseInt(position) - 50;
    //  position = -position;
      $('.cover-parallax img').css({
        transform: 'translate(-50%, ' + position + '%)'
      })
    }*/
    // slogan animate
    if($('.slogan').size() > 0){
      var position = get_position($('.header-site'), 1.5);
      $('.slogan').css({
        'transform': 'translateY(' + position + ')'
      });
    }

    // Block anim
    $('.block-anim, .dash').each(function(index_anim){
      if($(this).hasClass('pop-item') || $(this).hasClass('fade-item') || $(this).find('.pop-item, .fade-item')){
        timeout[index_anim] = new Array();
      }
      if( element_visible_value($(this)) > 0.5 ){
        $(this).addClass('anim');
        var timer = $(this).hasClass('pop-item') ? 150 : $(this).hasClass('fade-item') ? 300 : 300;

        if($(this).hasClass('pop-item') || $(this).hasClass('fade-item')){
          $(this).children().each(function(index){
            var item = $(this);
            if(!$(this).hasClass('anim')){
              timeout[index_anim][index] = setTimeout(function(){
                item.addClass('anim');
              }, (index) * timer);
            }
          });
        }

        if($(this).find('.pop-item, .fade-item').size() > 0){
          $(this).find('.pop-item', '.fade-item').children().each(function(index2){
            var item = $(this);
            if(!$(this).hasClass('anim')){
              timeout[index_anim][index2] = setTimeout(function(){
                item.addClass('anim');
              }, (index2) * timer);
            }
          });
        }
      }
      else if(element_visible_value($(this)) < 0.1){
        $(this).removeClass('anim');
        if(timeout[index_anim] !== undefined){
          for (var i=0; i < timeout[index_anim].length; i++){
            clearTimeout(timeout[index_anim][i]);
          }
        }
        $(this).find('.pop-item, .fade-item').children().removeClass('anim');
        if($(this).hasClass('pop-item') || $(this).hasClass('fade-item')){
          $(this).children().removeClass('anim');
        }
      }

    });

    $('.pop-bubble').each(function(index_anim){
        if( element_visible_value($(this)) > 0.5 ){
          bubble_tab[index_anim] = new Array();
          anim_bubble($(this), index_anim);
          if(bubble_interval[index_anim] === undefined)
            bubble_interval[index_anim] = anim_bubble_interval($(this), index_anim);
        }
        else {
          //anim_bubble_clear(bubble_tab, index_anim);
        }
    });
  });
  function anim_bubble_clear(bubble_tab, index_anim){
    if(bubble_interval[index_anim] !== undefined){
      for (var i=0; i < bubble_interval[index_anim].length; i++ ){
        clearInterval(bubble_interval[i]);
      }
    }
  }
  function anim_bubble_interval(element, index_anim){
    var timer = 1000;
    var time2 = 500;
    return setInterval(function(){
      element.children().removeClass('anim');
      element.children().each(function(index){
        if(index==0) time2 = 300;
        else time2 = 500;
        var item = $(this);
        clearTimeout(bubble_tab[index_anim][index]);
        if(!$(this).hasClass('anim')){
          bubble_tab[index_anim][index] = setTimeout(function(){
            item.addClass('anim');
          }, (index+1) * time2);
        }
      });
    }, timer * (element.children().size()) );
  }
  function anim_bubble(element, index_anim){
    var timer = 500;
    element.children().each(function(index){
      var item = $(this);
      if(!$(this).hasClass('anim')){
        bubble_tab[index_anim][index] = setTimeout(function(){
          item.addClass('anim');
        }, (index) * timer);
      }
    });
  }

  function element_visible_value(element){
    var percentage = ($(window).scrollTop() + $(window).height() - element.offset().top ) / element.height();
    return percentage;
  }

  function get_position(element, vitesse){
    if (!vitesse) vitesse = 1;
    offsetTop = element.offset().top;
    var position = -parseInt(((($(window).scrollTop()) - offsetTop) * 100 /  element.height()));
    position = position * vitesse;
    position += '%';

    return position;
  }
  // Anim scroll
  $('a[href*="#"]:not([href="#"])').on('click', function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 700);
          return false;
        }
      }
  });
  // video modal fancybox
  $('a[id^="video"]').fancybox({
    padding: 0
  });

  $('a[href="#registerForm"]').on('click', function(event) {
    var button = $(event.target);
    var image = $(this).parents('.product-item').find('.block-img .cover img').attr('src');
    var icon_desc = $(this).parents('.product-item').find('.icon-desc-header').html();

    $('#registerForm').find('.cover img').attr('src', image);
    $('#registerForm').find('.icon-desc').html(icon_desc);
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
        //console.log(result);
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
  $('.dropdown-title').on('click', function(e){console.log('test');
    e.preventDefault();
    $(this).next('.dropdown-content').slideToggle();
  });
});

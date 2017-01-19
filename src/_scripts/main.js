// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

jQuery(document).ready(function($){
  $('.percentage-number').counter({
    minForIncrement: 0
  });

  var bg_pos_init_x = $('.home .header-site').css('background-position-x');
  var offsetTop;
  if($('body').hasClass('home')){
    $(window).on('scroll', function(){
      offsetTop = $('.home .header-site').offset().top;

      if(
          (offsetTop < $(window).scrollTop()
              || offsetTop > $(window).scrollTop()
              && offsetTop < $(window).scrollTop() + $(window).height()
          )
        ){
          var vitesse = window.innerWidth < 768 ? 1 : 2;
          console.log(vitesse);
          var position = -((((($(window).scrollTop()) - offsetTop)  * 100 /  $('.home .header-site').outerHeight() ) + parseInt(bg_pos_init_x)) * vitesse);
      //    var position = ((($(window).scrollTop()) - offsetTop)  * 100 /  $('.home .header-site').outerHeight() );

          position = parseInt(position);
          position += '%';
          $('.home .header-site').css('background-position',  position + ' bottom');
        }
    });
  }
});

(function($) {

$.counter = function(element, options) {

    // default options
    var defaults = {
        itemClass: '.counter-number',
        itemClassIcon: '.counter-icon',
        onStart: 'scroll', // onScroll: when the bloc is visible, now : on page load
        startAt: 1, //entre 0 et 1
        duration: 1000,
        minForIncrement: 15
    }

    var plugin = this;

    // Merge settings
    plugin.settings = $.extend({}, defaults, options);

    var $element = $(element),
    element = element;
    var init_value = $element.find(plugin.settings.itemClass).text();
    var counterDone = false;

    $element.addClass('counter-item');

    plugin.init = function() {
        $element.find(plugin.settings.itemClass).text(0);

        if(plugin.settings.onStart == 'scroll'){
            $(window).on('scroll', function(){
                if($element.offset().top < $(window).scrollTop() + $(window).height() * plugin.settings.startAt && !counterDone){
                    counterDone = true;
                    plugin.countStart();
                }
            });
        }
        else if(plugin.settings.onStart == 'now'){
                plugin.countStart();
        }
    }
    plugin.countStart= function(){
        var timer = 0;
        var gap;
        if(init_value < plugin.settings.minForIncrement ){
            gap = plugin.settings.duration / 100;
        }
        else if(init_value < 5){
            gap = plugin.settings.duration / 10;
        }
        else{
            gap = Math.ceil(plugin.settings.duration / init_value);
        }
        var random_number = setInterval(function(){
            if($element.find(plugin.settings.itemClassIcon).size()){
                $element.find(plugin.settings.itemClassIcon).addClass('anim');
            }
            else{
                if(init_value < plugin.settings.minForIncrement){
                    $element.find(plugin.settings.itemClass).text(Math.ceil(Math.random()*100));
                }
                else{
                    $element.find(plugin.settings.itemClass).text(timer);
                }
            }
            if(init_value < 5){
                timer += 0.10;
                timer = parseFloat(timer.toFixed(2));
            }
             else
                timer++;
            if(timer*gap >=  plugin.settings.duration || timer >= init_value ){
                 clearInterval(random_number);
                 if($element.find(plugin.settings.itemClassIcon).size()){
                     $element.find(plugin.settings.itemClassIcon).removeClass('anim');
                 }
                 else{
                      $element.find(plugin.settings.itemClass).text(init_value);
                 }
            }
        }, gap);
    }
    plugin.init();
 }

 // add the plugin to the jQuery.fn object
 $.fn.counter = function(options) {

    // iterate through the DOM elements we are attaching the plugin to
    return this.each(function() {

      // if plugin has not already been attached to the element
      if (undefined == $(this).data('counter')) {


          var plugin = new $.counter(this, options);

          $(this).data('counter', plugin);

       }

    });
}
})(jQuery);

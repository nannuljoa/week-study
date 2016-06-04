var demoon = demoon || {};

demoon.slide = (function ($){
	var detect = {};

	function init() {


	}

	function setup() {


	}

	function up() {
		if(detect.current + 1 > detect.max) {
			return;
		}
		slide(detect.current + 1);
	}

	function down() {
		if(detect.current - 1 < detect.min) {
			return;
		}
		slide(detect.current -1);
	}

	function direction(num) {
		return detect.current > num ? 'up' : 'down';
	}

	function slideEnd(index) {

	}

	function slide(index, speed) {
		if((index == detect.current) || (index > detect.max)) {
			return;
		}

		if(detect.viewListItem.is(':animated')) {
			return;
		}

		var to = direction(index),
			value;

		speed = speed == 0 ? 0 : 400;

		switch(to) {
			case 'down' :
				value = -detect.height;
				break;

			case 'up' :
				value = detect.height;
				break;

		}

		detect.viewListItem.eq(index).css({'top' : -value}, speed).addClass('active');
		detect.viewListItem.eq(index).animate({'top' : 0}, speed);

		detect.viewListItem.eq(detect.current).animate({'top' : value}, speed, function(){
			slideEnd(index);
		});

	}

	init();

	$(document).on('click', 'data-ui-slide .controller .btn', function (e){
		e.preventDefault();
		slide($(this).data('idx'));

	});

}(window.jQuery));
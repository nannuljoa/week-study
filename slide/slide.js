/**
 * Created by MOON KYUNGTAE
 */

function slide(container, options) {
	if(!container.length){
		return;
	}
	
	var detect = {
		isPlay: false,
		style: {},
		isInTransition: false,
		
		x: 0,
		pointX: 0
	};
	
	var config = {
		start: 0,
		auto: false
	};
	
	var dirValue = {
		'left': 100,
		'right': -100
	};
	
	$.extend(config, options);
	
	function init() {
		setup();
		
		if(config.auto){
			auto();
		}
		
		$(document)
			.on('click', '[data-ctrl="prev"], [data-slide], [data-ctrl="prev"], [data-ctrl="next"], [data-ctrl="play"], [data-ctrl="stop"]', function (e) {
				e.preventDefault();
			})
			.on('click', '[data-slide]', function () {
				var index = $(this).attr('data-slide');
				if(detect.current == index){
					return;
				}
				slideTo(index);
			})
			.on('click', '[data-ctrl="prev"]', prev)
			.on('click', '[data-ctrl="next"]', next)
			.on('click', '[data-ctrl="play"]', auto)
			.on('click', '[data-ctrl="stop"]', stop);

		touch();
	}

	function touch() {
		$(document).on('touchstart', '.view-item', function(e){
			var point = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
			detect.pointX = point.pageX;
		});

		$(document).on('touchmove', '.view-item', function(e){
			$(this).css({'pointer-events' : 'none'});

			var point = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
			var deltaX = point.pageX - detect.pointX,
				newX;

			detect.pointX = point.pageX;
			detect.distanceX += deltaX;
			newX = detect.x + deltaX;

			$(this).css(detect.style.transform, 'translate3d(' + newX +'px, 0, 0)');
			detect.x = newX;
		});

		$(document).on('touchend touchcancel', '.view-item', function(e){
			$(this).css({'pointer-events' : 'auto'});
		});
	}
	
	function setup() {
		detect.item = container.find(config.item);
		detect.min = 0;
		detect.max = detect.item.length - 1;
		detect.current = config.start;
		detect.item.eq(detect.current).addClass('active');
		
		detect.transform = detect.style['transform'] = demoon.helper.hasProperty('transform');
		detect.style['transitionTimingFunction'] = demoon.helper.hasProperty('transitionTimingFunction');
		detect.style['transitionDuration'] = demoon.helper.hasProperty('transitionDuration');
	}
	
	function next() {
		slideTo(detect.current == detect.max ? detect.min : +detect.current + 1, 'left');
	}
	
	function prev() {
		slideTo(detect.current == detect.min ? detect.max : +detect.current - 1, 'right');
	}
	
	function auto() {
		detect.isPlay = setInterval(next, 1000);
	}
	
	function stop() {
		clearInterval(detect.isPlay);
	}
	
	function direction(num, dir) {
		if(dir){
			return dir;
		}
		
		return detect.current > num ? 'right' : 'left';
	}
	
	function slideTo(index, dir) {
		if(detect.item.is(':animated')){
			return;
		}
		
		var to = direction(index, dir),
			speed = 500,
			func = 'cubic-bezier(0.1, 0.54, 0.4, 1)';
		
		if(detect.transform){
			if(detect.isInTransition){
				return;
			}
			
			detect.isInTransition = true;
			
			detect.item.eq(detect.current).css(detect.style.transitionDuration, speed + "ms");
			detect.item.eq(index).css(detect.style.transitionDuration, speed + "ms");
			detect.item.eq(detect.current).css(detect.style.transitionTimingFunction, func);
			detect.item.eq(index).css(detect.style.transitionTimingFunction, func);
			detect.item.eq(index).css(detect.style.transform, 'translate3d(' + dirValue[to] + '%, 0, 0)').addClass('active');
			
			setTimeout(function () {
				detect.item.eq(index).css(detect.style.transform, 'translate3d( 0, 0, 0)');
				detect.item.eq(detect.current).css(detect.style.transform, 'translate3d(' + -dirValue[to] + '%, 0, 0)');
			}, 10);
			
			detect.item.eq(detect.current).one('transitionend', function () {
				$(this).removeClass('active');
				detect.current = index;
				slideEnd();
				detect.isInTransition = false;
			});
			
		} else {
			
			detect.item.eq(index).addClass('active').css({'left': dirValue[to] + '%'});
			detect.item.eq(index).animate({'left': 0}, speed);
			detect.item.eq(detect.current).animate({'left': -dirValue[to] + '%'}, speed, function () {
				$(this).removeClass('active');
				detect.current = index;
				slideEnd();
			});
		}
	}
	
	function slideEnd() {
		console.log('callback');
	}
	
	init();
	
	return {
		init: init,
		slide: slideTo,
		prev: prev,
		next: next,
		stop: stop,
		auto: auto
	}
}

$(document).ready(function () {
	slide($('.slide-1'), {
		item: '.view-item'
	});
});
function slide(container, options){
	if(!container.length){
	 	return;	
	}

	var detect = {
		isPlay : false,
		style: {},
		isInTransition: false
	};

	var	config = {
		start : 0, 
		auto : false
	};

	var dirValue = {
		'left': 100,
		'right': -100
	};

	$.extend(config, options);

	function setup(){
		detect.item = container.find(config.item);
		detect.min = 0;
		detect.max = detect.item.length -1;
		detect.current = config.start;
		detect.item.eq(detect.current).addClass('active');

		detect.transform = detect.style['transform'] = leesj.helper.hasProperty('transform');
		detect.style['transitionTimingFunction'] = leesj.helper.hasProperty('transitionTimingFunction');
		detect.style['transitionDuration'] = leesj.helper.hasProperty('transitionDuration');
	}

	function init(){
		setup();
		
		$(document)
		.on('click', '[data-slide]', function(e){
			e.preventDefault();
			var index = $(this).attr('data-slide');
			if(detect.current == index){
				return;
			}
			slideTo(index);
		})
		.on('click', '[data-ctrl ="prev"]', function(e){
			e.preventDefault();
			prev();
		})
		.on('click', '[data-ctrl ="next"]', function(e){
			e.preventDefault();
			next();
		})
		.on('click', '[data-ctrl ="play"]', function(e){
			e.preventDefault();
			auto();
		})
		.on('click', '[data-ctrl ="stop"]', function(e){
			e.preventDefault();
			stop();
		});

		if(config.auto){
			auto();
		}
	}

	function next(){
		slideTo(detect.current == detect.max ? detect.min : +detect.current +1, 'left');
	}

	function prev(){
		slideTo(detect.current == detect.min ? detect.max : +detect.current -1, 'right');
	}

	function auto(){
		detect.isPlay = setInterval(next, 1000);
	}

	function stop(){
		clearInterval(detect.isPlay);
	}

	function play(){

	}

	function slideTo(index, dir){
		if(detect.item.is(':animated')){
			return;
		}

		var to = direction(index, dir);
		var	speed = 500;
		func = 'cubic-bezier(0, 1.97, 1,-0.51)';

		if(detect.transform){
			if(detect.isInTransition){
				return;
			}

			detect.isInTransition = true; 
			detect.item.eq(detect.current).css(detect.style.transitionDuration, speed + 'ms');
			detect.item.eq(index).css(detect.style.transitionDuration, speed + 'ms');
			detect.item.eq(detect.current).css(detect.style.transitionTimingFunction, func);
			detect.item.eq(index).css(detect.style.transitionTimingFunction, func);
			detect.item.eq(index).css(detect.style.transform, 'translate3d(' + dirValue[to] + '%, 0, 0').addClass('active');

			setTimeout(function(){
				detect.item.eq(index).css(detect.style.transform, 'translate3d(0, 0, 0)');
				detect.item.eq(detect.current).css(detect.style.transform, 'translate3d(' + -dirValue[to] + '%, 0, 0');
			}, 10);

			detect.item.eq(detect.current).one('transitionend', function(){
				$(this).removeClass('active');
					detect.current = index;
					slideEnd();
					detect.isInTransition = false;
			});

		} else {
			detect.item.eq(index).addClass('active').css({'left': dirValue[to] + '%'});
			detect.item.eq(index).animate({'left': 0}, speed);
			detect.item.eq(detect.current).animate({'left': -dirValue[to] + '%'}, speed, function(){
				$(this).removeClass('active');
				detect.current = index;
				slideEnd();
			});
		}
	}

	function direction(num, dir){
		if(dir){
			return dir;
		}
		return detect.current > num ? 'right' : 'left';
	}

	function slideEnd(){
		console.log('callback');
	}

	init();

}

$(document).ready(function(){
	slide($('.slide-1'), {
		item : '.item',
		auto: false
	});
});
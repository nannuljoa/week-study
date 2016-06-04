/**
 * Created by MOON KYUNG TAE
 * 접근성 관련 포커스 강제 이동
 */
demoon.accessibilityFocus = (function ($) {
	$(document).on('keydown', '[data-ui-focus-prev], [data-ui-focus-next]', function (e) {
		var next = $(e.target).attr('data-ui-focus-next'),
			prev = $(e.target).attr('data-ui-focus-prev'),
			target = next || prev || false;
		
		if(!target || e.keyCode != 9){
			return;
		}
		
		if((!e.shiftKey && !!next) || (e.shiftKey && !!prev)){
			e.preventDefault();
			$('[data-ui-focus-id="' + target + '"]').focus();
		}
	});
}(window.jQuery));

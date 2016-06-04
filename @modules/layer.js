/**
 * Created by MOON KYUNG TAE
 * layer popup
 * @type {{open, close}}
 */

demoon.layerPopup = (function ($){
	var layerSection = $('#layer-section');
	if(layerSection.length < 1){
		return;
	}
	
	var layerDataStore = {},
		openHistory = new demoon.helper.Stack(),
		openList = new demoon.helper.List();
	
	function addData(html){
		layerDataStore['#' + $(html).attr('id')] = $(html);
	}
	
	function open(template){
		addData(template);
		showLayer(false, '#' + $(template).attr('id'));
	}
	
	function isOpen(){
		return layerSection.find('.layer').length > 0;
	}
	
	function close(hideId){
		hideLayer(false, hideId);
	}
	
	function showLayer(e, layerId){
		var showId;
		
		if(e){
			e.preventDefault();
			showId = demoon.helper.getBtnTarget(e.target);
		} else {
			showId = layerId;
		}
		
		if(openList.find(showId) > -1){
			return;
		}
		
		layerSection.append(layerDataStore[showId])
			.addClass('active');
		
		$(layerDataStore[showId]).addClass('on').focus();
		
		openList.add(showId);
		openHistory.add($(e.target));
	}
	
	function hideLayer(e, hideID){
		hideID = hideID || "#" + $(this).parent().attr('id');
		openList.remove(hideID);
		$(hideID).remove();
		
		if(!isOpen()){
			layerSection.removeClass('active');
		}
		
		if(e){
			e.preventDefault();
			openHistory.get().focus();
		}
	}
	
	function initOpen(){
		$('[data-ui-layer-open]').each(function (){
			if($(this).attr('data-ui-layer-open') === 'false'){
				return;
			}
			$(this).trigger('click.demoon.layerPopup');
		});
	}
	
	layerSection.find('.layer').each(function (){
		addData(this);
		$(this).remove();
	});
	
	$(document).on('click.demoon.layerPopup', '[data-ui-layer-open]', showLayer);
	$(document).on('click.demoon.layerPopup', '.btn-layer-close', hideLayer);
	
	initOpen();
	
	return {
		open: open,
		close: close
	}
}(window.jQuery));
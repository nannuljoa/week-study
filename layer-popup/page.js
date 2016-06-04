/**
 * Created by MOON KYUNG TAE
 */

function init(){
	$.ajax({
		url: "sample.html"
	}).done(function (html){
		demoon.layerPopup.open(html);
	});
}

$(document).ready(function (){
	// init();
});

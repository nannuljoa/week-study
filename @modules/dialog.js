/**
 * version -
 * module name : dialog
 */
(function ($) {
	var pluginName = 'dialog';

	function Plugin(node, param) {
		this.obj = node;
		this.options = $.extend({}, this.defaults, param);
		this.detect = {
			modalLayer: null,
			modalContent: null,
			modalBg: null,
			closeButton: null,
			modalWidth: 0,
			modalHeight: 0,
			documentWidth: 0,
			documentHeight: 0,
			screenWidth: 0,
			screenHeight: 0,
			PositionTop: 0,
			offsetTop: 0,
			isInShow: false,
			select: null,
			selectButton: null
		};
		this._init();
	}

	Plugin.prototype = {
		defaults: {
			opacity: 0.75,
			dim: true,
			start: 'center',
			end: 'center',
			showType: 'show',
			hideType: 'hide',
			select: null,
			button: null,
			speed: 250
		},

		_addEvent: function (element, type, fn, scope) {
			element.on(type, function (e) {
				fn.call(scope, e);
			});
		},

		_removeEvent: function (element, type) {
			element.off(type);
		},

		_setEvents: function () {
			this._addEvent(this.detect.openButton, 'click', this._show, this);
			this._addEvent(this.detect.closeButton, 'click', this._hide, this);

			if (isMobile) {
				if (this.options.dim) {
					this._addEvent(this.detect.modalBg, 'touchend', this._hide, this);
					this._addEvent(this.detect.modalBg, 'touchmove', this._move, this);
				}
				this._addEvent($(window), 'orientationchange', this._orientation, this);
			} else {
				if (this.options.dim) {
					this._addEvent(this.detect.modalBg, 'click', this._hide, this);
				}
				this._addEvent($(window), 'resize', this._resize, this);
			}

			if (this.detect.select) {
				this._addEvent(this.detect.selectButton, 'click', this._select, this);
			}
		},

		_init: function () {
			this._setModal();
			this._detect();
			this._setEvents();
		},

		_setModal: function () {
			this.detect.modalLayer = $(this.obj);
			this.detect.modalContent = this.detect.modalLayer.find(this.detect.modalLayer.data('content'));
			this.detect.openButton = $(this.detect.modalLayer.data('openButton'));
			this.detect.closeButton = this.detect.modalLayer.find(this.detect.modalLayer.data('closeButton'));

			if (this.detect.modalLayer.data('select')) {
				this.detect.select = this.detect.modalLayer.find(this.detect.modalLayer.data('select'));
				this.detect.selectButton = this.detect.modalLayer.find(this.detect.modalLayer.data('selectButton'));
			}

			if (this.options.dim) {
				this.detect.modalLayer.prepend('<div class="modal-dim" style="display:none;position:fixed;top:0;left:0;backface-visiblity:hidden;width:10000px;height:10000px;z-index:99999;background:#000;opacity:' + this.options.opacity + '"></div>');
				this.detect.modalBg = this.detect.modalLayer.find('.modal-dim');
			}
		},

		_detect: function () {
			this.detect.modalWidth = this.detect.modalContent.outerWidth();
			this.detect.modalHeight = this.detect.modalContent.outerHeight();
			this.detect.documentWidth = $('body').outerWidth();
			this.detect.documentHeight = $('body').outerHeight();
			this.detect.screenWidth = $(window).width();
			this.detect.screenHeight = $(window).height();
			this.detect.offsetTop = (this.detect.screenHeight - this.detect.modalHeight) / 2;
		},

		_show: function (e) {
			e.preventDefault();
			if (this.isInShow) {
				return;
			}

			var initPositonX,
				initPositonY,
				movePositonX,
				movePositonY,
				speed,
				absolutePosition,
				start,
				showType,
				toBe = ($(window).scrollTop() + this.detect.offsetTop) < 0 ? 0 : $(window).scrollTop() + this.detect.offsetTop;

			this.isInShow = true;

			this._addEvent($(window), 'keydown', this._esc, this);

			if (this.options.dim) {
				this.detect.modalBg.show();
			}

			start = $(e.target).data('start') ? $(e.target).data('start') : this.options.start;
			showType = $(e.target).data('show') ? $(e.target).data('show') : this.options.showType;

			switch (start) {
				case 'center':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = toBe;
					movePositonY = initPositonY;
					absolutePosition = initPositonY;
					speed = 0;
					break;

				case 'top':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = -this.detect.modalHeight;
					movePositonY = this.detect.offsetTop;
					absolutePosition = toBe;
					speed = this.options.speed;
					break;

				case 'bottom':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = this.detect.screenHeight;
					movePositonY = this.detect.offsetTop;

					absolutePosition = toBe;
					speed = this.options.speed;
					break;

				case 'left':
					initPositonX = -((this.detect.screenWidth / 2) + this.detect.modalWidth);
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = this.detect.offsetTop;
					movePositonY = this.detect.offsetTop;
					absolutePosition = toBe;
					speed = this.options.speed;
					break;

				case 'right':
					initPositonX = this.detect.screenWidth / 2;
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = this.detect.offsetTop;
					movePositonY = this.detect.offsetTop;
					absolutePosition = toBe;
					speed = this.options.speed;
					break;
			}

			this.obj.data('openLayer', this);
			this.obj.data('opener', $(e.target));

			this._motion.start.call(this, showType, initPositonX, initPositonY, movePositonX, movePositonY, speed, absolutePosition);
		},

		_hide: function () {
			if (!this.isInShow || this.detect.modalContent.is(":animated")) {
				return;
			}
			this._removeEvent($(window), 'keydown');

			var initPositonX,
				initPositonY,
				movePositonX,
				movePositonY,
				speed,
				end,
				hideType,
				current = this.detect.modalContent.offset().top - $(window).scrollTop();

			end = this.obj.data('opener').data('end') ? this.obj.data('opener').data('end') : this.options.end;
			hideType = this.obj.data('opener').data('hide') ? this.obj.data('opener').data('hide') : this.options.hideType;

			switch (end) {
				case 'center':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = current;
					movePositonY = current;
					speed = 0;
					break;

				case 'top':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = current;
					movePositonY = -this.detect.screenHeight;
					speed = this.options.speed;
					break;

				case 'bottom':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = -(this.detect.modalWidth / 2);
					initPositonY = current;
					movePositonY = this.detect.screenHeight;
					speed = this.options.speed;
					break;

				case 'left':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = -((this.detect.screenWidth / 2) + this.detect.modalWidth);
					initPositonY = current;
					movePositonY = current;
					speed = this.options.speed;
					break;

				case 'right':
					initPositonX = -(this.detect.modalWidth / 2);
					movePositonX = this.detect.screenWidth / 2;
					initPositonY = current;
					initPositonY = current;
					speed = this.options.speed;
					break;
			}
			this._motion.end.call(this, hideType, initPositonX, initPositonY, movePositonX, movePositonY, speed);
			this.obj.data('openLayer', null);
			this.obj.data('opener', null);

			if (this.detect.select) {
				this._getValue();
			}
		},

		_motion: {
			start: function (showType, initPositonX, initPositonY, movePositonX, movePositonY, speed, absolutePosition) {
				var scope = this,
					showSpeed = showType == 'show' ? 0 : 400;

				this.detect.modalContent.css({
					'top': initPositonY,
					'left': '50%',
					'margin-left': initPositonX + "px"
				});
				this.detect.modalContent[showType](showSpeed, function () {
					scope._showCallback();
				});
				this.detect.modalContent.animate({
					'top': movePositonY,
					'left': '50%',
					'margin-left': movePositonX + "px"
				}, {
					duration: speed,
					queue: false,
					complete: function () {
						scope.detect.modalContent.css({
							'top': absolutePosition,
							'position': 'absolute'
						});
					}
				});
			},

			end: function (hideType, initPositonX, initPositonY, movePositonX, movePositonY, speed) {
				var scope = this,
					hideSpeed = (hideType == 'hide') ? 0 : 400,
					delay = (hideType == 'hide') ? speed : 0;

				this.detect.modalContent.css({
					'position': 'fixed',
					'top': initPositonY,
					'left': "50%",
					'margin-left': initPositonX + "px"
				});
				this.detect.modalContent.delay(delay)[hideType](hideSpeed, function () {
					if (scope.detect.modalBg) {
						scope.detect.modalBg.hide();
					}
					scope.isInShow = false;
					scope._hideCallback();
				});
				this.detect.modalContent.animate({
					'top': movePositonY,
					'left': "50%",
					'margin-left': movePositonX + "px"
				}, {
					duration: speed,
					queue: false
				});
			}
		},

		_showCallback: function () {
			if (this.obj.data('showCallBack')) {
				this.obj.data('showCallBack')();
			}
		},

		_hideCallback: function () {
			if (this.obj.data('hideCallBack')) {
				this.obj.data('hideCallBack')();
			}
		},

		_select: function (e) {
			e.stopPropagation();
			var clickItem = $(e.target);

			if (clickItem.hasClass('selected')) {
				this._hide();
				return;
			}

			this.detect.selectButton.each(function () {
				$(this).removeClass("selected");
			});

			$(e.target).addClass("selected");

			this._hide();
		},

		_getValue: function () {
			var scope = this;
			this.detect.selectButton.each(function () {
				if ($(this).hasClass('selected')) {
					scope.obj.data('seletedValue', $(this).data('value'));
				}
			});
		},

		_position: function () {
			var topValue = ($(window).scrollTop() + this.detect.offsetTop) < 0 ? 0 : $(window).scrollTop() + this.detect.offsetTop;
			this.detect.modalContent.css({
				'top': topValue,
				'left': "50%",
				'margin-left': -(this.detect.modalWidth / 2)
			});
		},

		_esc: function (e) {
			if (this.detect.modalContent.is(":animated")) {
				return;
			}
			if (e.keyCode != 27) {
				return;
			}
			this._removeEvent($(window), 'keydown');
			this._hide();
		},

		_move: function (e) {
			e.preventDefault();
		},

		_resize: function () {
			this._detect();
			this._position();
		},

		_orientation: function () {
			var scope = this;

			function resize() {
				scope._detect();
				scope._position();
			}

			setTimeout(resize, 100);
		}
	};

	$.fn[pluginName] = function (param) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data(pluginName);
			if (!data) {
				$(this).data(pluginName, new Plugin($this, param));
			}
		});
	};

	$.fn[pluginName].constructor = Plugin;
}(window.jQuery));
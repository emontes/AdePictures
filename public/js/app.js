var ef=jQuery;
	ef.noConflict();

ef(document).foundation();

	/* Static variables/objects/classes */

	var	body_ = ef('body'),
		page_ = ef('#ef-page'),
		head_ = ef('#ef-header'),
		page_head_ = ef('#ef-page-header'),
		full_slider = jQuery('.fireform-slider'),
		video_ = jQuery('.ef-video-bg'),
		overlay_ = ef('.ef-overlay').length ? ef('#ef-slider-overlay') : ef(),
		footer_ = ef('#ef-footer'),
		widgets_tab = ef('#ef-widgets-tab'),
		widgets = ef('#ef-widgets'),
		widgets_pane = ef('#ef-widgets-pane'),
		scrolls_ = body_.add(widgets_pane),
		full_page_class = 'ef-fullwidth-page',
		home_class = 'page-template-templateshome-template',
		blog_class = 'page-template-templatesblog-template',
		portfolio_class = 'page-template-templatesportfolio-template',
		fullscreen_class = 'ef-fullscreen-mode',
		isotope_container = ef('.ef-isotope'),
		portfolio_filter = ef('#ef-filter'),
		finishedMsg_ = body_.hasClass(portfolio_class) ? 'No more photos to load' : 'No more posts to load',
		msgText_ = body_.hasClass(portfolio_class) ? 'Loading the next set of photos' : 'Loading the next set of posts',
		exifSlider = ef('#ef-exif-slider'),
		cForm = ef('#ef-contact-form'),
		nameFieldClass = '.ef-name',
		emailFieldClass = '.ef-email',
		messageFieldClass = '.ef-message',
		support_transitions = Modernizr.csstransitions ? true : false;

	
	/* Helpers */

	ef.fn.global_transition = support_transitions && css_engine ? ef.fn.transition : ef.fn.animate;
	ef.fn.slideshow_transition = (support_transitions && slider_options.css_engine) ? ef.fn.transition : ef.fn.animate;

	var isMobile = Modernizr.touch || ef.browser.mobile || navigator.userAgent.match( /Windows Phone/ ) || navigator.userAgent.match( /Zune/ ),

		fullwidth_height = (function(){
			if ((body_.hasClass(full_page_class) && !body_.hasClass(home_class) && !body_.hasClass('ef-sticky-page')) && ef(window).width() >= 801) {
				page_.css({
					minHeight: ef(window).innerHeight()
				});
				if (body_.hasClass('ef-gallery')) {
					ef('.ef-featured-img').css({height: ef(window).innerHeight()-parseInt(page_.css('padding-top'), false)});
				}
			} else {
				page_.css({
					minHeight: ''
				});
				ef('.ef-featured-img').css({
					height: 'auto'
				});
			}
		}),

		niceScroll_pos = (function(){
			if (!body_.hasClass(full_page_class)) {
				ef('#ascrail2000').css({left: page_.outerWidth() + head_.outerWidth()});
			}
		}),

		delay_fn = (function(){
			var timer = 0;
			return function(callback, ms){
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})(),

		vertCenterGallery = (function() {
			ef('.ef-gal-img').each(function() {
				ef(this).css({
					marginTop: (ef(this).parent().parent().height() - ef(this).outerHeight()) / 2
				});
			});
			if (ef(window).width() >= 801) {
				ef('#ef-gallery-wrapper').css({
					marginTop: (ef(window).innerHeight() - ef('#ef-gallery-info-pane').outerHeight() - page_head_.height() - footer_.outerHeight() - ef('#ef-gallery-wrapper').height())/2
				});
			} else {
				ef('#ef-gallery-wrapper').css({
					marginTop: 'auto'
				});
			}
		}),

		resetFlexInterval = (function(_data){
			if (_data.vars.slideshow) {
				clearInterval(_data.animatedSlides);
				_data.animatedSlides = null;
				_data.animatedSlides = setInterval(_data.animateSlides, _data.vars.slideshowSpeed);
				ef('#progress-bar').finish();
			}
		}),

		getSlideCounter = (function(activeIndex, totalLength){
			return (activeIndex+1) + " of " + totalLength;
		}),

		colWidth = (function(){
			var w = ef(window).innerWidth(),
				columnWidth = 0,
				columnNum = 0;

			if (body_.hasClass('ef-classic-blog')) {
				columnNum = 1;
			} else if (body_.hasClass(full_page_class)) {
				if (w <= 1600 && w > 1260) {
					columnNum = 4;
				} else if (w <= 1260 && w > 970) {
					columnNum = 3;
				} else if (w <= 970 && w > 801) {
					columnNum = 2;
				} else if (w <= 801) {
					columnNum = 1;
				} else {
					columnNum = 5;
				}
			} else {
				if (w <= 801) {
					columnNum = 1;
				} else {
					columnNum = 2;
				}
			}

			columnWidth = Math.floor(isotope_container.width()/columnNum);
			ef('.ef-post').each(function() {
				var widt = columnWidth;
				ef(this).css({
					width: widt
				});
			});
			return columnWidth;
		}),

		applyIsotope = (function(){
			isotope_container.isotope({
				resizable: false,
				transformsEnabled: body_.hasClass(blog_class) ? false : true,
				masonry: {
					columnWidth: colWidth()
				}
			});
		});

	ef.fn.percentAge = function(pers){
		ef(this).animate({
			width: '100%'
		}, pers, function(){
			ef(this).css({width: '0px'});
		});
	};

	ef.fn.adjustImagePositioning = function() {
		var wdt = ef(this).parent().width(),
			hgt = ef(this).parent().height();

		ef(this).find('img').each(function(){
			var efimg = ef(this);

			var r_w = hgt / wdt,
				i_w = efimg.width(),
				i_h = efimg.height(),
				r_i = i_h / i_w,
				new_w, new_h, new_left, new_top;

			if (r_w > r_i || !slider_options.cover) {
				new_h = hgt;
				new_w = hgt / r_i;
			} else {
				new_h = wdt * r_i;
				new_w = wdt;
			}

			efimg.css({
				width: new_w,
				height: new_h,
				left: (wdt - new_w) / 2,
				top: (hgt - new_h) / 2
			});
		});
	};

	/* Ultra simple slideshow for portfolio feed */

	ef.fn.fadeShow = (function(){
		return ef(this).each(function() {
			var efthis_ = ef(this),
				slides = efthis_.find('li'),
				lastElem = slides.length-1,
				target,
				triggerIsotope,
				prevItem,
				propIndex = slides.find('img').height()/slides.find('img').width(),
				newFadeShowHeight = (function(){
					efthis_.add(slides).css({
						height: Math.round(slides.width()*propIndex)
					});
				}),
				fadeSpeed = 1000,
				slideInterval = (efthis_.data('interval') && efthis_.data('interval') !== '') ? efthis_.data('interval') : 4000,
				sliderResponse = (function(target) {
					if (efthis_.is(':visible') && triggerIsotope === true) {
						newFadeShowHeight();
						applyIsotope();
					}
					triggerIsotope = false;
					slides.css({zIndex: ''}).eq(target).css({
						display: 'block',
						zIndex: '1',
						opacity: '0'
					}).global_transition({
						opacity: '1'
					}, fadeSpeed, function(){
						prevItem = target === 0 ? slides.eq(lastElem) : ef(this).prev();
						prevItem.css({
							display: 'none'
						});
					});
					slides.removeClass('ef-active-slide').eq(target).addClass('ef-active-slide');
				}),
				sliderTiming = (function() {
					if (efthis_.is(':visible')) {
						target = efthis_.find('.ef-active-slide').index();
						target = target === lastElem ? 0 : target+1;
						sliderResponse(target);
					}
				}),
				timingRun = (function(){
					setInterval(function() {
						sliderTiming();
					},slideInterval);
				}),
				resetTiming = (function() {
					clearInterval(timingRun);
					timingRun = setInterval(function() {
						sliderTiming();
					},slideInterval);
				});

			ef(window).on('smartresize orientationchange', function() {
				newFadeShowHeight();
				triggerIsotope = true;
			});

			slides.first().addClass('ef-active-slide');
			newFadeShowHeight();
			slides.css({position: 'absolute'});
			resetTiming();
		});
	});

	ef.fn.img_loaded = function(){
		var this_i = ef(this);
		ef(this).imagesLoaded(function(){
			this_i.find('.ef-preloader').global_transition({opacity: '0'}, 800, function(){
				ef(this).remove();
			});
		});
	};

	var buildStructure = (function() {

		var add_ctrls = (function(){
			ef('#ef-copyrights').prepend('<div id="ef-slider-controls"><div class="ef-slider-ctrl-inner" style="display: none;"><a id="prevslide" class="icn-ef"></a><div id="slidecounter"></div><a id="nextslide" class="icn-ef"></a></div></div>');
		});

		if (body_.hasClass('fireform-slider')) {

			ef('#ef-header').after('<div class="fireform-slider-wrapper"></div>');

			if (!body_.hasClass(full_page_class)) {
				ef('#ef-page-controls').append('<a href="#" id="ef-tray-button" class="icn-ef disabled"><span id="progress-back"><span id="progress-bar"></span></span></a>');
				if (slider_options.slides.length > 1){
					add_ctrls();
				}
			}

			if (body_.hasClass(home_class) && body_.hasClass(full_page_class)) {
				if (slider_options.slides.length > 1){
					add_ctrls();
				}
			}
		} else if (video_.length) {
			ef('#ef-page-controls').append('<a href="#" id="ef-tray-button" class="icn-ef disabled"><span id="progress-back"><span id="progress-bar"></span></span></a>');
		}

		if (body_.hasClass('fireform-slider') && !body_.hasClass('ef-video-bg')) {

			/* Build main slider structure */

			ef('.fireform-slider-wrapper').html('<div class="fireform-slider-inner"><ul class="slides"></ul></div>');
			ef('<div id="ef-thumb-list"><div id="ef-thumb-list-inner"><ul class="slides"></ul></div></div>').insertAfter('.fireform-slider-wrapper');
			ef.each(slider_options.slides, function(ind) {
				var slide, thumb;
				if (typeof(slider_options.slides[ind].image) !== 'undefined'){
					var img_ = isMobile && ef(window).width() <= 1025 && typeof(slider_options.slides[ind].mobile_image) !== 'undefined' ? slider_options.slides[ind].mobile_image : slider_options.slides[ind].image,
						img_m = slider_options.slides[ind].mobile_image,
						thumb_ = typeof(slider_options.slides[ind].thumb) !== 'undefined' ? slider_options.slides[ind].thumb : img_;

					slide = '<li class="ef-slide"><img src="'+img_+'" alt="" /></li>';
					thumb = '<li class="ef-thumb"><img src="'+thumb_+'" alt="" /></li>';
				}
				ef('.fireform-slider-inner .slides').append(slide);
				ef('#ef-thumb-list-inner .slides').append(thumb);
				ind++;
			});
		}
	});

	fullwidth_height();

	/* Lightbox init */

	var play = false,
		cycle,
		slideSpeed = 4000,
		keycodes = new Array(37, 39),
		runSBslideshow = (function(){
			cycle = setTimeout(function(){
				Shadowbox.next();
			}, slideSpeed);
			ef('#sb-progress').find('span').finish().css({width: '0'}).animate({
				width: '100%'
			}, slideSpeed);
			play = true;
		}),
		stopSlideshow = (function(){
			clearTimeout(cycle);
			ef('#sb-progress').find('span').finish().css({width: '0'});
			ef('#sb-info-inner').removeClass('sb-playing');
			play = false;
		});

	Shadowbox.init({
		overlayOpacity: 0.85,
		viewportPadding: 20,
		continuous: true,
		modal: false,
		enableKeys: true,
		onOpen: function() {

			/* Close button */

			ef('<div id="sb-custom-close">&times;</div>').bind('click', function() {
				Shadowbox.close();
			}).appendTo('#sb-container');

			/* Title */

			var sbTitle = ef('#sb-title').clone();
			ef('#sb-title').remove();
			sbTitle.prependTo('#sb-info');

			/* Navigation */

			ef('<div id="sb-custom-prev"></div><div id="sb-custom-next"></div><div id="sb-custom-play"></div>').appendTo('#sb-info-inner');
			ef('<div id="sb-progress"><span></span></div>').appendTo('#sb-info');
			
			ef('#sb-custom-prev').bind('click', function() {
				Shadowbox.previous();
			});
			ef('#sb-custom-next').bind('click', function() {
				Shadowbox.next();
			});
			ef('#sb-custom-play').bind('click', function() {
				_this = ef(this);
				if (play === false) {
					runSBslideshow();
					_this.parent().addClass('sb-playing');
					ef(document).bind('keydown', function(e) {
						if (ef.inArray(e.which, keycodes) > -1) stopSlideshow();
					});
				} else {
					stopSlideshow();
				}
			});
			ef('#sb-title, #sb-custom-close, #sb-info-inner').css({display: 'block'});
		},
		onFinish: function(){
			ef('#sb-container').addClass('sb-opened');
			if (play === true) runSBslideshow();
		},
		onClose: function(){
			stopSlideshow();
			ef('#sb-container').removeClass('sb-opened');
			ef('#sb-custom-prev, #sb-progress, #sb-custom-next, #sb-custom-play, #sb-custom-close').remove();
			ef('#sb-custom-close, #sb-info-inner, #sb-title').css({display: 'none'});
		},
		displayNav: false
	});

ef(document).ready(function() {

	/* Replace *.svg to *.png in old browsers. Make sure you have 2 copies (svg+png) if you use svg on your site */

	if (!Modernizr.svg) {
		ef('img[src*="svg"]').attr('src', function() {
			return ef(this).attr('src').replace('.svg', '.png');
		});
	}

	/* Lightbox requires rel attribute, but it isn't valid in this context, so... */

	ef('a[data-sbrel]').each(function() {
		ef(this).attr('rel', ef(this).data('sbrel'));
	});

	/* Portfolio lightbox */

	Shadowbox.setup('.ef-lightbox',{
		gallery: portfolio_group
	});

	/* Html injections */

	buildStructure();

	var tray_button_ = ef('#ef-tray-button');

	/* Preloader */

	ef('.ef-slider-holder, .ef-proj-img').img_loaded();

	/* Fullscreen background video */

	var vid_loaded = (function() {
		tray_button_.removeClass('disabled');
		body_.append('<div id="ef-thumb-list" style="height: 0;"></div>');
		ef('#big-video-wrap').css({
			display: 'block',
			opacity: '0'
		}).global_transition({
			opacity: '1'
		},1000);
		vidDesc();
	});

	if (video_.length && (!body_.hasClass(full_page_class) || body_.hasClass(home_class))) {

		var d = typeof(vids.description) !== 'undefined' ? vids.description : 'top-left',
			pos = typeof(vids.position) !== 'undefined' ? vids.position : '',
			vidDesc = (function(){
				ef('#slide_desc').addClass('ef-'+pos).html(d).css({
					display: 'block',
					opacity: '0'
				}).global_transition({
					opacity: '1'
				},1000);
			});

		if (Modernizr.video && !(isMobile || ef.browser.opera)) {
			var vid_source = vids.mp4V,
				vid_alt_source = Modernizr.video.webm && typeof(vids.webmV) !== 'undefined' ? vids.webmV : '',
				bigVid = new ef.BigVideo({useFlashForFirefox:false});

			bigVid.init();
			bigVid.show(vid_source,{altSource: vid_alt_source, ambient: true});
			var player = bigVid.getPlayer();
			player.on('loadeddata', vid_loaded);

		} else if (typeof(vids.imageV) !== 'undefined') {
			ef('#ef-header').after('<div class="fireform-slider-wrapper"></div>');
			body_.addClass('fireform-slider');
			var vid_img = ef('.fireform-slider-wrapper');
			vid_img.html('<div class="fireform-slider-inner"><img src="'+vids.imageV+'" alt="" /></div>');
			vid_img.imagesLoaded(function(){
				ef('.fireform-slider-inner').css({
					visibility: 'visible',
					opacity: '0',
					overflow: 'hidden'
				}).global_transition({
					opacity: '1'
				},1000).adjustImagePositioning();
				vid_loaded();
			});
		}
	}

	/* Main Nicescroll */

	if (!(isMobile)) {
		body_.niceScroll({
			cursorcolor: main_color_,
			cursorwidth: '10px',
			cursorborder: 'none',
			cursorborderradius: '0',
			autohidemode: body_.hasClass(full_page_class) ? true : false,
			background: body_.hasClass(full_page_class) ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'
		});
		body_.getNiceScroll().hide();
	}

	/* Widgets pane */

	var pane_height = (function(){
		if (Modernizr.mq('only screen and (min-width: 801px)')) {
			widgets.css({
				maxHeight: ef(window).innerHeight()-page_head_.height()-footer_.height()
			});
		} else {
			widgets.css({
				maxHeight: '280px'
			});
		}
	});

	pane_height();

	if (widgets_pane.length) {
		widgets_pane.global_transition({
			y: -widgets_pane.outerHeight()
		},1);

		if (!isMobile) {
			widgets.niceScroll({
				cursorcolor: main_color_,
				cursorwidth: '10px',
				cursorborder: 'none',
				cursorborderradius: '0',
				autohidemode: true,
				background: 'rgba(255,255,255,0.2)'
			}).hide();
		}
	}

	widgets_tab.click(function(a) {
		ef(this).toggleClass('ef-show-widgets');
		if (ef(this).hasClass('ef-show-widgets')) {
			widgets_pane.css({
				display: 'block'
			}).global_transition({
				y: '0px'
			}, 400, "easeOutCubic", function(){
				ef(this).getNiceScroll().show();
				widgets.addClass('w-opened');
			});
		} else {
			widgets.removeClass('w-opened');
			widgets_pane.global_transition({
				y: -widgets_pane.outerHeight()
			}, 400, "easeOutCubic", function(){
				ef(this).css({
					display: 'none'
				});
			}).getNiceScroll().hide();
		}
		
		a.preventDefault();
	});

	ef('html').click(function(a){
		if ( (ef(a.target).closest('#ef-page-header *, #sb-container *').length === 0) && widgets_tab.hasClass('ef-show-widgets') ) {
			widgets_tab.click();
		}
	});

	/* Fullscreen mode */

	if (!body_.hasClass(full_page_class)) {
		var anim_duration = 500;

		tray_button_.click(function() {
			var this_b = ef(this);

			if (support_transitions && css_engine) {

				if (!body_.hasClass(fullscreen_class)) {

					this_b.addClass('disabled');
					body_.css({
						height: '100%'
					}).getNiceScroll().hide();
					footer_.transition({
						y: footer_.height(),
						duration: anim_duration,
						easing: 'easeOutCubic',
						complete: function() {
							ef(this).css({
								display: 'none'
							});
						}
					});
					page_head_.transition({
						opacity: '0',
						left:  body_.hasClass(home_class) ? '' : '-150px',
						y: -page_head_.outerHeight()
					});
					page_.css({
						maxHeight: '100%',
						overflow: 'hidden'
					}).transition({
						y: -ef(window).innerHeight(),
						x: '-150px',
						opacity: '0',
						duration: anim_duration,
						easing: 'easeOutCubic',
						complete: function() {
							if (widgets_tab.hasClass('ef-show-widgets')) {
								widgets_tab.click();
							}
							page_.css({display: 'none'});
							body_.addClass(fullscreen_class);
							head_.transition({
								y: -head_.height(),
								x: '-150px',
								opacity: '0',
								duration: anim_duration,
								easing: 'easeOutCubic',
								complete: function(){
									ef(this).css({
										display: 'none'
									});
									ef('#ef-thumb-list').css({
										visibility: 'visible'
									}).transition({
										y: -ef('#ef-thumb-list').outerHeight(),
										duration: anim_duration,
										easing: 'easeOutCubic',
										complete: function(){
											overlay_.transition({
												opacity: '0',
												complete: function(){
													ef(this).css({
														display: 'none'
													});
												}
											});
											page_head_.css({
												left: '0px'
											}).transition({
												x: '0px',
												y: '0px',
												opacity: '1'
											});
											page_.transition({
												duration: anim_duration,
												complete: function(){
													this_b.removeClass('disabled');
													if (full_slider.length) {
														main_slideshow.parent().css({zIndex: 'auto'});
													}
												}
											});
										}
									});
								}
							});
						}
					});

				} else {
					this_b.addClass('disabled');

					if (full_slider.length) {
						main_slideshow.parent().css({zIndex: ''});
					}

					page_head_.transition({
						y: -page_head_.outerHeight(),
						opacity: '0',
						complete: function() {
							body_.removeClass(fullscreen_class);
							ef(this).css({left: ''});
							ef('#ef-thumb-list').transition({
								y: '0px',
								duration: anim_duration,
								easing: "easeOutCubic",
								complete: function() {
									ef(this).css({
										visibility: 'hidden'
									});
									head_.css({
										display: 'block'
									}).transition({
										y: '0px',
										x: '0px',
										opacity: '1',
										duration: anim_duration,
										easing: "easeOutCubic",
										complete: function() {
											footer_.css({
												display: 'block'
											}).transition({
												y: '0px',
												duration: anim_duration,
												easing: "easeOutCubic"
											});
											page_.css({
												display: 'block'
											}).transition({
												y: '0px',
												x: '0px',
												opacity: '1',
												duration: anim_duration,
												easing: "easeOutCubic",
												complete: function() {
													page_head_.transition({
														y: '0px',
														opacity: '1'
													});
													page_.css({
														overflow: 'visible',
														maxHeight: 'none'
													});
													body_.css({
														height: 'auto'
													}).getNiceScroll().show().resize();
													overlay_.css({
														display: 'block'
													}).transition({
														opacity: '1'
													});
													this_b.removeClass('disabled');
												}
											});
										}
									});
								}
							});
						}
					});
				}

			} else {

				if (!body_.hasClass(fullscreen_class)) {
					this_b.addClass('disabled');
					body_.css({
						height: '100%'
					}).getNiceScroll().hide();
					footer_.animate({
						bottom: -footer_.height()
					}, {
						duration: anim_duration,
						specialEasing: {
							bottom: "easeOutCubic"
						}, complete: function() {
							ef(this).css({
								display: 'none'
							});
						}
					});
					page_head_.animate({
						opacity: '0',
						top: -page_head_.outerHeight()
					}, anim_duration, "easeOutCubic");
					page_.css({
						maxHeight: '100%',
						overflow: 'hidden'
					}).animate({
						top: '-100%',
						opacity: '0',
						left: '-150px'
					}, {
						duration: anim_duration,
						specialEasing: {
							top: "easeInCubic",
							opacity: "easeOutCubic",
							left: "easeInCubic"
						}, complete: function() {
							if (widgets_tab.hasClass('ef-show-widgets')) {
								widgets_tab.click();
							}
							body_.addClass(fullscreen_class);
							head_.animate({
								top: -head_.height(),
								opacity: '0',
								left: '-150px'
							}, {
								duration: anim_duration,
								specialEasing: {
									top: "easeInCubic",
									opacity: "easeOutCubic",
									left: "easeInCubic"
								}, complete: function() {
									ef(this).css({
										display: 'none'
									});
									ef('#ef-thumb-list').css({
										visibility: 'visible'
									}).animate({
										bottom: '0px'
									}, {
										duration: anim_duration,
										specialEasing: {
											bottom: "easeOutCubic"
										}, complete: function(){
											overlay_.fadeOut();
											page_head_.css({left: '0px'}).animate({
												opacity: '1',
												top: '0px'
											});
											page_.animate({
												opacity: '1'
											}, anim_duration);
											this_b.removeClass('disabled');
											if (full_slider.length) {
												main_slideshow.parent().css({zIndex: 'auto'});
											}
										}
									});
								}
							});
						}
					});

				} else {
					this_b.addClass('disabled');

					if (full_slider.length) {
						main_slideshow.parent().css({zIndex: ''});
					}

					page_.css({
						opacity: '0'
					});
					page_head_.animate({
						opacity: '0',
						top: -page_head_.outerHeight()
					}, anim_duration, "easeInCubic");
					ef('#ef-thumb-list').animate({
						bottom: -ef('#ef-thumb-list').outerHeight()
					}, {
						duration: anim_duration,
						specialEasing: {
							bottom: "easeInCubic"
						}, complete: function() {
							body_.removeClass(fullscreen_class);
							ef(this).css({
								visibility: 'hidden'
							});
							head_.css({
								display: 'block'
							}).animate({
								top: '0px',
								opacity: '1',
								left: '0px'
							}, {
								duration: anim_duration,
								specialEasing: {
									top: "easeOutCubic",
									opacity: "easeInCubic",
									left: "easeOutCubic"
								}, complete: function() {
									footer_.css({
										display: 'block'
									}).animate({
										bottom: '0px'
									}, {
										duration: anim_duration,
										specialEasing: {
											bottom: "easeOutCubic",
										}
									});
									page_.animate({
										top: '0px',
										opacity: '1',
										left: '0px'
									}, {
										duration: anim_duration,
										specialEasing: {
											top: "easeOutCubic",
											opacity: "easeInCubic",
											left: "easeOutCubic"
										}, complete: function() {
											page_head_.css({left: ''}).animate({
												opacity: '1',
												top: '0px'
											});
											page_.css({
												overflow: 'visible',
												maxHeight: 'none'
											});
											body_.css({
												height: 'auto'
											}).getNiceScroll().show().resize();
											overlay_.fadeIn();
											this_b.removeClass('disabled');
										}
									});
								}
							});
						}
					});
				}
			}

			return false;

		});
	}
	

	/* Portfolio layout and filtering */

	var toggleFilter = (function(){
		if ( ef('#ef-filter').width() > page_head_.width()-(ef('#ef-page-title').find('span').width()+ef('#ef-page-controls').width()+50) ) {
			ef('#ef-filter').hide();
			ef('.ef-select-menu').show();
		} else {
			ef('#ef-filter').show();
			ef('.ef-select-menu').hide();
		}
	});

	if (isotope_container.length){
		isotope_container.imagesLoaded(function() {
			if (isotope_container.hasClass('ef-portfolio')) {

				ef('.ef-fadeshow').fadeShow();

				if (ef('#ef-filter').length) {
					ef('#ef-filter').mobileMenu({
						defaultText: 'Choose a category...',
						className: 'ef-select-menu',
						subMenuClass: 'dropdown',
						appendMenu: '#ef-select-wrapper'
					}).parent('#ef-select-wrapper').show();
					toggleFilter();
				}

				isotope_container.children('.ef-post').each(function(ii) {
					var elem = ef(this);
					setTimeout(function() {
						elem.addClass('ef-show-item');
					}, 100*ii);
				});

				ef('.ef-select-menu').change(function(){
					var selector = ef(this).find('option:selected').attr('data-filter');
					isotope_container.isotope({
						filter: selector
					}, function(){
						ef('.ef-post').each(function() {
							if (!ef(this).hasClass('isotope-hidden')) {
								ef(this).find('.ef-lightbox').addClass('ef-visible-item');
							} else {
								ef(this).find('.ef-lightbox').removeClass('ef-visible-item');
							}
						});
						Shadowbox.clearCache();
						Shadowbox.setup('.ef-visible-item', {
							gallery: portfolio_group
						});
					});
					ef(window).trigger("resize");
					return false;
				}).change();

				ef('.ef-select-menu').find('option').each(function() {
					if (ef(this).attr('data-filter') !== '*') {
						var _class = ef(this).attr('data-filter').slice(1);
						if (!ef('.ef-post').hasClass(_class)) {
							ef(this).hide().attr('disabled', true).addClass('ef-no-posts');
						}
					}
				});
			}
			applyIsotope();
		});

		portfolio_filter.find('a').click(function(){
			var selector = ef(this).attr('data-filter');
			isotope_container.isotope({
				filter: selector
			}, function(){
				ef('.ef-post').each(function() {
					if (!ef(this).hasClass('isotope-hidden')) {
						ef(this).find('.ef-lightbox').addClass('ef-visible-item');
					} else {
						ef(this).find('.ef-lightbox').removeClass('ef-visible-item');
					}
				});
				Shadowbox.clearCache();
				Shadowbox.setup('.ef-visible-item', {
					gallery: portfolio_group
				});
			});
			ef(window).trigger("resize");
			portfolio_filter.find('a').parent().removeClass('ef-currentClass');
			ef(this).parent().addClass('ef-currentClass');

			return false;
		});

		portfolio_filter.find('a').each(function() {
			if (!ef(this).parent('li').hasClass('ef-all-works')) {
				var _class = ef(this).attr('data-filter').slice(1);
				if (!ef('.ef-post').hasClass(_class)) {
					ef(this).parent('li').hide().addClass('ef-no-posts');
				}
			}
		});

		isotope_container.infinitescroll({
			localMode: 'true',
			navSelector: '#ef-page_nav',
			nextSelector: '#ef-page_nav a',
			itemSelector: '.ef-post',
			loading: {
				selector: 'body',
				finishedMsg: finishedMsg_,
				msgText: msgText_,
				img: '/assets/progress.gif'
			}
		}, function(newElements){
			var _newElems = ef(newElements);
			_newElems.imagesLoaded(function(){
				ef(window).trigger("resize");
				isotope_container.isotope('appended', _newElems, function(){

					var new_ = ef(_newElems);

					ef('.ef-proj-img').img_loaded();
					
					ef('a[data-sbrel]').each(function() {
						ef(this).attr('rel', ef(this).data('sbrel'));
					});

					Shadowbox.setup('.ef-lightbox',{
						gallery: portfolio_group
					});

					if (portfolio_filter.length) {
						portfolio_filter.find('li').each(function() {
							var this_p = ef(this),
								_class = this_p.children('a').attr('data-filter').slice(1);

							if (ef('.ef-post').hasClass(_class)) {
								this_p.show().removeClass('ef-no-posts');
							}
						});

						ef('.ef-select-menu').find('option').each(function() {
							var this_p = ef(this),
								_class = this_p.attr('data-filter').slice(1);

							if (ef('.ef-post').hasClass(_class)) {
								this_p.show().attr('disabled', false).removeClass('ef-no-posts');
							}
						});

						ef('.ef-post').addClass('ef-show-item');

						new_.find('.ef-fadeshow').fadeShow();
					}
				});
			});
		});
	}

	/* Main background slideshow */

	if (body_.hasClass('fireform-slider') && !body_.hasClass('ef-video-bg')) {

		var main_slideshow = ef('.fireform-slider-inner'),
			thumbs = ef('#ef-thumb-list-inner'),
			flexSlider;

		if (slider_options.slides.length <= 1) {
			ef('#ef-thumb-list').css({display: 'none'});
		}

		/* Init */

		main_slideshow.imagesLoaded(function(){

			ef(window).on('smartresize', function() {
				main_slideshow.find('img').css({width: '', height: ''});
				main_slideshow.adjustImagePositioning();
				centerFlexThumbs();
			});

			main_slideshow.flexslider({
				animation: slider_options.transition,
				slideshow: slider_options.auto,
				slideshowSpeed: slider_options.slide_interval,
				animationSpeed: slider_options.transition_speed,
				useCSS: slider_options.css_engine,
				controlNav: false,
				directionNav: false,
				keyboard: true,
				multipleKeyboard: true,
				animationLoop: true,
				pauseOnAction: false,
				reverse: slider_options.reverse,
				start: function(slider){

					flexSlider = slider;

					flexSlider.adjustImagePositioning();
					flexSlider.css({visibility: 'visible', opacity: '0'}).slideshow_transition({
						opacity: '1'
					}, slider_options.slide_interval*0.3);
					tray_button_.removeClass('disabled');
					niceScroll_pos();
					caption(flexSlider.currentSlide);
					ef('.ef-slider-ctrl-inner').css({display: ''});
					ef('#slidecounter').html(getSlideCounter(flexSlider.currentSlide, flexSlider.count));
					thumbs.find('.ef-thumb').first().addClass('flex-active-slide');
					if (flexSlider.vars.slideshow) {
						ef('#progress-bar').percentAge(flexSlider.vars.slideshowSpeed);
					}
				},
				before: function(flexSlider){
					if (isMobile) {
						ef('#slide_desc').css({opacity: '0'});
					} else {
						ef('#slide_desc').slideshow_transition({opacity: '0'});
					}
				},
				after: function(flexSlider){
					if (flexSlider.vars.slideshow) {
						ef('#progress-bar').percentAge(flexSlider.vars.slideshowSpeed);
					}
					caption(flexSlider.currentSlide);
					ef('#slidecounter').html(getSlideCounter(flexSlider.currentSlide, flexSlider.count));
					thumbs.find('.ef-thumb').removeClass('flex-active-slide').eq(flexSlider.data('flexslider').currentSlide).addClass('flex-active-slide');
					if (thumbs.data('flexslider').pagingCount > 1) {
						thumbs.data('flexslider').flexAnimate(flexSlider.currentSlide);
					}

					if (!flexSlider.playing && slider_options.auto) {
						ef('#progress-bar').finish();
						flexSlider.play();
					}
				}
			});
		});

		ef('#prevslide').on('click', function(e){
			e.preventDefault();
			_data = main_slideshow.data('flexslider');
			_data.flexAnimate(_data.getTarget("prev"));
			resetFlexInterval(_data);
		});
		ef('#nextslide').on('click', function(e){
			e.preventDefault();
			_data = main_slideshow.data('flexslider');
			_data.flexAnimate(_data.getTarget("next"));
			resetFlexInterval(_data);
		});

		/* Thumbs */

		var centerFlexThumbs = (function(){
			flexSlider = thumbs.data('flexslider');
			if (thumbs.data('flexslider').pagingCount == 1) {
				flexSlider.find('.ef-thumb').first().css({
					marginLeft: (flexSlider.width()-flexSlider.vars.itemWidth*flexSlider.count)/2
				});
			} else {
				flexSlider.find('.ef-thumb').first().css({
					marginLeft: flexSlider.vars.itemMargin
				});
			}
		});

		thumbs.flexslider({
			animation: 'slide',
			animationLoop: false,
			controlNav: false,
			directionNav: false,
			pauseOnAction: false,
			useCSS: slider_options.css_engine,
			itemWidth: 109,
			itemMargin: 2,
			keyboard: false,
			start: function(flexSlider){
				centerFlexThumbs();
			}
		});

		thumbs.find('.ef-thumb').on('click', function(){
			_data = main_slideshow.data('flexslider');
			_data.flexAnimate(ef(this).index());
			resetFlexInterval(_data);
		});
	}

	/* Main slideshow captions */

	var caption = (function(activeind){

		var positn = slider_options.slides[activeind].position,
			desc_obj = ef('#slide_desc');

		if (desc_obj.length){
			if (slider_options.slides[activeind].description) {

				if (typeof positn !== 'undefined'){
					if (positn == "top-right"){
						desc_obj.removeClass().addClass('ef-top-right');
					} else if (positn == "bottom-right"){
						desc_obj.removeClass().addClass('ef-bottom-right');
					} else if (positn == "bottom-left"){
						desc_obj.removeClass().addClass('ef-bottom-left');
					} else {
						desc_obj.removeClass().addClass('ef-top-left');
					}
				} else {
					desc_obj.removeClass().addClass('ef-top-left');
				}

				desc_obj.html(slider_options.slides[activeind].description).css({display: 'block'});
				var mR,
					mL,
					intV = main_slideshow.parent().width()*0.2,
					trans = slider_options.transition_speed*0.5;

				if (!slider_options.reverse) {
					mR = -intV +'px';
					mL = intV +'px';
				} else {
					mR = intV +'px';
					mL = -intV +'px';
				}

				positn = slider_options.transition == 'fade' ? '' : positn;

				if (support_transitions && slider_options.css_engine) {
					desc_obj.css({transform: 'translate('+mL+', 0)'});
					desc_obj.transition({
						x: '0px', opacity: '1'
					}, trans, slider_options.caption_easing);
				} else {
					if (positn == "top-right" || positn == "bottom-right") {
						desc_obj.css({marginRight: mR});
						desc_obj.animate({
							marginRight: '0px', opacity: '1'
						}, trans, slider_options.caption_easing);
					} else if (positn == "top-left" || positn == "bottom-left") {
						desc_obj.css({marginLeft: mL});
						desc_obj.animate({
							marginLeft: '0px', opacity: '1'
						}, trans, slider_options.caption_easing);
					}
				}

			} else {
				desc_obj.slideshow_transition({opacity: '0'}, slider_options.transition_speed, slider_options.caption_easing, function(){
					ef(this).html('');
				});
			}
		}
	});

	/* Exif slider */

	if (exifSlider.length) {
		exifSlider.flexslider({
			slideshow: false,
			animationLoop: false,
			controlNav: false,
			directionNav: false,
			pauseOnAction: false,
			touch: false
		});
	}

	/* Post slider */

	if (postslider.length) {
		postslider.imagesLoaded(function(){
			postslider.flexslider({
				animation: postslider_options.transition,
				slideshowSpeed: postslider_options.slide_interval,
				animationSpeed: postslider_options.transition_speed,
				slideshow: postslider_options.autoplay,
				animationLoop: true,
				controlNav: false,
				directionNav: false,
				pauseOnAction: false,
				start: function(slider){
					slider.find('img').css({display: 'block'});
					ef(".ef-post-slider-counter").html(getSlideCounter(slider.currentSlide, slider.count));
					ef('.ef-post-slider-ctrls').css({display: 'block'}).global_transition({bottom: '20px'});
				},
				after: function(slider){
					ef(".ef-post-slider-counter").html(getSlideCounter(slider.currentSlide, slider.count));
					if (exifSlider.length) {
						exifSlider.data('flexslider').flexAnimate(slider.currentSlide);
					}
				}
			});

			ef('.post-slider-prev').on('click', function(e){
				e.preventDefault();
				postslider.data('flexslider').flexAnimate(postslider.data('flexslider').getTarget("prev"));

			});
			ef('.post-slider-next').on('click', function(e){
				e.preventDefault();
				postslider.data('flexslider').flexAnimate(postslider.data('flexslider').getTarget("next"));
			});
		});
	}

	/* Gallery */

	var path_ = window.location.pathname,
		circ = parseInt(path_.substring(path_.lastIndexOf('/') + 1).replace(/[A-Za-z$-]/g, ""), false)+1;

	if (gallery.length) {
		gallery.imagesLoaded(function(){
			gallery.flexslider({
				animation: 'slide',
				slideshow: false,
				slideshowSpeed: 4000,
				animationSpeed: gallery_options.transition_speed,
				animationLoop: false,
				controlNav: false,
				directionNav: gallery_options.navigation,
				prevText: gallery_options.prevText,
				nextText: gallery_options.nextText,
				pauseOnAction: false,
				startAt: gallery_options.startAt,
				keyboard: true,
				start: function(slider){
					ef('#ef-gallery-info-pane').css({
						display: 'block'
					});
					vertCenterGallery();
					slider.resize().find('img').each(function(){
						ef(this).attr('data-title', ef(this).attr('title')).removeAttr('title');
					});

					gtitle = slider.slides.eq(slider.currentSlide).find('img').attr('data-title');
					ef('#ef-gallery-title').html(gtitle ? gtitle : '');

					slider.css({visibility: 'visible', opacity: '0'}).global_transition({
						opacity: '1'
					}, 1000);
					ef("#ef-counter").html('[ '+getSlideCounter(slider.currentSlide, slider.count)+' ]');
				},
				before: function(slider){
					slider.find('a').attr('disabled', 'disabled').find('img').addClass('speedup');
				},
				after: function(slider){
					gtitle = slider.slides.eq(slider.currentSlide).find('a').removeAttr('disabled').find('img').attr('data-title');
					ef('#ef-gallery-title').html(gtitle ? gtitle : '');
					slider.find('img').removeClass('speedup');
					ef("#ef-counter").html('[ '+getSlideCounter(slider.currentSlide, slider.count)+' ]');
				},
				end: function(slider) {

					if (circ <= gallery_options.ajaxPages.pages && gallery_options.ajaxPages){

						ef('.pace').css({display: 'block'});

						// Setup an AJAX request

						ef.ajax({
							url: gallery_options.ajaxPages.pageName+circ+'.html',
							cache: false,
							type: 'GET',
							success: function(_data){
								
								var newSlides = ef(_data).find('.ef-slide'),
									newElCount = newSlides.length,
									count = slider.count;

								newSlides.css({opacity: '0'}).imagesLoaded(function(){
									slider.addSlide(newSlides);
									slider.count = count + newElCount;
									slider.last = slider.count - 1;
									slider.find('img').each(function(){
										ef(this).attr('data-title', ef(this).attr('title')).removeAttr('title');
									});

									ef(window).trigger('resize');

									newSlides.delay(500).animate({opacity: '1'}, 1000, function(){
										ef('.pace').css({display: 'none'});
									});

									gallery.data('flexslider').slides.on('click',function() {
										gallery.data('flexslider').flexAnimate(ef(this).index());
									});
									
								});
							}
						});
					}

					circ++;
				}
			});

			gallery.data('flexslider').slides.on('click',function() {
				gallery.data('flexslider').flexAnimate(ef(this).index());
			});
		});

	}

	/* Google maps */

	if (googmap.length) {
		googmap.goMap({
			maptype: "ROADMAP",
			zoom: zoomLevel,
			scaleControl: false,
			navigationControl: false,
			scrollwheel: false,
			mapTypeControl: false,
			mapTypeControlOptions: {
				position: 'RIGHT',
				style: 'DROPDOWN_MENU'
			},
			markers: map_markers,
			hideByClick: true,
			addMarker: false,
			html: {
				popup: false
			}
		});

		ef('.ef-marker').click(function () {
			var str_ = parseInt(ef(this).attr('data-id'), false)-1,
				center_ = new google.maps.LatLng(map_markers[str_]['latitude'], map_markers[str_]['longitude']);

			ef.goMap.map.setCenter(center_);
			ef('.ef-marker').removeClass('ef-currrent-marker');
			ef(this).addClass('ef-currrent-marker');

			return false;
		});
	}

	/* Contact Form init */

	if (cForm.length && body_.hasClass('page-template-templatescontact-template')) {
		cForm.efValidate({
			name: nameFieldClass,
			email: emailFieldClass,
			message: messageFieldClass,
			sliderInput: '.ef-contact-slider',
			formAlert: '.ef-form-alert'
		});
	}

	/* jFlickfeed */

	if (flickr.length) {
		flickr.jflickrfeed({
			limit: amount,
			qstrings: {
				id: flickrId
			},
			itemTemplate: '<li><a class="flickr-gallery-item" href="{{image}}" title="{{title}}" rel="flickr-gallery"><img src="{{image_q}}" alt="{{title}}" /></a></li>'
		}, function(){
			Shadowbox.setup('.flickr-gallery-item',{
				gallery: 'flickr-gallery'
			});
		});
	}
	

	/* Instagram */

	function createPhotoElement(photo) {
		var innerHtml = ef('<img>')
		.addClass('instagram-image')
		.attr('src', photo.images.thumbnail.url);
		innerHtml = ef('<a>')
		.attr('href', photo.images.standard_resolution.url)
		.attr('rel', 'insta-gallery')
		.attr('title', photo.caption !== null ? 'By '+photo.caption.from.full_name : '')
		.addClass('instagram-placeholder')
		.append(innerHtml);

		return ef('<li>')
		.attr('id', photo.id)
		.append(innerHtml);
	}

	function didLoadInstagram(event, response) {
		var that = this;

		if (typeof response.data !== 'undefined') {
			ef.each(response.data, function(i, photo) {
				ef(that).append(createPhotoElement(photo));
			});
		}

		Shadowbox.setup('.instagram-placeholder',{
			gallery: 'insta-gallery'
		});
	}

	if (insta.length) {
		insta.on('didLoadInstagram', didLoadInstagram);
		insta.instagram({
			hash: ihash,
			count: icount,
			clientId: iclientId,
			userId: iuserId,
			accessToken: iaccessToken,
		});
	}

	/* Window resize events */

	ef(window).on('smartresize', function() {
		vertCenterGallery();
		pane_height();
		if (body_.hasClass(fullscreen_class) && Modernizr.mq('only screen and (max-width: 801px)')){
			tray_button_.click();
		}
		applyIsotope();
	});

	ef(window).on('resize', function() {
		ef('.ef-video-bg').find('.fireform-slider-inner').adjustImagePositioning();
		fullwidth_height();
		gallery.trigger('updateSizes');
		toggleFilter();
		if (!isMobile) {
			niceScroll_pos();
			scrolls_.getNiceScroll().hide();
			delay_fn(function(){
				scrolls_.getNiceScroll().show().resize();
			}, 300);
		}
	});
});

ef(window).load(function() {
	if (!isMobile) {
		niceScroll_pos();
		if (!body_.hasClass(full_page_class)) {
			scrolls_.getNiceScroll().show();
		} else {
			ef(document).one('scroll', function(){
				scrolls_.getNiceScroll().show();
			});
		}
		if (ef.browser.msie) {
			ef(window).trigger('resize');
		}
	}
});
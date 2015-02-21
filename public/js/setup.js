/* ------------------------------------------------------------------------------- */
/* ----------------------------- TEMPLATE OPTIONS -------------------------------- */
/* ------------------------------------------------------------------------------- */
	
		/* Global CSS3 transforms/transitions */

	var css_engine = true, // Uses transitions/transforms in modern browsers with css3 support. It's global option for the whole template except main slideshow. It has its own option

		main_color_ = '#4eadc5', // Necessary for replaced scroll

		/* Fullscreen slider */

		slider_options = {
			auto: true,
			transition: 'slide', // 'slide', 'fade'
			cover: true, // set to false if you don't want to apply cropping
			caption_easing: 'easeOutCirc', // linear, easeOutCubic, easeInOutCubic, easeInCirc, easeOutCirc, easeInOutCirc, easeInExpo, easeOutExpo, easeInOutExpo, easeInQuad, easeOutQuad, easeInOutQuad, easeInQuart, easeOutQuart, easeInOutQuart, easeInQuint, easeOutQuint, easeInOutQuint, easeInSine, easeOutSine, easeInOutSine,  easeInBack, easeOutBack, easeInOutBack
			transition_speed: 800, // Animation speed
			slide_interval: 6000, // Set interval in milliseconds
			css_engine: true, // set to false if you want to apply jquery animations
			reverse: false, // Slideshow direction
			slides: [
				{
					image: '/assets/slides/puebla-1.jpg', // Main image (~1600px x Xpx)
					mobile_image: '/assets/slides/puebla-1-small.jpg', // Main image for mobile devices (~700px x Xpx)
					thumb: '/assets/slides/puebla-1-thumb.jpg', // thumbnail (Xpx x 100px)
					description: '<h1>Puebla es el Relicario de América</h1><a href="http://puebla.turista.com.mx" class="btn btn-primary ef-hollow-btn">Conozca Más de Puebla</a>', // Use HTML tags and attributes. !!!All markup should be at one line!!!
					position: 'bottom-right' // position of the description on the page: 'top-left', 'top-right', 'bottom-right', 'bottom-left'
				}, {
					image: '/assets/slides/puebla-2.jpg',
					mobile_image: '/assets/slides/puebla-2-small.jpg',
					thumb: '/assets/slides/puebla-2-thumb.jpg',
					description: '<h1>Necesita Información de Puebla?.</h1><a href="http://puebla.turista.com.mx/pueblainfo.html" class="btn btn-primary ef-hollow-btn">Información de Puebla</a>',
					position: 'bottom-right'
				}, {
					image: '/assets/slides/puebla-3.jpg',
					mobile_image: 'assets/slides/puebla-3-small.jpg',
					thumb: '/assets/slides/puebla-3-thumb.jpg',
					description: '<h1>Si quiere Hospedarse en Puebla.</h1><a href="http://puebla.turista.com.mx/hoteles.html" class="btn btn-primary ef-hollow-btn">Hoteles en Puebla</a>',
					position: 'top-right'
				} // Add new arrays, separated by comma. Do not leave comma after the last array because it will breaks slideshow in Internet Explorer.
			],
		},

		/* Background video */

		// Include all these types for better compatibility with browsers

		vids = {
			mp4V: '/assets/video/HighFalls.mp4.mp4',
			webmV: '/assets/video/HighFalls.webmsd.webm',
			imageV: '/assets/video/HighFalls.jpg',
			description: "<h1>Wow! Video background?<br />Yes, it's responsive and with image fallback, by the way ;)</h1><a href='#' class='btn btn-primary ef-hollow-btn'>Purchase</a>",
			position: 'bottom-right' // Description position: 'top-left', 'top-right', 'bottom-right', 'bottom-left'
		},

		/* Post slider */

		postslider = jQuery('.ef-post-carousel'),
		postslider_options = {
			transition: 'fade', // 'slide', 'fade'
			transition_speed: 800,
			slide_interval: 4000,
			autoplay: false
		},

		/* Gallery */

		gallery = jQuery('#ef-gallery'),
		gallery_options = {
			transition_speed: 800,
			startAt: 1, // Set to 0 if you need to show slideshow from a very first slide
			prevText: "Anterior",
			nextText: "Siguiente",
			navigation: true,
			ajaxPages: {
				pages: 3, /* Change this value to 7 if you have 7 pages gallery-page-[x].html for example */
				pageName: 'gallery-page-' /* Change if your pages were named differently */
			}
		},

		/* Portfolio */

		portfolio_group = 'portfolio-group', // Grouping photos for lightbox

		/* Flickr widget */

		flickr = jQuery('.jflickr'),
		amount = 8, /* Number of photos to show */
		flickrId = '73729109@N02', /* Put your Flickr ID here or get it using http://idgettr.com/ */

		/* Instagram widget. More options here http://potomak.github.io/jquery-instagram/ */

		insta = jQuery('.instagram'),
		ihash = 'nature',
		icount = 4,
		iclientId = '09f224a45ba348989049563ea44ce25a',
		iuserId = 'turistamexico',
		iaccessToken = 'f33cd615e373443b99773cf0bf4455fd',

		/* Google Maps */

		googmap = jQuery('#ef-map'),
		zoomLevel = 19,
		map_markers = [
			{
				latitude: 37.449063,
				longitude: -122.158358,
				id: '1',
				icon: 'assets/map_marker1.png'
			},{
				latitude: 52.515699,
				longitude: 13.397802,
				id: '2',
				icon: 'assets/map_marker2.png'
			}
		];

/* ------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------- */
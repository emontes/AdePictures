var ef=jQuery;
	ef.noConflict();

	/* Variables */

	var accClass = ef(".ef-uiaccordion"),
		tabsClass = ef('.ef-tabs'),
		progressClass = ef('.ef-progress-bar');

	/* Skill graphs */

	var progresss = (function() {
		var delay_ = 0;
		ef(this).find('div').each(function() {
			var lc = ef(this).attr('data-id'),
				pc = lc + '%';
			ef(this).append('<span></span><div><i>' + lc + '</i></div>');
			ef(this).children('div').delay(200).global_transition({
				'width': pc
			}, 1500, 'easeOutExpo', function(){
				ef(this).children().each(function() {
					ef(this).css({display: 'block'}).delay(delay_).global_transition({opacity: '1', top: '-40px'});
					delay_ += 200;
				});
			});
		});
	});


ef(document).ready(function() {

	progressClass.one('inview', progresss);

	/*jQuery UI Accordion*/

	accClass.accordion({
		heightStyle: "content",
		active: 0
	});

	/*jQuery UI Tabs*/

	tabsClass.tabs({
		heightStyle: 'content',
		active: 0
	});

});
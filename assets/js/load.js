(function() {
	var path = '/assets/js/';

	Modernizr.load([
		{
			load: '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
			complete: function () {
				if ( !window.jQuery ) {
					Modernizr.load(path + 'jquery-1.7.1.min.js');
				}
			}
		},
		path + 'init.js'
	]);

}());

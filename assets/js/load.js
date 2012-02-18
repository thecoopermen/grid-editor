(function() {

	var 
	// paths
	libPath   = '/assets/js/libs/',
	assetPath = '/assets/js/',


	// arrays of filenames
	libFiles = [
		'handlebars.js', 
		'underscore.js'
		// 'jquery-ui.min.js'
	],
	assetFiles = [
		'init.js'
	],


	// arrays of filepaths
	libFilePaths   = getFilePaths(libPath, libFiles),
	assetFilePaths = getFilePaths(assetPath, assetFiles);


	// load 'em!
	Modernizr.load([
		{
			// jquery google cdn
			load: '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
			complete: function () {
				// jquery fallback
				if ( !window.jQuery ) {
					Modernizr.load(lib + 'jquery-1.7.1.min.js');
				}
			}
		},
		{
			load: '//ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js'
		},
		{
			load: libFilePaths 
		},
		{
			load: assetFilePaths
		}
	]);

	// path is url, 
	// filenames is an array
	// output is an array
	function getFilePaths(path, filenames) {
		var
		len = filenames.length,
		i = 0,
		files = [];

		for (i; i < len; i++) {
			files.push(path + filenames[i]); 
		}
		return files;
	}

}());



	/* HELPER FUNCTIONS
	--------------------------------------- */

		function checkIsNumber(value) {
			var
			intRegex = /^\d+$/,
			floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;

			if (intRegex.test(value) || floatRegex.test(value)) {
				return true;
			} else {
				return false;
			}
		}

		function getElementsByClass(searchClass,node,tag) {
			var classElements = [];
			if ( node === null )
				node = document;
			if ( tag === null )
				tag = '*';
			var els = node.getElementsByTagName(tag);
			var elsLen = els.length;
			var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
			for (i = 0, j = 0; i < elsLen; i++) {
				if ( pattern.test(els[i].className) ) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		}

		// get one level deep size of any object
		function getSize(obj) {
			var size = 0;

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		}

		// get all one level deep keys in an object
		function getKeys(obj) {
			var keys = [];

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) keys.push(key);

				// if our value is also an object
				if (getSize(obj[key]) > 0) {
				}
			}
			return keys;
		}

		// get all values in an object
		function getValues(obj) {
			values = [];

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) values.push(obj[key]);
			}
			return values;
		}

		// create a DOM element, where attrs is an object literal
		function createElement(tag, className, attrs) {
			var element = document.createElement(tag);

			if (className) {
				element.className = className;
			}

			if (attrs) {
				var 
				key = getKeys(attrs),
				value = getValues(attrs),
				i = 0,
				len = getSize(attrs);

				for (i; i < len; i++) {
					element.setAttribute(key[i], value[i]);
				}
			}
			return element;
		}

		function createElements( tag, obj ) {
			var
			keys = getKeys(obj),
			values = getValues(obj),
			elements = {},
			i = 0,
			len = keys.length;

			for (i; i < len; i++) {
				elements[i] = createElement( tag, values[i] );
			}
			// return an object that contains our new inputs
			return elements;
		}

		// create an input
		function createInput( className, attrs ) {
			if (option.label) {
				var label = createElement( 'label', attrs  );
			}
			var input = createElement( 'input', attrs );
			return input;
		}

		// create an object that contains inputs
		function createFormElements( options ) {
			options = {};
			var inputs = createElements( 'input', obj );
			console.log(inputs);
			if (labels) var labels = createElements( 'label');
			return inputs;
		}

		document.elements.addClass = function(newClassName) {
			var className = this.getAttribute('class');
			if (typeof newClassName === 'string') {
				this.className = newClassName + className;
				return this;
			}
		};

		document.elements.removeClass = function(classNameToRemove) {
			this.className = this.className.replace( /(?:^|\s)classNameToRemove(?!\S)/ , '' );
			return this;
		};

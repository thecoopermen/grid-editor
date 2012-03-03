// Author: Jordan Cooperman
// Contact: jordancooperman@gmail.com, @jordancooperman
// Date: January, 2012


(function() {
	
	var
	layoutWidth = 'layout_width',
	marginWidth = 'margin_width',
	columns = 'columns',

	wrapperElementTag = 'div',
	gridElementTag = 'div';



/* APPLICATION FUNCTIONS
--------------------------------------- */

  function setupInputs() {

		var
		columnAttrs = {
				name: columns,
				id: columns,
				type: 'text',
				value: localStorage.getItem(columns) ? localStorage.getItem(columns) : 8
		},

		layoutWidthAttrs = {
				name: layoutWidth,
        id: layoutWidth,
        type: 'text',
        value: localStorage.getItem(layoutWidth) ? localStorage.getItem(layoutWidth) : 960 
		},

		marginWidthAttrs = {
				name: marginWidth,
        id: marginWidth,
        type: 'text',
        value: localStorage.getItem(marginWidth) ? localStorage.getItem(marginWidth) : 10 
		},

		columnsInput = createElement( 'input', columns, columnAttrs ), 
		columnsLabel = createElement( 'label', 'grid-form-label', {'for': columns}),

		layoutWidthInput = createElement( 'input', layoutWidth, layoutWidthAttrs ),
		layoutWidthLabel = createElement( 'label', 'grid-form-label', {'for': layoutWidth}),

		marginWidthInput = createElement( 'input', marginWidth, marginWidthAttrs ), 
		marginWidthLabel = createElement( 'label', 'grid-form-label', {'for': marginWidth}),

		newGridButton = createElement( 'a', 'new-grid-element', {'href': '#', 'class': 'button right', 'id': 'new-grid-element'} ),
		
		newGridButtonHTML = createElement( 'span', '');
		newGridButtonHTML.innerHTML = 'add grid element';
		gridIcon = createElement('div', '', {'class': ' icon icon-grid'});


		columnsLabel.innerHTML = 'Columns';
		layoutWidthLabel.innerHTML = 'Layout Width';
		marginWidthLabel.innerHTML = 'Margin Width';
		newGridButton.appendChild(gridIcon);
		newGridButton.appendChild(newGridButtonHTML);
		// newGridButton.innerHTML = 'add grid element';

		var
		gridFields = [
			columnsLabel,
			columnsInput,
			layoutWidthLabel,
			layoutWidthInput,
			marginWidthLabel,
			marginWidthInput,
			newGridButton
		],

    // ...and turn them into an object that contains DOM elements
		gridEditor = createElement('div','', {id: 'grid-editor'}),
		wrapper = createElement('div',''),
		form = createElement('form'),
    body = document.getElementsByTagName("body")[0],
    len = gridFields.length,
    i = 0;

		// insert the form inside the body
		body.insertBefore(gridEditor, document.body.firstChild);
		gridEditor.appendChild(wrapper);
		wrapper.appendChild(form);

    for (i; i < len; i++) {
      // ...and insert each input into the form 
			form.appendChild(gridFields[i]);
    }

    setupInputEvents( layoutWidth );
    setupInputEvents( marginWidth );
    setupInputEvents( columns );
		setupGrid();
  }


  // set events for manipulating the grid
  function setupInputEvents( id ) {
    var
    input = document.getElementById( id ),
		value = parseFloat(input.value),
		arrowKey = false;

		routeInput.call(input);

		input.onkeyup = function() {
			if (!arrowKey) {
				value = parseFloat(this.value);
				this.setAttribute('value', value);
				routeInput.call(this); 
			}
		};

		input.onkeydown = function(e) {
			value = parseFloat(this.value);

			if (e.keyCode ==  38) {
				arrowKey = true;
				value++;  // up
			}

			else if (e.keyCode == 40) {
				arrowKey = true;
				value--; // down
			}

			if (arrowKey) {
				arrowKey = false;

				// setting the attribute seems only to work
				// when we're actually typing
				if (value) this.value = value.toString();
				else this.value = 1;
				routeInput.call(this); 
			}
		};
  }


	function setupGrid() {
		var
		gridElements = getGridElements(),
		gridLen = gridElements.length,
		wrappers = getWrapperElements(),
		wrapperLen = wrappers.length,
		i = 0; 

		for (i; i < wrapperLen; i++) {
				wrappers[i].style.marginLeft = 'auto';
				wrappers[i].style.marginRight = 'auto';
				wrappers[i].className = " wrapper group";
		}

		for (i = 0; i < gridLen; i++) {

			// add config element to dom
			var 
			config        = createElement('div', '', {'class': 'grid-element-Config'}),
			configLink    = createElement('div', '', {'class': 'grid-element-config-link'}),
			configOverlay = createElement('div', '', {'class': 'grid-element-config-overlay'});
			configInput   = createElement('input', '', {'class': 'grid-element-config-columns-number'});
			configLabel   = createElement('label', '', {'class': 'grid-element-config-column-number-label'});

			configLabel.innerHTML = 'Columns';
			configOverlay.appendChild(configLabel);
			configOverlay.appendChild(configInput);
			config.appendChild(configLink);
			config.appendChild(configOverlay);
			config.style.display = 'none';

			gridElements[i].appendChild(config);
			gridElements[i].className = " grid";

			gridElements[i].config = config; // save a reference to this elements config
			gridElements[i].configLink = configLink; // save a reference to this elements config link

			// setup events
			if (gridElements[i].addEventListener) {
				gridElements[i].addEventListener('mouseover', showGridOptions, false);
				gridElements[i].addEventListener('mouseout', hideGridOptions, false);
			}
		}
	}


	function showGridOptions() {
		this.configLink.style.display = 'block';
	}

	function hideGridOptions() {
		this.configLink.style.display = 'none';
	}

  function routeInput() {
		var input;
    // is it a number?
    if (checkIsNumber(this.value)) {
      // which input is it for?
      switch (this.getAttribute('id')) {
        case columns:
					input = columns;
          break;
        case layoutWidth:
					input = layoutWidth;
          break;
        case marginWidth:
					input = marginWidth;
          break;
        default:
          alert('unexpected input id');
      }
    }
		if (input) modifyGridElements.call(this, input);
  }

  function modifyGridElements(input) {
		var
		init,
		gridElements = getGridElements(),
    wrappers = getWrapperElements(),
		margin = getMarginWidth(),
		percentMargin = (margin / getLayoutWidth() * 100) + '%',
		len,
		i = 0;

		// add current input values to localStorage if we have it 
		if (localStorage) {
			if (input == layoutWidth) localStorage.setItem( layoutWidth, this.value );
			else if (input == marginWidth) localStorage.setItem( marginWidth, this.value );
			else if (input == columns) localStorage.setItem( columns, this.value );
		}

		//
		// loop through wrapper elements
		// if editing layout width
		//
		
		if (input == layoutWidth) {
			len = wrappers.length;

			for(i; i < len; i++) {
				wrappers[i].style.width = (getLayoutWidth() + getMarginWidth()*2) + 'px';
			}
		}

		//
		// loop through grid elements
		//
		
		i = 0;
		len = gridElements.length;

		for(i; i < len; i++) {
			if (!init) {
				gridElements[i].style.cssFloat = 'left';
			}

			gridElements[i].style.marginLeft = percentMargin;
			gridElements[i].style.marginRight = percentMargin;
      gridElements[i].style.width = ((gridElements[i].getAttribute('data-grid')/getNumberOfCols() * 100) - parseFloat(percentMargin)*2) + '%';
		}
		init = true;
  }

	function getGridElements() {
    var
    divs = document.getElementsByTagName(gridElementTag),
		gridElements = [],
    len = divs.length,
    i = 0;
		
    for(i; i < len; i++) {
      if (divs[i].getAttribute('data-grid')) {
				gridElements.push(divs[i]);
      }
    }
		return gridElements;
	}

	function getWrapperElements() {
    var
    divs = document.getElementsByTagName(wrapperElementTag),
		wrapperElements = [],
    len = divs.length,
    i = 0;
		
    for(i; i < len; i++) {
      if (divs[i].getAttribute('data-gridWrapper')) {
				wrapperElements.push(divs[i]);
      }
    }
		return wrapperElements;
	}

  function getMarginWidth() {
    return parseFloat(document.getElementById(marginWidth).value);
  }

  function getLayoutWidth() {
    return parseFloat(document.getElementById(layoutWidth).value);
  }

	function getNumberOfCols() {
		return parseFloat(document.getElementById(columns).value);
	}

  window.onload = function() {
    setupInputs();
  };
}());

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
				value: localStorage.getItem(columns) ? localStorage.getItem(columns) : 8,
				'class': 'text',
				'data-input': columns
		},

		layoutWidthAttrs = {
				name: layoutWidth,
        id: layoutWidth,
        value: localStorage.getItem(layoutWidth) ? localStorage.getItem(layoutWidth) : 960,
				'class': 'text',
				'data-input': layoutWidth
		},

		marginWidthAttrs = {
				name: marginWidth,
        id: marginWidth,
        value: localStorage.getItem(marginWidth) ? localStorage.getItem(marginWidth) : 10,
				'class': 'text',
				'data-input': marginWidth
		},

		columnsInput = createElement( 'input', columns, columnAttrs ), 
		columnsLabel = createElement( 'label', 'grid-form-label', {'for': columns, 'class': 'label'}),

		layoutWidthInput = createElement( 'input', layoutWidth, layoutWidthAttrs ),
		layoutWidthLabel = createElement( 'label', 'grid-form-label', {'for': layoutWidth, 'class': 'label'}),

		marginWidthInput = createElement( 'input', marginWidth, marginWidthAttrs ), 
		marginWidthLabel = createElement( 'label', 'grid-form-label', {'for': marginWidth, 'class': 'label'}),

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

    routeInput( layoutWidthInput );
    routeInput( marginWidthInput );
    routeInput( columnsInput );
		setupGrid();
  }


  // set events for manipulating the grid
  function routeInput( input ) {
    var
		value = parseFloat(input.value),
		arrowKey = false;

		routeInputChange.call(input);

		input.onkeyup = function() {
			if (!arrowKey) {
				value = parseFloat(this.value);
				this.setAttribute('value', value);
				routeInputChange.call(this); 
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
				routeInputChange.call(this); 
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


		var configs = [];

		$(gridElements).each(function(i) {
			$(this).css('float', 'left');

			var 
			$config           = $("<div class='grid-element-config' />"),
			$configLink       = $("<a href='#' class='button grid-element-config-link' />"),
			$configLinkIcon   = $("<span class='icon icon-grid'  />"),
			$configOverlay    = $("<div class='grid-element-config-overlay ui-overlay' />"),
			$configInput      = $("<input class='grid-element-config-columns-number text-contrast' />"),
			$configLabel      = $("<label class='label grid-element-config-column-number-label'>Columns</label>");

			configs.push($config.get(0));

			$configOverlay.append($configLabel);
			$configOverlay.append($configInput);
			$config.append($configLink);
			$config.append($configOverlay);

			// add config element to dom
			$(this)
				.append($config)
				.addClass('grid')
				.hover(addHoverClass, removeHoverClass); 

			$configLink.hover(addHoverClass, removeHoverClass);
			$configLink.append($configLinkIcon);
			$configLink.bind('click', function(e){
				e.preventDefault();
				// $config.toggleClass('s-active');
				$(configs).each(function() {
					if ($config.get(0) === this) {
						$(this).toggleClass('s-active');
					}
					else {
						$(this).removeClass('s-active');
					}
				});
			});

			$(this).attr('data-order', i);
			$configInput.attr('data-input', 'column').val((localStorage.getItem('gridOrder-' + i) !== false ? localStorage.getItem('gridOrder-' + i) : $(this).attr('data-grid')));
			routeInput($configInput.get(0));
		});
	}

	function addHoverClass() {
		$(this).addClass('s-hover');
	}

	function removeHoverClass() {
		$(this).removeClass('s-hover');
	}

  function routeInputChange() {
		var input = false;
    // is it a number?
    if (checkIsNumber(this.value)) {
      // which input is it for?
      switch (this.getAttribute('data-input')) {
				case 'column':
					editGridData(this);
					break;
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

	function editGridData(input) {
		var 
		columns = getNumberOfCols(),
		val = $(input).val() > columns ? columns : $(input).val(),
		$gridElement = $(input).closest('div[data-grid]');

		$(input).val(val);

		$gridElement.attr('data-grid', val);
		modifyGridElements('gridElement', $gridElement.get(0));
	}

  function modifyGridElements(input, el) {
		var
		gridElements,
		gridData,
    wrappers,
		columns,
		margin,
		percentMargin,
		len,
		i,
		gridStore,
		that = this;


		(function(input, el) {
			gridElements = getGridElements();
			gridData = false;
			wrappers = getWrapperElements();
			margin = getMarginWidth();
			columns = getNumberOfCols();
			percentMargin = (margin / getLayoutWidth() * 100) + '%';
			i = 0;

			// add current input values to localStorage if we have it 
			if (localStorage) {
				if (input == layoutWidth) localStorage.setItem( layoutWidth, that.value );
				else if (input == marginWidth) localStorage.setItem( marginWidth, that.value );
				else if (input == columns) localStorage.setItem( columns, that.value );

				if (el) {
					var 
					order = $(el).attr('data-order'),
					gridElementData = $(el).attr('data-grid');

					localStorage.setItem('gridOrder-' + order, gridElementData);
				}
			}

			// loop through wrapper elements if editing layout width
			if (input == layoutWidth) {
				len = wrappers.length;

				for(i; i < len; i++) {
					wrappers[i].style.width = (getLayoutWidth() + getMarginWidth()*2) + 'px';
				}
			}

			// loop through grid elements
			i = 0;
			len = gridElements.length;

			for(i; i < len; i++) {
				if (localStorage.getItem('gridOrder-' + i)) {
					gridStore = localStorage.getItem('gridOrder-' + i);
				}

				gridData = gridElements[i].getAttribute('data-grid') > columns ? columns : gridElements[i].getAttribute('grid-data');

				gridElements[i].style.marginLeft = percentMargin;
				gridElements[i].style.marginRight = percentMargin;
				gridElements[i].style.width = (((gridStore !== false ? gridStore : gridData)/columns * 100) - parseFloat(percentMargin)*2) + '%';
			}
			gridStore = false;

		}(input, el));

  }


  window.onload = function() {
    setupInputs();
  };
}());

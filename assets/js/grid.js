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
				value: localStorage.getItem(columns) ? localStorage.getItem(columns) : 8
		},

		layoutWidthAttrs = {
				name: layoutWidth,
				value: localStorage.getItem(layoutWidth) ? localStorage.getItem(layoutWidth) : 960 
		},

		marginWidthAttrs = {
				name: marginWidth,
				value: localStorage.getItem(marginWidth) ? localStorage.getItem(marginWidth) : 10 
		},

		$columnsInput = $("<input class='text' />")
			.attr(columnAttrs)
			.data('input', 'columns'),

		$columnsLabel = $("<label class='grid-form-label' />")
			.attr('for', 'columns')
			.text('Columns'),

		$layoutWidthInput = $("<input class='text'/>")
			.attr(layoutWidthAttrs)
			.data('input', 'layout_width'),

		$layoutWidthLabel = $("<label class='grid-form-label'/>")
			.attr('for', 'layout_width')
			.text('Layout Width'),

		$marginWidthInput = $("<input class='text'/>")
			.attr(marginWidthAttrs)
			.data('input', 'margin_width'),

		$marginWidthLabel = $("<label class='grid-form-label'/>")
			.attr('for', 'margin_width')
			.text('Margin Width'),

		$gridIcon = $("<div class='icon icon-grid' />"),
		$newGridButtonText = $("<span/>").text('add grid element'),
		$newGridButton = $("<a id='new-grid-element' />")
			.attr({
				'href': '#',
				'class': 'button right'
			})
			.append($gridIcon)
			.append($newGridButtonText);
		
		$newGridButton
			.append($gridIcon)
			.append($newGridButtonText);

		var
		gridFields = [
		],

		$gridEditor = $("<div id='grid-editor'/>"),
		$form = $("<form/>");

		$gridEditor.append($form);
		$('body').prepend($gridEditor);

		$form
			.append($columnsLabel)
			.append($columnsInput)
			.append($layoutWidthLabel)
			.append($layoutWidthInput)
			.append($marginWidthLabel)
			.append($marginWidthInput)
			.append($newGridButton);

		setupInputEvents( layoutWidth );
		setupInputEvents( marginWidth );
		setupInputEvents( columns );
		setupGrid();
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

		$(gridElements).each(function() {
			var 
			$config           = $("<div class='grid-element-config' />"),
			$configLinkButton = $("<div class='config-link-button' />"),
			$configLink       = $("<a href='#' class='icon icon-grid grid-element-config-link' />"),
			$configOverlay    = $("<div class='grid-element-config-overlay button' />"),
			$configInput      = $("<input class='grid-element-config-columns-number text' />"),
			$configLabel      = $("<label class='grid-element-config-column-number-label'>Columns</label>");

			$configOverlay.append($configLabel);
			$configOverlay.append($configInput);
			$config.append($configLink);
			$config.append($configOverlay);

			// add config element to dom
			$(this)
				.append($config)
				.addClass('grid')
				.hover(showGridOptions, hideGridOptions); 

			$configLink.bind('click', function(){
				$configOverlay.toggleClass('s-active');
			});
		});
	}



	function showGridOptions() {
		$(this).addClass('s-hover');
	}



	function hideGridOptions() {
		$(this).removeClass('s-hover');
	}



  // set events for manipulating the grid
  function setupInputEvents( id ) {

    var
    $input = $('input').data('input', id),
		value = parseFloat($input.val()),
		arrowKey = false;

		routeInput.call($input);

		$input.keyup(function() {
			if (!arrowKey) {
				value = parseFloat($(this).val());
				$(this).attr('value', value);
				routeInput.call(this); 
			}
		});

		$input.keydown(function(e) {
			value = parseFloat($(this).val());

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
		});
  }


  function routeInput() {
		var 
		input,
		$this = $(this);

    // is it a number?
    if (checkIsNumber($this.val())) {
      // which input is it for?
      switch ($this.data('input')) {
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
		if (input) modifyGridElements.call($this, input);
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
			if (input == layoutWidth) localStorage.setItem( layoutWidth, this.val() );
			else if (input == marginWidth) localStorage.setItem( marginWidth, this.val() );
			else if (input == columns) localStorage.setItem( columns, this.val() );
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
    return parseFloat($('input').data('input', 'margin_width').val());
  }

  function getLayoutWidth() {
    return parseFloat($('input').data('input', 'layout_width').val());
  }

	function getNumberOfCols() {
		return parseFloat($('input').data('input', 'columns').val());
	}

  window.onload = function() {
    setupInputs();
  };
}());

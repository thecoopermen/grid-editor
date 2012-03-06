
	function getGridElements() {
    var
    divs = document.getElementsByTagName('div'),
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
    divs = document.getElementsByTagName('div'),
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
    return parseFloat(document.getElementById('margin_width').value);
  }

  function getLayoutWidth() {
    return parseFloat(document.getElementById('layout_width').value);
  }

	function getNumberOfCols() {
		return parseFloat(document.getElementById('columns').value);
	}

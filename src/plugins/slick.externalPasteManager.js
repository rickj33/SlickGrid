(function( $ )
{
  // register namespace
  $.extend( true, window, {
    "Slick": {
      "ExternalPasteManager": ExternalPasteManager
    }
  } );

  function ExternalPasteManager( options )
  {

    var _grid;
    var _isDestroyed = false;
    var _self = this;
    var _copiedRanges;
    var _options = options || {};
    var _copiedCellStyleLayerKey = _options.copiedCellStyleLayerKey || "copy-manager";
    var _copiedCellStyle = _options.copiedCellStyle || "copied";
    var _clearCopyTI = 0;
    var _bodyElement = _options.bodyElement || document.body;
    var _onCopyInit = _options.onCopyInit || null;
    var _onCopySuccess = _options.onCopySuccess || null;
    var _ignoreFormatting = _options.ignoreFormatting || [];
    var _textBox;
    var _startTime;
    var _legendContentArea = $( "#legendContentArea" );

    //   var _endTime;

    var keyCodes = {
      'C': 67,
      'V': 86,
      'ESC': 27
    };

    function init( grid )
    {
      _grid = grid;
      _grid.onKeyDown.subscribe( handleKeyDown );

      // we need a cell selection model
      var cellSelectionModel = grid.getSelectionModel();
      if ( !cellSelectionModel )
      {
        throw new Error( "Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())" );
      }

      cellSelectionModel.onSelectedRangesChanged.subscribe( function( e, args )
      {
        _grid.focus();
      } );
      _createTextBox();
    }

    function _createTextBox( innerText )
    {
      _textBox = document.createElement( 'textarea' );
      _textBox.style.position = 'absolute';
      _textBox.style.left = '-1000px';
      _textBox.style.top = document.body.scrollTop + 'px';
      // textArea.value = innerText;
      _bodyElement.appendChild( _textBox );
      _textBox.onpaste = handlePaste

    }

    function destroy()
    {
      if ( _isDestroyed )
      {
        return;
      }
      //keep from re-entrant
      _isDestroyed = true;
      if ( _grid && _grid.onKeyDown )
      {
        _grid.onKeyDown.unsubscribe( handleKeyDown );
      }
      _grid = null;
      _self = null;
      if ( _textBox )
      {
        _bodyElement.removeChild( _textBox );
      }
      _textBox = null;
    }

    function _getDefaultParseOptions( grid )
    {

      //determine if the grid has headers or not
      //determine if the grid is empty, thus append all rows.
      //if the grid is not empty, then need to merge rows/columns
      var header = grid.getDataLength() === 0;
      //if the datalength != 0 then we need to merge rows/cells
      //if header == true, merge == false and vice versa

      return {
        "leadingZeroAsString": true,
        "delimiter": "",
        "header": header,
        "dynamicTyping": true,
        "skipEmptyLines": true,
        "preview": 0,
        "encoding": "",
        "worker": false,
        "comments": "",
        "download": false,
        "merge": !header
      };
    }

    function handlePaste( event )
    {

      var performanceTimes = {
        startTime: _startTime,
        handlePaste: performance.now(),
        getDataFromClipboard: null,
        parseResultsTime: null,
        validateParsingResultsTime: null,
        updateGridDataTime: null,
        stopTime: null

      };

      // var handlePasteStart = performance.now();
      var data = event.clipboardData.getData( "Text" );
      performanceTimes.getDataFromClipboard = performance.now();

      var parsingOptions = _getDefaultParseOptions( _grid );

      var parseResults = _parseData( data, parsingOptions );

      performanceTimes.parseResultsTime = performance.now();

      var validationResult = _validateParsingResults( parseResults );

      performanceTimes.validateParsingResultsTime = performance.now();

      if ( !validationResult.success )
      {

        _self.onValidationError.notify( {validationResult: validationResult} );
        //   displayErrors( validationResult );
        return;
      }

      var cleanedResults = cleanPropertyNames( _grid, parseResults );

      updateGridColumns( _grid, cleanedResults.columns );
      updateGridData( _grid, cleanedResults, parsingOptions.merge );
      performanceTimes.updateGridDataTime = performance.now();
      performanceTimes.stopTime = performanceTimes.updateGridDataTime;

      //    displayTimings( performanceTimes );

      _self.onPasteCells.notify( {
        parseResults: cleanedResults
      } );

    }

    function cleanPropertyNames( grid, parseResults )
    {

      var result = {};
      var columns = parseResults.meta.fields;
      var dataItems = [];
      var newGridColumns = buildNewGridColumns( _grid, columns );

      var columnIds = {};
      //build a lookup object for the property id.
      _.forEach( newGridColumns, function( column )
      {
        columnIds[column.fieldName] = column.propertyId;
      } );

      _.forEach( parseResults.data, function( item )
      {
        var updatedItem = _.mapKeys( item, function( value, key )
        {
          var propIdKey = columnIds[key];
          if ( propIdKey )
          {
            return propIdKey;
          }
          return key;
        } );
        dataItems.push( updatedItem );

      } );

      result.columns = newGridColumns;
      result.dataItems = dataItems;
      return result;
    }

    function buildNewGridColumns( grid, newColumnArray )
    {
      if ( !newColumnArray )
      {
        return null;
      }

      var minPasteColumnStart = _options.startPasteColumn;
      var columns = grid.getColumns();
      var selectedCell = grid.getActiveCell();

      //if the selected cell is less then the min cell number for pasting columns
      // then set the selected cell.cell property to the min coulumn number.
      if ( selectedCell.cell < minPasteColumnStart )
      {
        selectedCell.cell = minPasteColumnStart;
      }

      //determine if we are just pasting / replacing a column.
      //if we are not pasting more columns than already exist and the selected cell/columns is less then the columns
      //than the current column count, then we are not adding any columns.
      if ( (newColumnArray.length < columns.length) && (selectedCell.cell < columns.length) )
      {
        return;
      }

      var newColumnIndex = 0;
      var fieldNameStartValue = 0;
      if ( _options.fieldNameStartValue )
      {
        fieldNameStartValue = _options.fieldNameStartValue;
      }

      for ( var i = 0; i < newColumnArray.length; i++ )
      {

        if ( _.trim( newColumnArray[newColumnIndex] ) !== "" )
        {
          var existingColumnIndex = selectedCell.cell + i;
          var column = null;
          if ( existingColumnIndex < columns.length )
          {
            column = columns[existingColumnIndex];
          } else
          {
            //create a new column.
            column = {};
            columns.push( column );
          }

          if ( column )
          {
            column.id = existingColumnIndex;
            column.propertyId = fieldNameStartValue;
            column.field = fieldNameStartValue;
            column.fieldName = newColumnArray[newColumnIndex];
            column.sortable = true;
            column.resizable = true;
            column.rerenderOnResize = true;
            column.width = 100;
            column.minWidth = 100;
            column.editor = Slick.Editors.Text;

            if ( _options.includeHeaderWhenCopying )
            {
              column.name = newColumnArray[newColumnIndex];
            }
          }
          newColumnIndex++;
          fieldNameStartValue++
        }
      }

      return columns;

    }

    function updateGridColumns( grid, newColumnArray )
    {

      //handle instance where we are not adding any new columns.
      if(newColumnArray && newColumnArray.length > 0)
      {
        grid.setColumns( newColumnArray );
      }

    }


    function _validateParsingResults( parseResults )
    {

      var validationResult = {
        success: true,
        columnErrors: [],
        parsingErrors: [],
        errorMessages : []
      };

      var columns = parseResults.meta.fields;
      var datalength = parseResults.data.length;

      var i = 0;

      //check to ensure all columnNames have a value.
      var colNumber = 0;
      _.forEach( columns, function( column )
      {
        colNumber++;
        var columnName = _.trim( column );
        if ( !columnName )
        {
          validationResult.success = false;

          validationResult.columnErrors.push( 'Column : ' + colNumber.toString() + ' does not have a valid name' );
        }
      } );

      if ( parseResults.errors.length > 0 )
      {
        _.forEach( parseResults.errors, function( error )
        {
          if ( error.code !== "UndetectableDelimiter" && error.type !== "Delimiter" && error.row !== undefined && datalength !== 0 )
          {
            validationResult.parsingErrors.push( error );
            validationResult.success = false;
          }

        } );
      }

      validationResult.errorMessages = buildErrorMessage(validationResult);

      return validationResult;
    }


    function buildErrorMessage( validationResult )
    {
      var errorMessages = [];
      if ( validationResult.success )
      {
        return;
      }
      _.forEach( validationResult.columnErrors, function( colError )
      {
        errorMessages.push( colError );

      } );

      _.forEach( validationResult.parsingErrors, function( parsingError )
      {
        var errorArray = [];
        errorArray.push( 'Error code: ' + parsingError.code );
        errorArray.push( 'Message: ' + parsingError.message );
        errorArray.push( 'Type: ' + parsingError.code.toString() );
        errorArray.push( 'Row: ' + parsingError.row );
        errorArray.push( 'Col: ' + parsingError.index );

        var errorString = errorArray.join( '; ' )
        errorMessages.push( errorString )
      } );

   //  var result =  _.join(errorMessages,'\\n');
     // return result;
      return errorMessages;

    }




    function updateGridData( grid, parseResults, merge )
    {
      var gridData = grid.getData();
      if ( gridData.constructor.name === "DataView" )
      {
        gridData.beginUpdate();
        try
        {
          if ( merge !== true )
          {

            gridData.getItems().length = 0;
            gridData.setItems( parseResults.dataItems )
          } else
          {
            //get the current row and column.
            //get the current row count, and do not allow adding new rows.
            //get the current col count, and do not allow adding new columns.

            var columns = grid.getColumns();
            var currentCell = grid.getActiveCell();
            var startRow = currentCell.row;
            var startColumn = currentCell.cell;

            var maxPastedRows = parseResults.dataItems.length;
            var maxRows = grid.getDataLength();

            var maxColumns = columns.length;

            var maxRowCount = maxRows > maxPastedRows ? maxPastedRows + startRow : maxRows;

            for ( var currentDataRow = startRow; currentDataRow < maxRowCount; currentDataRow++ )
            {
              var dataValues = grid.getDataItem( currentDataRow );

              var updatedValues = parseResults.dataItems[currentDataRow - startRow];
              var rowIds = gridData.mapRowsToIds( [currentDataRow] );
              var dataValueId = rowIds[0];

              //determine the actual number of columns to update
              var maxPastedColumns = _.keys(updatedValues).length;
              var maxColumnCount = maxColumns > maxPastedColumns ? maxPastedColumns + startColumn : maxColumns;

              for ( var currentColumn = startColumn; currentColumn < maxColumnCount; currentColumn++ )
              {
                var propertyName = columns[currentColumn].field
                var updatePropertyValue = updatedValues[currentColumn - startColumn];
                dataValues[propertyName] = updatePropertyValue
              }

              gridData.updateItem( dataValueId, dataValues );
            }
          }
        } finally
        {
          gridData.endUpdate();
        }

        _grid.invalidate();
      }
    }

    function _parseData( textData, parsingOptions )
    {

      // var parsingOptions = _getDefaultParseOptions();
      var parseResults = Papa.parse( textData, parsingOptions );
      //console.log( parseResults );
      return parseResults;

    }

    function handleKeyDown( e, args )
    {

      if ( !_grid.getEditorLock().isActive() || _grid.getOptions().autoEdit )
      {
        if ( e.which == keyCodes.ESC )
        {
          if ( _copiedRanges )
          {
            e.preventDefault();
            clearCopySelection();
            _self.onCopyCancelled.notify( {
              ranges: _copiedRanges
            } );
            _copiedRanges = null;
          }
        }

        if ( e.which == keyCodes.V && (e.ctrlKey || e.metaKey) )
        { // CTRL + V

          _startTime = performance.now();
          _textBox.select();
          //  handlePaste();
          //  var ta = _createTextBox('');
          /*   var parseResults = null;
           setTimeout(function()
           {
           parseResults = handlePaste(_grid, ta);
           }, 200);

           return false;*/
        }
      }
    }

    function clearCopySelection()
    {
      _grid.removeCellCssStyles( _copiedCellStyleLayerKey );
    }


    function addTimingResultToLegend( timingResult )
    {

      var el = createTimingResultElement( timingResult );

      if ( _legendContentArea )
      {
        _legendContentArea.append( el );
      }

    }

    function createTimingResultElement( timingResult )
    {

      var timingElement = document.createElement( 'div' );
      timingElement.className = 'key';

      var descriptionElement = document.createElement( 'div' );
      descriptionElement.className = 'col-md-4';
      descriptionElement.innerHTML = timingResult.description

      var timeElement = document.createElement( 'div' );
      timeElement.className = 'col-md-2"';
      timeElement.innerHTML = timingResult.time

      timingElement.appendChild( descriptionElement );
      timingElement.appendChild( timeElement );

      return timingElement;

    }

    function logTiming( timingDescription, totalTime )
    {
      var message = CreateTimingMessage( timingDescription, totalTime );
      console.log( message );
    }

    function createTimingMessage( timingDescription, totalTime )
    {
      var result = {
        description: '',
        time: '',

        toString: function()
        {
          return this.description + this.time;
        }
      };
      var secs = (totalTime / 1000) % 60;
      var timeString = parseFloat( secs ).toFixed( 4 );
      result.description = timingDescription + ' took ';
      result.time = timeString + ' seconds.'

      //return timingDescription + ' took ' + timeString + ' seconds.';
      return result
    }

    function calculateTimings( performanceTimes )
    {
      var result = {}
      result.totalTime = performanceTimes.stopTime - performanceTimes.startTime;
      result.pasteTime = performanceTimes.handlePaste - performanceTimes.startTime;
      result.getDataFromClipboard = performanceTimes.getDataFromClipboard - performanceTimes.handlePaste;
      result.parseResultsTime = performanceTimes.parseResultsTime - performanceTimes.getDataFromClipboard;
      result.validateParsingResultsTime = performanceTimes.validateParsingResultsTime - performanceTimes.parseResultsTime;
      result.updateGridDataTime = performanceTimes.updateGridDataTime - performanceTimes.validateParsingResultsTime;
      return result;
    }

    function displayTimings( performanceTimes )
    {

      timingsCalc = calculateTimings( performanceTimes );

      var totalTimeDisp = createTimingMessage( 'Total processing time', timingsCalc.totalTime );
      var pasteDataDisp = createTimingMessage( 'Time to paste data', timingsCalc.pasteTime );
      var getDataFromClipboardDisp = createTimingMessage( 'Get Data from Clipboard', timingsCalc.getDataFromClipboard );
      var parseDataDisp = createTimingMessage( 'Time to parse data', timingsCalc.parseResultsTime );
      var validateDataDisp = createTimingMessage( 'Time to validate parsed data', timingsCalc.validateParsingResultsTime );
      var updateGridDisp = createTimingMessage( 'Time to update grid', timingsCalc.updateGridDataTime );
      console.log( totalTimeDisp.toString() );
      console.log( pasteDataDisp.toString() );
      console.log( getDataFromClipboardDisp.toString() );
      console.log( parseDataDisp.toString() );
      console.log( validateDataDisp.toString() );
      console.log( updateGridDisp.toString() );

      addTimingResultToLegend( totalTimeDisp );
      addTimingResultToLegend( pasteDataDisp );
      addTimingResultToLegend( getDataFromClipboardDisp );
      addTimingResultToLegend( parseDataDisp );
      addTimingResultToLegend( validateDataDisp );
      addTimingResultToLegend( updateGridDisp );
    }

    /*  function getDataItemValueForColumn( item, columnDef )
      {
        // If we initialized this with an ignoreFormatting option, don't do fancy formatting
        // on the specified fields (just return the plain JS value)
        for ( var i = 0; i < _ignoreFormatting.length; i++ )
        {
          if ( _ignoreFormatting[i] === columnDef.field )
          {
            return item[columnDef.field];
          }
        }
        if ( _options.dataItemColumnValueExtractor )
        {
          return _options.dataItemColumnValueExtractor( item, columnDef );
        }

        var retVal = '';

        // use formatter if available; much faster than editor
        if ( columnDef.formatter )
        {
          return columnDef.formatter( 0, 0, item[columnDef.field], columnDef, item );
        }

        // if a custom getter is not defined, we call serializeValue of the editor to serialize
        if ( columnDef.editor )
        {
          var editorArgs = {
            'container': $( "<p>" ), // a dummy container
            'column': columnDef,
            'position': {
              'top': 0,
              'left': 0
            } // a dummy position required by some editors
          };
          var editor = new columnDef.editor( editorArgs );
          editor.loadValue( item );
          retVal = editor.serializeValue();
          editor.destroy();
        } else
        {
          retVal = item[columnDef.field];
        }

        return retVal;
      }

      function setDataItemValueForColumn( item, columnDef, value )
      {
        if ( _options.dataItemColumnValueSetter )
        {
          return _options.dataItemColumnValueSetter( item, columnDef, value );
        }

        // if a custom setter is not defined, we call applyValue of the editor to unserialize
        if ( columnDef.editor )
        {
          var editorArgs = {
            'container': $( "body" ), // a dummy container
            'column': columnDef,
            'position': {
              'top': 0,
              'left': 0
            } // a dummy position required by some editors
          };
          var editor = new columnDef.editor( editorArgs );
          editor.loadValue( item );
          editor.applyValue( item, value );
          editor.destroy();
        }
      }*/

    //creates a new text area to paste the clipboard data.

   /* function ParsingException( validationResult )
    {
      this.validationResult = validationResult;
      this.message = "Error parssing the data";
      this.toString = function()
      {
        return this.message;
      };
    }*/


    $.extend( this, {
      "init": init,
      "destroy": destroy,
      "clearCopySelection": clearCopySelection,
      "handleKeyDown": handleKeyDown,

      "onCopyCells": new Slick.Event(),
      "onCopyCancelled": new Slick.Event(),
      "onPasteCells": new Slick.Event(),
      "onValidationError": new Slick.Event()
    } );
  }
})( jQuery );

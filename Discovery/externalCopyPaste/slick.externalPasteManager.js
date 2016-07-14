(function($)
{
  // register namespace
  $.extend(true, window,
  {
    "Slick":
    {
      "ExternalPasteManager": ExternalPasteManager
    }
  });

  function ExternalPasteManager(options)
  {
    /*
     This manager enables users to copy/paste data from/to an external Spreadsheet application
     such as MS-Excel® or OpenOffice-Spreadsheet.

     Since it is not possible to access directly the clipboard in javascript, the plugin uses
     a trick to do it's job. After detecting the keystroke, we dynamically create a textarea
     where the browser copies/pastes the serialized data.

     options:
     copiedCellStyle : sets the css className used for copied cells. default : "copied"
     copiedCellStyleLayerKey : sets the layer key for setting css values of copied cells. default : "copy-manager"
     dataItemColumnValueExtractor : option to specify a custom column value extractor function
     dataItemColumnValueSetter : option to specify a custom column value setter function
     clipboardCommandHandler : option to specify a custom handler for paste actions
     includeHeaderWhenCopying : set to true and the plugin will take the name property from each column (which is usually what appears in your header) and put that as the first row of the text that's copied to the clipboard
     bodyElement: option to specify a custom DOM element which to will be added the hidden textbox. It's useful if the grid is inside a modal dialog.
     onCopyInit: optional handler to run when copy action initializes
     onCopySuccess: optional handler to run when copy action is complete
     ingoreFormatting: optional array to specify fields of columns that ignore all formatters on paste
     */
    var _grid;
    var _self = this;
    var _copiedRanges;
    var _options = options ||
    {};
    var _copiedCellStyleLayerKey = _options.copiedCellStyleLayerKey || "copy-manager";
    var _copiedCellStyle = _options.copiedCellStyle || "copied";
    var _clearCopyTI = 0;
    var _bodyElement = _options.bodyElement || document.body;
    var _onCopyInit = _options.onCopyInit || null;
    var _onCopySuccess = _options.onCopySuccess || null;
    var _ignoreFormatting = _options.ignoreFormatting || [];
    var _textBox;
    var _startTime;
    //   var _endTime;


    var keyCodes = {
      'C': 67,
      'V': 86,
      'ESC': 27
    };

    function init(grid)
    {
      _grid = grid;
      _grid.onKeyDown.subscribe(handleKeyDown);

      // we need a cell selection model
      var cellSelectionModel = grid.getSelectionModel();
      if (!cellSelectionModel)
      {
        throw new Error("Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())");
      }
      // we give focus on the grid when a selection is done on it.
      // without this, if the user selects a range of cell without giving focus on a particular cell, the grid doesn't get the focus and key stroke handles (ctrl+c) don't work
      //noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols
      cellSelectionModel.onSelectedRangesChanged.subscribe(function(e, args)
      {
        _grid.focus();
      });
      _createTextBox();
    }

    function _createTextBox(innerText)
    {
      _textBox = document.createElement('textarea');
      _textBox.style.position = 'absolute';
      _textBox.style.left = '-1000px';
      _textBox.style.top = document.body.scrollTop + 'px';
      // textArea.value = innerText;
      _bodyElement.appendChild(_textBox);
      _textBox.onpaste = handlePaste
        /*function(event){
            var   clipboardContents = event.clipboardData.getData("Text");
            console.log(clipboardContents);
        };*/
        //  _textBox.select();

      // return textArea;
    }

    function destroy()
    {
      if (_grid && _grid.onKeyDown)
      {
        _grid.onKeyDown.unsubscribe(handleKeyDown);
      }
      _grid = null;
      _self = null;
      _bodyElement.removeChild(_textBox);
    }


    function _getParseOptions()
    {
      return {
        "delimiter": "",
        "header": true,
        "dynamicTyping": false,
        "skipEmptyLines": true,
        "preview": 0,
        "encoding": "",
        "worker": false,
        "comments": "",
        "download": false
      };
    }


    function handlePaste(event)
    //function handlePaste(grid, texboxElement)
    {

      var performanceTimes = {
        startTime: _startTime,
        handlePaste: performance.now(),
        getDataFromClipboard: null,
        parseResultsTime: null,
        validateParsingResultsTime: null,
        updateGridDataTime: null,
        stopTime: null

      }

      // var handlePasteStart = performance.now();
      var data = event.clipboardData.getData("Text");
      performanceTimes.getDataFromClipboard = performance.now();

      var parseResults = _parseData(data);
      performanceTimes.parseResultsTime = performance.now();

      var validationResult = _validateParsingResults(parseResults);
      performanceTimes.validateParsingResultsTime = performance.now();

      if (!validationResult.success)
      {
        _self.onValidationError.notify(
        {
          validationResult: validationResult
        });
        return;
      }

      updateGridData(_grid, parseResults)
      performanceTimes.updateGridDataTime = performance.now();
      performanceTimes.stopTime = performanceTimes.updateGridDataTime;

      displayTimings(performanceTimes);
      _self.onPasteCells.notify(
      {
        parseResults: parseResults
      });

    }


    function displayTimings(performanceTimes)
    {
      timingsCalc = calculateTimings(performanceTimes);
      logTiming('Total processing time', timingsCalc.totalTime);
      logTiming('Time to paste data', timingsCalc.pasteTime);
      logTiming('Get Data from Clipboard', timingsCalc.getDataFromClipboard);
      logTiming('Time to parse data', timingsCalc.parseResultsTime);
      logTiming('Time to validate parsed data', timingsCalc.validateParsingResultsTime);
       logTiming('Time to update grid', timingsCalc.updateGridDataTime);

    }

    function logTiming(timingDescription, totalTime)
    {
      console.log(timingDescription + ' took ' + totalTime + ' milliseconds.');
    }

    function calculateTimings(performanceTimes)
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


    function updateGridData(grid, parseResults)
    {
      var gridData = grid.getData();
      if (gridData.constructor.name === "DataView")
      {
        gridData.beginUpdate();
        try
        {
          gridData.getItems().length = 0;
          gridData.setItems(parseResults.data)
        }
        finally
        {
          gridData.endUpdate();
        }

        _grid.render();
      }
    }

    function _parseData(textData)
    {

      var parsingOptions = _getParseOptions();
      var parseResults = Papa.parse(textData, parsingOptions);
      console.log(parseResults);
      return parseResults;

    }



    function _validateParsingResults(parseResults)
    {

      var validationResult = {
        success: true,
        columnErrors: [],
        parsingErrors: []
      };

      var columns = parseResults.meta.fields;

      var i = 0;

      //check to ensure all columnNames have a value.
      var colNumber = 0;
      _.forEach(columns, function(column)
      {
        colNumber++;
        var columnName = _.trim(column);
        if (!columnName)
        {
          validationResult.success = false;

          validationResult.columnErrors.push('Column : ' + colNumber.toString() + ' does not have a valid name');
        }
      });


      if (parseResults.errors.count > 0)
      {
        _.forEach(parseResults.errors, function(error)
        {
          validationResult.parsingErrors.push(error);
          validationResult.success = false;
        });
      }

      //check to ensure there were not any parsing errors in the result.

      return validationResult;
    }



    function handleKeyDown(e, args)
    {

      if (!_grid.getEditorLock().isActive() || _grid.getOptions().autoEdit)
      {
        if (e.which == keyCodes.ESC)
        {
          if (_copiedRanges)
          {
            e.preventDefault();
            clearCopySelection();
            _self.onCopyCancelled.notify(
            {
              ranges: _copiedRanges
            });
            _copiedRanges = null;
          }
        }



        if (e.which == keyCodes.V && (e.ctrlKey || e.metaKey))
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



    function getDataItemValueForColumn(item, columnDef)
    {
      // If we initialized this with an ignoreFormatting option, don't do fancy formatting
      // on the specified fields (just return the plain JS value)
      for (var i = 0; i < _ignoreFormatting.length; i++)
      {
        if (_ignoreFormatting[i] === columnDef.field)
        {
          return item[columnDef.field];
        }
      }
      if (_options.dataItemColumnValueExtractor)
      {
        return _options.dataItemColumnValueExtractor(item, columnDef);
      }

      var retVal = '';

      // use formatter if available; much faster than editor
      if (columnDef.formatter)
      {
        return columnDef.formatter(0, 0, item[columnDef.field], columnDef, item);
      }

      // if a custom getter is not defined, we call serializeValue of the editor to serialize
      if (columnDef.editor)
      {
        var editorArgs = {
          'container': $("<p>"), // a dummy container
          'column': columnDef,
          'position':
          {
            'top': 0,
            'left': 0
          } // a dummy position required by some editors
        };
        var editor = new columnDef.editor(editorArgs);
        editor.loadValue(item);
        retVal = editor.serializeValue();
        editor.destroy();
      }
      else
      {
        retVal = item[columnDef.field];
      }

      return retVal;
    }

    function setDataItemValueForColumn(item, columnDef, value)
    {
      if (_options.dataItemColumnValueSetter)
      {
        return _options.dataItemColumnValueSetter(item, columnDef, value);
      }

      // if a custom setter is not defined, we call applyValue of the editor to unserialize
      if (columnDef.editor)
      {
        var editorArgs = {
          'container': $("body"), // a dummy container
          'column': columnDef,
          'position':
          {
            'top': 0,
            'left': 0
          } // a dummy position required by some editors
        };
        var editor = new columnDef.editor(editorArgs);
        editor.loadValue(item);
        editor.applyValue(item, value);
        editor.destroy();
      }
    }

    //creates a new text area to paste the clipboard data.


    function ParsingException(validationResult)
    {
      this.validationResult = validationResult;
      this.message = "Error parssing the data";
      this.toString = function()
      {
        return this.message;
      };
    }


    function clearCopySelection()
    {
      _grid.removeCellCssStyles(_copiedCellStyleLayerKey);
    }

    $.extend(this,
    {
      "init": init,
      "destroy": destroy,
      "clearCopySelection": clearCopySelection,
      "handleKeyDown": handleKeyDown,

      "onCopyCells": new Slick.Event(),
      "onCopyCancelled": new Slick.Event(),
      "onPasteCells": new Slick.Event(),
      "onValidationError": new Slick.Event()
    });
  }
})(jQuery);
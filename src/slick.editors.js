/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function( $ )
{
  // register namespace
  $.extend( true, window, {
    Slick: {
      Editors: {
        Text: TextEditor,
        Integer: IntegerEditor,
        Date: DateEditor,
        YesNoSelect: YesNoSelectEditor,
        Checkbox: CheckboxEditor,
        PercentComplete: PercentCompleteEditor,
        LongText: LongTextEditor,
        Float: FloatEditor,
        Percentage: PercentageEditor,
        ReadOnly: ReadOnlyEditor,
        Color: ColorEditor,
        SelectCell: SelectCellEditor,

        DataPoint: DataPointTextEditor
      }
    }
  } );

  //noinspection FunctionNamingConventionJS
  function TextEditor( args )
  {

    //noinspection LocalVariableNamingConventionJS
    var scope = this;
    scope.args = args;
    scope.$input = null;

    scope.defaultValue = '';
    scope.isOpen = false;
    // scope.$container = $(scope.args.container);

    scope.init = function()
    {
      scope.$input = $( "<INPUT type=text class='editor-text' />" )
          .appendTo( scope.args.container )
          .bind( "keydown.nav", function( e )
          {
            if ( e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT )
            {
              e.stopImmediatePropagation();
            }
          } )
          .focus()
          .select();
      scope.defaultValue = '';
    };

    scope.destroy = function()
    {
      scope.$input.remove();
    };

    scope.save = function()
    {
      scope.args.commitChanges();
    };

    scope.cancel = function()
    {
      scope.setDirectValue( defaultValue );
      scope.args.cancelChanges();
    };

    scope.hide = function()
    {
      scope.$input.hide();
    };

    scope.show = function()
    {
      scope.$input.show();
    };

    scope.position = function( position )
    {
      // nada
    };

    scope.focus = function()
    {
      scope.$input.focus();
    };

    scope.setDirectValue = function( val )
    {
      if ( val == null )
      {
        val = "";
      }
      scope.defaultValue = val;
      scope.$input.val( val );
      scope.$input[0].defaultValue = val;
    };

    scope.loadValue = function( item )
    {
      scope.setDirectValue( item[scope.args.column.field] );
      scope.$input.select();

    };

    scope.serializeValue = function()
    {

      return scope.$input.val();
    };

    scope.applyValue = function( item, state )
    {
      item[scope.args.column.field] = state;
    };

    scope.isValueChanged = function()
    {
      return (scope.$input.val() != scope.defaultValue);
      //return (!($input.val() == "" && defaultValue == null)) && (scope.$input.val() != scope.defaultValue);
    };

    scope.validate = function()
    {
      if ( scope.args.column.validator )
      {
        var validationResults = scope.args.column.validator( scope.$input.val() );
        if ( !validationResults.valid )
        {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    scope.init();
  }

  //noinspection FunctionNamingConventionJS
  function IntegerEditor( args )
  {
    var scope = this;
    scope.args = args;
    scope.$input = null;

    scope.defaultValue = '';

    scope.init = function()
    {
      scope.$input = $( "<INPUT type=text class='editor-text' />" );

      scope.$input.bind( "keydown.nav", function( e )
      {
        if ( e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT )
        {
          e.stopImmediatePropagation();
        }
      } );

      scope.$input.appendTo( scope.args.container );
      scope.$input.focus().select();
    };

    scope.destroy = function()
    {
      scope.$input.remove();
    };

    scope.save = function()
    {
      scope.args.commitChanges();
    };

    scope.cancel = function()
    {
      scope.setDirectValue( scope.defaultValue );
      scope.args.cancelChanges();
    };

    scope.hide = function()
    {
      scope.$input.hide();
    };

    scope.show = function()
    {
      scope.$input.show();
    };

    scope.position = function( position )
    {
      // nada
    };

    scope.focus = function()
    {
      scope.$input.focus();
    };

    scope.setDirectValue = function( val )
    {
      val = parseInt( val );
      if ( isNaN( val ) )
      {
        val = 0;
      }
      scope.defaultValue = val;
      scope.$input.val( val );
      scope.$input[0].scope.defaultValue = val;
    };

    scope.loadValue = function( item )
    {
      scope.setDirectValue( item[scope.args.column.field] );

      scope.$input.select();
    };

    scope.serializeValue = function()
    {
      return parseInt( scope.$input.val(), 10 ) || 0;
    };

    scope.applyValue = function( item, state )
    {
      item[scope.args.column.field] = state;
    };

    scope.isValueChanged = function()
    {
      return (!(scope.$input.val() == "" && scope.defaultValue == null)) && (scope.$input.val() != scope.defaultValue);
    };

    scope.validate = function()
    {
      if ( isNaN( scope.$input.val() ) )
      {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    scope.init();
  }

  //noinspection FunctionNamingConventionJS
  function DateEditor( args1 )
  {
    var scope = this;
    scope.$input = null;

    scope.args = args1;

    scope.defaultValue = '';

    scope.calendarOpen = false;
    scope.imageDir = scope.args.imagesPath || "../images";
    scope.dateFormat = 0;
    scope.detectablescope.dateFormats = ["yy-mm-dd",   // ISO
      $.datepicker.ISO_8601, $.datepicker.COOKIE, $.datepicker.RFC_1036, $.datepicker.RFC_2822, $.datepicker.RFC_850, $.datepicker.TIMESTAMP, "dd-mm-yyyy",   // European
      "mm/dd/yy",     // US
      "dd-mm-yy",     // European
      $.datepicker.TICKS];
    /* jshint -W069 */     //! jshint : ['...'] is better written in dot notation
    scope.regionSettings = $.datepicker.regional["en"] || $.datepicker.regional;
    /* jshint +W069 */
    scope.datepickerParseSettings = {
      shortYearCutoff: 20,
      dayNamesShort: scope.regionSettings.dayNamesShort,
      dayNames: scope.regionSettings.dayNames,
      monthNamesShort: scope.regionSettings.monthNamesShort,
      monthNames: scope.regionSettings.monthNames
    };
    scope.datePickerOptions = {};
    scope.datePickerDefaultOptions = {
      dateFormat: "yy-mm-dd",                 // this format is used for displaying the date while editing / picking it
      defaultDate: 0,                         // default date: today
      showOn: "button",
      buttonImageOnly: true,
      buttonImage: scope.args.dateButtonImage || (scope.imageDir + "/calendar.png"),
      buttonText: "Select date"
    };
    scope.datePickerDefaultOptions = {
      beforeShow: function()
      {
        scope.calendarOpen = true;
      },
      onClose: function()
      {
        scope.calendarOpen = false;
      }
    };
    // Override DatePicker options from scope.datePickerOptions on column definition.
    // Make sure that beforeShow and onClose events are not clobbered.
    scope.datePickerOptions = $.extend( scope.datePickerOptions, scope.datePickerDefaultOptions, scope.args.column.scope.datePickerOptions,
        scope.datePickerDefaultOptions );

    function parseDateStringAndDetectFormat( s )
    {

      if ( s instanceof Date )
      {
        return s;
      }
      var fmt, d;
      for ( scope.dateFormat = 0; fmt = scope.detectablescope.dateFormats[scope.dateFormat]; scope.dateFormat++ )
      {
        try
        {
          d = $.datepicker.parseDate( fmt, s, scope.datepickerParseSettings );
          break;
        } catch ( ex )
        {
          continue;
        }
      }
      return d || false;
    }

    scope.init = function()
    {
      scope.defaultValue = new Date();
      scope.$input = $( "<INPUT type='text' class='editor-date' />" ).appendTo( scope.args.container ).bind( "keydown.nav", function( e )
      {
        if ( e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT )
        {
          e.stopImmediatePropagation();
        }
      } ).focus().select();
      scope.$input.datepicker( scope.datePickerOptions );
      scope.$input.outerWidth( scope.$input.outerWidth() - 18 );
    };

    scope.destroy = function()
    {
      $.datepicker.dpDiv.stop( true, true );
      scope.$input.datepicker( "hide" );
      scope.$input.datepicker( "destroy" );
      scope.$input.remove();
    };

    scope.save = function()
    {
      scope.args.commitChanges();
    };

    scope.cancel = function()
    {
      scope.setDirectValue( scope.defaultValue );
      scope.args.cancelChanges();
    };

    scope.show = function()
    {
      if ( scope.calendarOpen )
      {
        $.datepicker.dpDiv.stop( true, true ).show();
      }
    };

    scope.hide = function()
    {
      if ( scope.calendarOpen )
      {
        $.datepicker.dpDiv.stop( true, true ).hide();
      }
    };

    /*
     * info: {
     *         gridPosition: getGridPosition(),
     *         position: cellBox,
     *         container: activeCellNode
     *       }
     */
    scope.position = function( position )
    {
      if ( !scope.calendarOpen )
      {
        return;
      }

      $.datepicker.dpDiv.css( "top", position.top + 30 ).css( "left", position.left );

    };

    scope.focus = function()
    {
      scope.$input.focus();
    };

    scope.setDirectValue = function( val )
    {
      val = parseDateStringAndDetectFormat( val );
      /* parseISODate() */
      if ( !val )
      {
        val = new Date();
      }
      scope.defaultValue = val;
      scope.$input.datepicker( "setDate", val );
    };

    scope.loadValue = function( item )
    {
      scope.setDirectValue( item[scope.args.column.field] );

      scope.$input.select();
    };
    scope.serializeValue = function()
    {
      return scope.$input.datepicker( "getDate" );
    };

    scope.applyValue = function( item, state )
    {
      var fmt = scope.detectablescope.dateFormats[scope.dateFormat] || scope.detectablescope.dateFormats[0];
      state = $.datepicker.formatDate( fmt, state ); // state.format('isoDate');
      item[scope.args.column.field] = state;
    };

    scope.isValueChanged = function()
    {
      var d = scope.$input.datepicker( "getDate" );
      return !d || !scope.defaultValue || d.getTime() !== scope.defaultValue.getTime();
    };

    scope.validate = function()
    {
      var d = scope.$input.datepicker( "getDate" );
      if ( !d )
      {
        return {
          valid: false,
          msg: "Please enter a valid date"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    scope.init();
  }

  function YesNoSelectEditor( args1 )
  {
    var scope = this;
    scope.args = args1;

    scope.$select;
    scope.defaultValue;

    scope.init = function()
    {
      scope.$select = $( "<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>" );
      scope.$select.appendTo( scope.args.container );
      scope.$select.focus();
    };

    scope.destroy = function()
    {
      scope.$select.remove();
    };

    scope.save = function()
    {
      scope.args.commitChanges();
    };

    scope.cancel = function()
    {
      scope.setDirectValue( defaultValue );
      scope.args.cancelChanges();
    };

    scope.hide = function()
    {
      $select.hide();
    };

    scope.show = function()
    {
      $select.show();
    };

    scope.position = function( position )
    {
      // nada
    };

    scope.focus = function()
    {
      scope.$select.focus();
    };

    scope.setDirectValue = function( val )
    {
      val = !!val;
      defaultValue = val;
      $select.val( val ? "yes" : "no" );
    };

    scope.loadValue = function( item )
    {
      scope.setDirectValue( item[scope.args.column.field] );
      scope.$select.select();
    };

    scope.serializeValue = function()
    {
      return (scope.$select.val() == "yes");
    };

    scope.applyValue = function( item, state )
    {
      item[scope.args.column.field] = state;
    };

    scope.isValueChanged = function()
    {
      return scope.serializeValue() !== defaultValue;
    };

    scope.validate = function()
    {
      return {
        valid: true,
        msg: null
      };
    };

    scope.init();
  }

  //noinspection FunctionNamingConventionJS
  function CheckboxEditor( args )
  {
    var scope = this;
    scope.args = args;

    scope.$select = null;
    scope.defaultValue = null;

    scope.init = function()
    {
      scope.$select = $( "<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>" );
      scope.$select.appendTo( scope.args.container );
      scope.$select.focus();
    };

    scope.destroy = function()
    {
      scope.$select.remove();
    };

    scope.save = function()
    {
      scope.args.commitChanges();
    };

    scope.cancel = function()
    {
      scope.setDirectValue( scope.defaultValue );
      scope.args.cancelChanges();
    };

    scope.hide = function()
    {
      scope.$select.hide();
    };

    scope.show = function()
    {
      scope.$select.show();
    };

    scope.position = function( position )
    {
      // nada
    };

    scope.focus = function()
    {
      scope.$select.focus();
    };

    scope.setDirectValue = function( val )
    {
      val = !!val;
      scope.defaultValue = val;
      scope.$select.prop( 'checked', val );
    };

    scope.loadValue = function( item )
    {
      scope.setDirectValue( item[scope.args.column.field] );
      scope.$select.select();
    };

    scope.serializeValue = function()
    {
      return scope.$select.prop( 'checked' );
    };

    scope.applyValue = function( item, state )
    {
      item[scope.args.column.field] = state;
    };

    scope.isValueChanged = function()
    {
      return (scope.serializeValue() !== scope.defaultValue);
    };

    scope.validate = function()
    {
      return {
        valid: true,
        msg: null
      };
    };

    scope.init();
  }

  //noinspection FunctionNamingConventionJS
  function PercentCompleteEditor( args1 )
  {
    var scope = this;
    scope.args = args1;

    scope.defaultValue;
    scope.$input, scope.$picker;
    scope.$helper
    scope.defaultValue;

    scope.init = function()
    {
      scope.defaultValue = 0;

      scope.$input = $( "<INPUT type='text' class='editor-percentcomplete' />" ).appendTo( scope.args.container ).bind( "keydown.nav", function( e )
      {
        if ( e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT )
        {
          e.stopImmediatePropagation();
        }
      } ).focus().select();

      scope.$input.outerWidth( $( scope.args.container ).innerWidth() - 25 );

      scope.$picker = $( "<div class='editor-percentcomplete-picker' />" ).appendTo( scope.args.container );

      var $body = $( "body" );

      scope.$helper = $( "\
             <div class='editor-percentcomplete-helper'>\
             <div class='editor-percentcomplete-wrapper'>\
             <div class='editor-percentcomplete-slider'>\
             </div>\
             <div class='editor-percentcomplete-buttons'>\
             </div>\
             </div>\
             </div>" ).appendTo( $body );

      scope.$helper.find( ".editor-percentcomplete-buttons" ).append( "<button val='0'>Not started</button>\
             <br/>\
             <button val='50'>In Progress</button>\
             <br/>\
             <button val='100'>Complete</button>" );

      scope.$helper.find( ".editor-percentcomplete-slider" ).slider( {
        orientation: "vertical",
        range: "min",
        value: scope.defaultValue,
        slide: function( event, ui )
        {
          scope.$input.val( ui.value );
        }
      } );

      //noinspection JSUnusedLocalSymbols
      scope.$picker.click( function( e )
      {
        //scope.$helper.toggle();
        scope.$helper.show();
        if ( scope.$helper.is( ":visible" ) )
        {
          scope.$helper.position( {
            my: "left top",
            at: "right top",
            of: scope.$picker,
            collision: "flipfit"
          } );
        }
      } );
      //scope.$helper.blur(function (e) {
      //  scope.$helper.hide();
      //});

      //noinspection JSUnusedLocalSymbols
      scope.$helper.find( ".editor-percentcomplete-buttons button" ).bind( "click", function( e )
      {
        scope.$input.val( $( this ).attr( "val" ) );
        scope.$helper.find( ".editor-percentcomplete-slider" ).slider( "value", $( this ).attr( "val" ) );
      } );
    };

    scope.destroy = function()
    {
      scope.$input.remove();
      scope.$picker.remove();
      scope.$helper.remove();
    };

    scope.save = function()
    {
      scope.args.commitChanges();
    };

    scope.cancel = function()
    {
      scope.setDirectValue( scope.defaultValue );
      scope.args.cancelChanges();
    };

    scope.hide = function()
    {
      scope.$input.hide();
      scope.$picker.hide();
      scope.$helper.hide();
    };

    scope.show = function()
    {
      scope.$input.show();
      scope.$picker.show();
      scope.$helper.show();
    };

    scope.position = function( position )
    {
      // nada
    };

    scope.focus = function()
    {
      scope.$input.focus();
    };

    scope.setDirectValue = function( val )
    {
      val = parseFloat( val );
      if ( isNaN( val ) )
      {
        val = 0;
      }
      scope.defaultValue = val;
      scope.$input.val( val );
      scope.$helper.find( ".editor-percentcomplete-slider" ).slider( "value", val );
    };

    scope.loadValue = function( item )
    {
      setDirectValue( item[scope.args.column.field] );
      scope.$input.select();
    };

    scope.serializeValue = function()
    {
      return parseInt( scope.$input.val(), 10 ) || 0;
    };

    scope.applyValue = function( item, state )
    {
      item[scope.args.column.field] = state;
    };

    scope.isValueChanged = function()
    {
      return ((parseInt( scope.$input.val(), 10 ) || 0) != scope.defaultValue);
    };

    scope.validate = function()
    {
      if ( isNaN( parseInt( scope.$input.val(), 10 ) ) )
      {
        return {
          valid: false,
          msg: "Please enter a valid positive number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    scope.init();
  }

  //noinspection FunctionNamingConventionJS
  function LongTextEditor( args )
  {
    var $input, $wrapper;
    var defaultValue;
    var scope = this;

    this.init = function()
    {
      var $container = $( "body" );

      $wrapper = $(
          "<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>" )
          .appendTo( $container );

      $input = $( "<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>" )
          .appendTo( $wrapper );

      $( "<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>" )
          .appendTo( $wrapper );

      $wrapper.find( "button:first" ).bind( "click", this.save );
      $wrapper.find( "button:last" ).bind( "click", this.cancel );
      $input.bind( "keydown", this.handleKeyDown );

      scope.position( args.position );
      $input.focus().select();
    };

    this.handleKeyDown = function( e )
    {
      if ( e.which == $.ui.keyCode.ENTER && e.ctrlKey )
      {
        scope.save();
      } else if ( e.which == $.ui.keyCode.ESCAPE )
      {
        e.preventDefault();
        scope.cancel();
      } else if ( e.which == $.ui.keyCode.TAB && e.shiftKey )
      {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if ( e.which == $.ui.keyCode.TAB )
      {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function()
    {
      args.commitChanges();
    };

    this.cancel = function()
    {
      $input.val( defaultValue );
      args.cancelChanges();
    };

    this.hide = function()
    {
      $wrapper.hide();
    };

    this.show = function()
    {
      $wrapper.show();
    };

    this.position = function( position )
    {
      $wrapper
          .css( "top", position.top - 5 )
          .css( "left", position.left - 5 )
    };

    this.destroy = function()
    {
      $wrapper.remove();
    };

    this.focus = function()
    {
      $input.focus();
    };

    this.loadValue = function( item )
    {
      $input.val( defaultValue = item[args.column.field] );
      $input.select();
    };

    this.serializeValue = function()
    {
      return $input.val();
    };

    this.applyValue = function( item, state )
    {
      item[args.column.field] = state;
    };

    this.isValueChanged = function()
    {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function()
    {
      {
        return {
          valid: true,
          msg: null
        };
      }
      this.init();
    };
  }

  //noinspection FunctionNamingConventionJS
  function FloatEditor( args )
  {

    //noinspection LocalVariableNamingConventionJS
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function()
    {
      $input = $( "<INPUT type='text' class='editor-float' />" ).appendTo( args.container ).bind( "keydown.nav", function( e )
      {
        if ( e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT )
        {
          //noinspection OverlyComplexBooleanExpressionJS
          if ( !((e.target.selectionStart === e.target.value.length) && (e.keyCode === $.ui.keyCode.RIGHT) || (e.target.selectionStart === 0) && (e.keyCode === $.ui.keyCode.LEFT)) )
          {
            e.stopImmediatePropagation();
          }

        }
      } ).focus().select();
      defaultValue = 0;
    };

    this.destroy = function()
    {
      $input.remove();
    };

    this.save = function()
    {
      args.commitChanges();
    };

    this.cancel = function()
    {
      this.setDirectValue( defaultValue );
      args.cancelChanges();
    };

    this.hide = function()
    {
      $input.hide();
    };

    this.show = function()
    {
      $input.show();
    };

    this.position = function( position )
    {
      // nada
    };

    this.focus = function()
    {
      $input.focus();
    };

    this.setDirectValue = function( val )
    {
      val = parseFloat( val );
      if ( isNaN( val ) )
      {
        val = 0;
      }
      defaultValue = val;
      $input.val( val );
      $input[0].defaultValue = val;
    };

    this.loadValue = function( item )
    {
      scope.setDirectValue( args.grid.getDataItemValueForColumn( item, args.column ) );
      $input.select();
    };

    this.serializeValue = function()
    {
      var v = $input.val();
      if ( v === '' )
      {
        return 0.0;
      }
      return parseFloat( applyModifier( defaultValue, v ) ) || 0.0;
    };

    this.applyValue = function( item, state )
    {
      args.grid.setDataItemValueForColumn( item, args.column, state );
    };

    this.isValueChanged = function()
    {
      assert( defaultValue !== null );
      return $input.val() !== (defaultValue + "");
    };

    this.validate = function()
    {
      var val = $input.val();
      if ( isNaN( val ) && !isValidModifier( val ) )
      {
        return {
          valid: false,
          msg: "Please enter a valid numeric value"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  //noinspection FunctionNamingConventionJS
  function PercentageEditor( args )
  {
    var $input;
    var defaultValue;
    var scope = this;

    function roundPerunage( v )
    {
      return Math.round( v * 1E6 ) / 1E6;
    }

    function stringToPerunage( val )
    {
      var multiplier = 1;
      val += "";
      if ( val.charAt( val.length - 1 ) === '%' )
      {
        val = val.slice( 0, -1 );    // remove also the % char if it is there
        multiplier = 100;
      }
      // what remains must be a number
      val = roundPerunage( parseFloat( val ) / multiplier );
      if ( isNaN( val ) )
      {
        val = 0;
      }
      return val;
    }

    this.init = function()
    {
      $input = $( "<INPUT type='text' class='editor-percentage' />" ).appendTo( args.container ).bind( "keydown.nav", function( e )
      {
        if ( e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT )
        {
          e.stopImmediatePropagation();
        }
      } ).focus().select();
      defaultValue = '';
    };

    this.destroy = function()
    {
      $input.remove();
    };

    this.save = function()
    {
      args.commitChanges();
    };

    this.cancel = function()
    {
      this.setDirectValue( defaultValue );
      args.cancelChanges();
    };

    this.hide = function()
    {
      $input.hide();
    };

    this.show = function()
    {
      $input.show();
    };

    this.position = function( position )
    {
      // nada
    };

    this.focus = function()
    {
      $input.focus();
    };

    this.setDirectValue = function( val )
    {
      val = stringToPerunage( val );
      val = (val * 100) + " %";
      defaultValue = val;
      $input.val( val );
      $input[0].defaultValue = val;
    };

    this.loadValue = function( item )
    {
      scope.setDirectValue( args.grid.getDataItemValueForColumn( item, args.column ) );
      $input.select();
    };

    this.serializeValue = function()
    {
      var v = $input.val();
      if ( v === '' )
      {
        return 0;
      }
      var sv = stringToPerunage( defaultValue ) * 100;
      return stringToPerunage( applyModifier( sv, v ) / 100 ) || 0;
    };

    this.applyValue = function( item, state )
    {
      args.grid.setDataItemValueForColumn( item, args.column, state );
    };

    this.isValueChanged = function()
    {
      assert( defaultValue !== null );
      return $input.val() !== defaultValue;
    };

    this.validate = function()
    {
      var val = $input.val();
      if ( val.charAt( val.length - 1 ) === '%' )
      {
        val = val.slice( 0, -1 );    // remove also the % char if it is there
      }
      if ( isNaN( val ) && !isValidModifier( val ) )
      {
        return {
          valid: false,
          msg: "Please enter a valid percentage"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  //noinspection FunctionNamingConventionJS
  function ReadOnlyEditor( args )
  {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function()
    {
      $input = $( "<span class='editor-text-readonly' />" ).appendTo( args.container );
      defaultValue = '';
    };

    this.destroy = function()
    {
      $input.remove();
    };

    this.save = function()
    {
      // nada
    };

    this.cancel = function()
    {
      // nada
    };

    this.hide = function()
    {
      $input.hide();
    };

    this.show = function()
    {
      $input.show();
    };

    this.position = function( position )
    {
      // nada
    };

    this.focus = function()
    {
    };

    this.setDirectValue = function( val )
    {
      defaultValue = val;
      if ( val == null )
      {
        val = "";
      }
      $input.text( val );
    };

    this.loadValue = function( item )
    {
      scope.setDirectValue( args.grid.getDataItemValueForColumn( item, args.column ) );
      $input.select();
    };

    this.serializeValue = function()
    {
      return defaultValue; // $input.text(); -- make sure the value is NEVER changed, which might happen when it goes 'through the DOM'
    };

    this.applyValue = function( item, state )
    {
      args.grid.setDataItemValueForColumn( item, args.column, state );
    };

    this.isValueChanged = function()
    {
      return false;
    };

    this.validate = function()
    {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  //noinspection FunctionNamingConventionJS
  function ColorEditor( args )
  {
    var $input;
    var defaultValue;
    var scope = this;
    var isOpen = false;
    var $container = $( args.container );

    this.init = function()
    {
      $input = $( "<input type='color' />" ).appendTo( $container ).bind( "keydown.nav", function( e )
      {
        if ( e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT )
        {
          e.stopImmediatePropagation();
        }
      } ).focus().select();
      scope.show();
    };

    this.destroy = function()
    {
      $input.spectrum( "destroy" );
      $input.remove();
      isOpen = false;
    };

    this.save = function()
    {
      args.commitChanges();
    };

    this.cancel = function()
    {
      this.setDirectValue( defaultValue );
      args.cancelChanges();
    };

    this.show = function()
    {
      if ( !isOpen )
      {
        $input.spectrum( {
          className: 'spectrumSlick',
          clickoutFiresChange: true,
          showButtons: false,
          showPalette: true,
          showInput: true,
          showAlpha: false,
          showSelectionPalette: true,
          maxPaletteSize: 16,
          preferredFormat: "hex6",
          appendTo: "body",
          flat: true,
          palette: [["#000000", "#262626", "#464646", "#626262", "#707070", "#7D7D7D", "#898989", "#959595", "#A0A0A0", "#ACACAC", "#B7B7B7", "#C2C2C2",
            "#D7D7D7", "#E1E1E1", "#EBEBEB", "#FFFFFF"],
            ["#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#ED1C24", "#FFF200", "#00A651", "#00AEEF", "#2E3192", "#EC008C"],
            ["#F7977A", "#F9AD81", "#FDC68A", "#FFF79A", "#C4DF9B", "#A2D39C", "#82CA9D", "#7BCDC8", "#6ECFF6", "#7EA7D8", "#8493CA", "#8882BE", "#A187BE",
              "#BC8DBF", "#F49AC2", "#F6989D"],
            ["#F26C4F", "#F68E55", "#FBAF5C", "#FFF467", "#ACD372", "#7CC576", "#3BB878", "#1ABBB4", "#00BFF3", "#438CCA", "#5574B9", "#605CA8", "#855FA8",
              "#A763A8", "#F06EA9", "#F26D7D"],
            ["#ED1C24", "#F26522", "#F7941D", "#FFF200", "#8DC73F", "#39B54A", "#00A651", "#00A99D", "#00AEEF", "#0072BC", "#0054A6", "#2E3192", "#662D91",
              "#92278F", "#EC008C", "#ED145B"],
            ["#9E0B0F", "#A0410D", "#A36209", "#ABA000", "#598527", "#1A7B30", "#007236", "#00746B", "#0076A3", "#004B80", "#003471", "#1B1464", "#440E62",
              "#630460", "#9E005D", "#9E0039"],
            ["#790000", "#7B2E00", "#7D4900", "#827B00", "#406618", "#005E20", "#005826", "#005952", "#005B7F", "#003663", "#002157", "#0D004C", "#32004B",
              "#4B0049", "#7B0046", "#7A0026"]]
        } );
        isOpen = true;
      }
      $input.spectrum( "show" );
    };

    this.hide = function()
    {
      if ( isOpen )
      {
        $input.spectrum( "hide" );
        isOpen = false;
      }
    };

    this.position = function( position )
    {
      if ( !isOpen )
      {
        return;
      }
      //$cp.css("top", position.top + 20).css("left", position.left);
    };

    this.focus = function()
    {
      scope.show();
      $input.focus();
    };

    this.setDirectValue = function( val )
    {
      if ( val == null )
      {
        val = "";
      }
      $input.spectrum( "set", val );
      defaultValue = scope.serializeValue();
    };

    this.loadValue = function( item )
    {
      scope.setDirectValue( args.grid.getDataItemValueForColumn( item, args.column ) );
      $input.select();
    };

    this.serializeValue = function()
    {
      return $input.spectrum( "get" ).toString();
    };

    this.applyValue = function( item, state )
    {
      args.grid.setDataItemValueForColumn( item, args.column, state );
    };

    this.isValueChanged = function()
    {
      assert( defaultValue !== null );
      var v = scope.serializeValue();
      return v !== defaultValue;
    };

    this.validate = function()
    {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  //noinspection FunctionNamingConventionJS
  function DataPointTextEditor( args )
  {
    //noinspection LocalVariableNamingConventionJS
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function()
    {
      $input = $( "<INPUT type=text class='editor-text' />" );
      $input.bind( "keydown.nav", function( e )
      {
        if ( e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT )
        {
          if ( !((e.target.selectionStart === e.target.value.length) && (e.keyCode === $.ui.keyCode.RIGHT) || (e.target.selectionStart === 0) && (e.keyCode === $.ui.keyCode.LEFT)) )
          {
            e.stopImmediatePropagation();
          }
        }
      } );
      $input.appendTo( args.container ).focus().select();
      defaultValue = 0;
    };

    this.destroy = function()
    {
      $input.remove();
    };

    this.focus = function()
    {
      $input.focus();
    };

    this.save = function()
    {
      args.commitChanges();
    };

    this.cancel = function()
    {
      this.setDirectValue( defaultValue );
      args.cancelChanges();
    };

    this.hide = function()
    {
      $input.hide();
    };

    this.show = function()
    {
      $input.show();
    };

    this.position = function( position )
    {
      // nada
    };

    this.setDirectValue = function( val )
    {
      if ( val === null )
      {
        val = "";
      }
      defaultValue = val;
      $input.val( val );
      $input[0].defaultValue = val;
    };

    this.loadValue = function( item )
    {
      defaultValue = "";
      if ( item.hasOwnProperty( args.column.field ) )
      {
        defaultValue = item[args.column.field];
      } else
      {
        defaultValue = item.properties[args.column.field] || "";
      }

      $input.val( defaultValue );
      $input[0].defaultValue = defaultValue;
      scope.setDirectValue( defaultValue );
      $input.select();
    };

    this.serializeValue = function()
    {
      return $input.val();
    };

    this.applyValue = function( item, state )
    {
      item[args.column.field] = state;

    };

    this.isValueChanged = function()
    {
      return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
    };

    /* scope.applyValue = function(item, state)
     {
     if (item.hasOwnProperty(args.column.field))
     {
     item[args.column.field] = state;
     } else
     {
     item.properties[args.column.field] = state;
     }
     };*/

    this.validate = function()
    {
      if ( args.column.validator )
      {
        var validationResults = args.column.validator( $input.val() );
        if ( !validationResults.valid )
        {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  //noinspection FunctionNamingConventionJS
  function applyModifier( val, mod )
  {
    var m = isValidModifier( mod );
    if ( !m )
    {
      return mod;
    }
    var dv = parseFloat( val );
    switch ( m.operator )
    {
      case "+":
        return m.isPercent ? dv * (1 + m.value) : dv + m.value;

      case "-":
        return m.isPercent ? dv * (1 - m.value) : dv - m.value;

      case "*":
        return dv * m.value;

      case "/":
        return dv / m.value;
    }
    assert( 0 ); // should never get here
  }

  //noinspection FunctionNamingConventionJS
  function isValidModifier( v )
  {
    var sv = v.toString().trim();
    var ope = sv.charAt( 0 );
    if ( "+-*/".indexOf( ope ) < 0 )
    {
      return false;
    }  // no good if it does not start with an operation
    sv = sv.substr( 1 );    //remove first char
    if ( sv.indexOf( '+' ) >= 0 || sv.indexOf( '-' ) >= 0 || sv.indexOf( '*' ) >= 0 || sv.indexOf( '/' ) >= 0 )
    {
      return false;
    }  // no more signs please.
    var pct = false;
    if ( sv.charAt( sv.length - 1 ) === '%' )
    {
      pct = true;
      sv = sv.slice( 0, -1 );    // remove also the % char if it is there
    }
    // what remains must be a number
    if ( isNaN( sv ) )
    {
      return false;
    }
    return {
      operator: ope,
      isPercent: pct,
      value: parseFloat( sv ) / (pct ? 1 : 100)         // when it is a percentage, produce the equivalent perunage
    };
  }

  //noinspection FunctionNamingConventionJS
  function RowEditor( args )
  {
    var theEditor;
    var scope = this;
    this.init = function()
    {
      //var data = args.grid.getData();
      if ( args.item.editor === undefined )
      {
        theEditor = new ReadOnlyEditor( args );
      } else
      {
        theEditor = new (args.item.editor)( args );
      }
    };

    this.destroy = function()
    {
      theEditor.destroy();
    };

    this.save = function()
    {
      theEditor.save();
    };

    this.cancel = function()
    {
      theEditor.cancel();
    };

    this.hide = function()
    {
      theEditor.hide();
    };

    this.show = function()
    {
      theEditor.show();
    };

    this.position = function( position )
    {
      theEditor.position( position );
    };

    this.focus = function()
    {
      theEditor.focus();
    };

    this.setDirectValue = function( val )
    {
      theEditor.setDirectValue( val );
    };

    this.loadValue = function( item )
    {
      theEditor.loadValue( item );
    };

    this.serializeValue = function()
    {
      return theEditor.serializeValue();
    };

    this.applyValue = function( item, state )
    {
      theEditor.applyValue( item, state );
    };

    this.isValueChanged = function()
    {
      return theEditor.isValueChanged();
    };

    this.validate = function()
    {
      return theEditor.validate();
    };

    this.init();
  }

  function SelectCellEditor( args1 )
  {
    var scope = this;
    args = arga1
    scope.$select;
    scope.defaultValue;

    scope.opt;

    function getKeyFromKeyVal( opt, val )
    {
      var i, v, index = 0;

      for ( i in scope.opt )
      {
        v = scope.opt[i];
        if ( v.val === val )
        {
          index = i;
          break;
        }
      }
      return index;
    }

    scope.init = function()
    {
      var i;

      scope.defaultValue = null;
      scope.opt = (args.metadataColumn && args.metadataColumn.options) || args.column.options;
      scope.opt = typeof scope.opt === 'function' ? scope.opt.call( args.column ) : scope.opt;

      var option_str = [];
      for ( i in scope.opt )
      {
        var v = scope.opt[i];
        option_str.push( "<OPTION value='" + (v.key == null ? v.id : v.key) + "'>" + (v.value == null ? v.label : v.value) + "</OPTION>" );
      }
      scope.$select = $( "<SELECT tabIndex='0' class='editor-select'>" + option_str.join( '' ) + "</SELECT>" ).appendTo( args.container ).focus().select();

      // this expects the multiselect widget (http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/) to be loaded
      scope.$select.multiselect( {
        autoOpen: true,
        minWidth: $( args.container ).innerWidth() - 5,
        multiple: false,
        header: false,
        noneSelectedText: "...",
        classes: "editor-multiselect",
        selectedList: 1,
        close: function( event, ui )
        {
          //args.grid.getEditorLock().commitCurrentEdit();
        }
      } );
    };

    scope.destroy = function()
    {
      scope.$select.multiselect( "destroy" );
      scope.$select.remove();
    };

    scope.save = function()
    {
      args.commitChanges();
    };

    scope.cancel = function()
    {
      scope.setDirectValue( scope.defaultValue );
      args.cancelChanges();
    };

    scope.hide = function()
    {
      scope.$select.hide();
    };

    scope.show = function()
    {
      scope.$select.show();
    };

    scope.position = function( position )
    {
      // nada
    };

    scope.focus = function()
    {
      scope.$select.focus();
    };

    scope.setDirectValue = function( val )
    {
      var key = getKeyFromKeyVal( scope.opt, val );
      key = scope.opt[key].key;
      scope.defaultValue = key;
      scope.$select.val( key );
      scope.$select.multiselect( "refresh" );
    };

    scope.loadValue = function( item )
    {
      scope.setDirectValue( item[scope.args.column.field] );
      scope.$select.select();
    };

    scope.serializeValue = function()
    {
      return scope.$select.val();
    };

    scope.applyValue = function( item, state )
    {
      item[scope.args.column.field] = state;
    };

    scope.isValueChanged = function()
    {
      return scope.serializeValue() !== scope.defaultValue;
    };

    scope.validate = function()
    {
      return {
        valid: true,
        msg: null
      };
    };
  }

})( jQuery );

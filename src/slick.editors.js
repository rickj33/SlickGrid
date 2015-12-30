/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function($){
    // register namespace
    $.extend(true, window, {
        Slick : {
            Editors : {
                Text               : TextEditor,
                Integer            : IntegerEditor,
                Date               : DateEditor,
                YesNoSelect        : YesNoSelectEditor,
                Checkbox           : CheckboxEditor,
                PercentComplete    : PercentCompleteEditor,
                LongText           : LongTextEditor,
                Float              : FloatEditor,
                Percentage         : PercentageEditor,
                //RowMulti           : RowEditor,
                ReadOnly           : ReadOnlyEditor,
                Combo              : SelectCellEditor,
                Color              : ColorEditor,
                SelectCell         : SelectCellEditor,
                TransposedEditor   : TransposedEditor,
                TransposedText     : TransposedTextEditor,
                TransposedInteger  : TransposedIntegerEditor,
                TransposedFloat    : TransposedFloatEditor,
                TransposedCheckbox : TransposedCheckboxEditor,
                TransposedColor    : TransposedColorEditor,
                TransposedPercent  : TransposedPercentEditor,
                DataPoint          : DataPointTextEditor
            }
        }
    });
    
//noinspection FunctionNamingConventionJS
    function TextEditor(args)
{

        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

    this.init = function () 
{
      $input = $("<INPUT type=text class='editor-text' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                        e.stopImmediatePropagation();
                    }
          })
          .focus()
          .select();
        };

        this.destroy = function()
        {
            $input.remove();
        };

        this.focus = function()
        {
            $input.focus();
        };

    this.getValue = function () 
        {
      return $input.val();
    };

    this.setValue = function (val) 
            {
            $input.val(val);
        };

        this.loadValue = function(item)
        {
      defaultValue = item[args.column.field] || "";
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
            $input.select();
        };

        this.serializeValue = function()
        {
            return $input.val();
        };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
        };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }


 function IntegerEditor(args)
    {
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function()
        {
      $input = $("<INPUT type=text class='editor-text' />");

      $input.bind("keydown.nav", function (e) {
        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                            e.stopImmediatePropagation();
                        }
      });

      $input.appendTo(args.container);
      $input.focus().select();
        };

    this.destroy = function () {
      $input.remove();
        };

    this.focus = function () {
            $input.focus();
        };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
            $input.select();
        };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
        };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
        };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

    this.validate = function () {
      if (isNaN($input.val())) {
                return {
                    valid : false,
                    msg   : "Please enter a valid integer"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

  function DateEditor(args)
    {
        var $input;
        var defaultValue;
        var scope = this;
        var calendarOpen = false;
        var imageDir = args.imagesPath || "../images";
        var dateFormat = 0;
        var detectableDateFormats = [
            "yy-mm-dd",   // ISO
            $.datepicker.ISO_8601,
            $.datepicker.COOKIE,
            $.datepicker.RFC_1036,
            $.datepicker.RFC_2822,
            $.datepicker.RFC_850,
            $.datepicker.TIMESTAMP,
            "dd-mm-yyyy",   // European
            "mm/dd/yy",     // US
            "dd-mm-yy",     // European
            $.datepicker.TICKS
        ];
        /* jshint -W069 */     //! jshint : ['...'] is better written in dot notation
        var regionSettings = $.datepicker.regional["en"] || $.datepicker.regional;
        /* jshint +W069 */
        var datepickerParseSettings = {
            shortYearCutoff : 20,
            dayNamesShort   : regionSettings.dayNamesShort,
            dayNames        : regionSettings.dayNames,
            monthNamesShort : regionSettings.monthNamesShort,
            monthNames      : regionSettings.monthNames
        };
        var datePickerOptions = {};
        var datePickerDefaultOptions = {
            dateFormat      : "yy-mm-dd",                 // this format is used for displaying the date while editing / picking it
            defaultDate     : 0,                         // default date: today
            showOn          : "button",
            buttonImageOnly : true,
            buttonImage     : args.dateButtonImage || (imageDir + "/calendar.png"),
            buttonText      : "Select date"
        };
        var datePickerFixedOptions = {
            beforeShow : function()
            {
                calendarOpen = true;
            },
            onClose    : function()
            {
                calendarOpen = false;
            }
        };
        // Override DatePicker options from datePickerOptions on column definition.
        // Make sure that beforeShow and onClose events are not clobbered.
        datePickerOptions = $.extend(datePickerOptions, datePickerDefaultOptions, args.column.datePickerOptions, datePickerFixedOptions);


        function parseDateStringAndDetectFormat(s)
        {

            if (s instanceof Date)
            {
                return s;
            }
            var fmt, d;
            for (dateFormat = 0; fmt = detectableDateFormats[dateFormat]; dateFormat++)
            {
                try
                {
                    d = $.datepicker.parseDate(fmt, s, datepickerParseSettings);
                    break;
                }
                catch (ex)
                {
                    continue;
                }
            }
            return d || false;
        }

        this.init = function()
        {
            defaultValue = new Date();
            $input = $("<INPUT type='text' class='editor-date' />").appendTo(args.container).bind("keydown.nav", function(e)
            {
                if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            }).focus().select();
            $input.datepicker(datePickerOptions);
            $input.outerWidth($input.outerWidth() - 18);
        };

        this.destroy = function()
        {
            $.datepicker.dpDiv.stop(true, true);
            $input.datepicker("hide");
            $input.datepicker("destroy");
            $input.remove();
        };

        this.save = function()
        {
            args.commitChanges();
        };

        this.cancel = function()
        {
            this.setDirectValue(defaultValue);
            args.cancelChanges();
        };

         this.show = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).show();
      }
    };

    this.hide = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).hide();
      }
    };

        /*
         * info: {
         *         gridPosition: getGridPosition(),
         *         position: cellBox,
         *         container: activeCellNode
         *       }
         */
        this.position = function(position)
        {
            if (!calendarOpen)
            {
                return;
            }
           
                $.datepicker.dpDiv.css("top", position.top + 30).css("left", position.left);
           
        };

        this.focus = function()
        {
            $input.focus();
        };

        this.setDirectValue = function(val)
        {
            val = parseDateStringAndDetectFormat(val);
            /* parseISODate() */
            if (!val)
            {
                val = new Date();
            }
            defaultValue = val;
            $input.datepicker("setDate", val);
        };

       this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };
        this.serializeValue = function()
        {
            return $input.datepicker("getDate");
        };

        this.applyValue = function(item, state)
        {
            var fmt = detectableDateFormats[dateFormat] || detectableDateFormats[0];
            state = $.datepicker.formatDate(fmt, state); // state.format('isoDate');
              item[args.column.field] = state;
        };

        this.isValueChanged = function()
        {
            var d = $input.datepicker("getDate");
            return !d || !defaultValue || d.getTime() !== defaultValue.getTime();
        };

        this.validate = function()
        {
            var d = $input.datepicker("getDate");
            if (!d)
            {
                return {
                    valid : false,
                    msg   : "Please enter a valid date"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

  function YesNoSelectEditor(args)
    {
        var $select;
        var defaultValue;
        var scope = this;

    this.init = function () {
      $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
      $select.appendTo(args.container);
      $select.focus();
        };

    this.destroy = function () {
            $select.remove();
        };

    this.focus = function () {
            $select.focus();
        };

    this.loadValue = function (item) {
      $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
            $select.select();
        };

    this.serializeValue = function () {
      return ($select.val() == "yes");
        };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
        };

    this.isValueChanged = function () {
      return ($select.val() != defaultValue);
        };

    this.validate = function () {
            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }


 function CheckboxEditor(args)
    {
        var $select;
        var defaultValue;
        var scope = this;

    this.init = function () {
      $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
      $select.appendTo(args.container);
      $select.focus();
        };

    this.destroy = function () {
            $select.remove();
        };

    this.focus = function () {
            $select.focus();
        };

    this.loadValue = function (item) {
      defaultValue = !!item[args.column.field];
      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
        };

    this.serializeValue = function () {
            return $select.prop('checked');
        };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
        };

    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
        };

    this.validate = function () {
            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

 function PercentCompleteEditor(args)
    {
    var $input, $picker;
        var defaultValue;
        var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-percentcomplete' />");
      $input.width($(args.container).innerWidth() - 25);
      $input.appendTo(args.container);

            $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
      $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

      $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

      $input.focus().select();

      $picker.find(".editor-percentcomplete-slider").slider({
                orientation : "vertical",
                range       : "min",
                value       : defaultValue,
        slide: function (event, ui) {
          $input.val(ui.value)
                }
            });

      $picker.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
                $input.val($(this).attr("val"));
        $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
      })
        };

    this.destroy = function () {
            $input.remove();
            $picker.remove();
        };

    this.focus = function () {
            $input.focus();
        };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
            $input.select();
        };

    this.serializeValue = function () {
            return parseInt($input.val(), 10) || 0;
        };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
        };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
        };

    this.validate = function () {
      if (isNaN(parseInt($input.val(), 10))) {
                return {
                    valid : false,
                    msg   : "Please enter a valid positive number"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

 /*
     * An example of a "detached" editor.
     * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
     * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
     */
    //noinspection FunctionNamingConventionJS
    function LongTextEditor(args)
    {
    var $input, $wrapper;
        var defaultValue;
        var scope = this;

    this.init = function () {
            var $container = $("body");

      $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
          .appendTo($container);

      $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
          .appendTo($wrapper);

      $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

      $wrapper.find("button:first").bind("click", this.save);
      $wrapper.find("button:last").bind("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
            $input.focus().select();
        };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
                scope.save();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
                e.preventDefault();
                scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                e.preventDefault();
                args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
                e.preventDefault();
                args.grid.navigateNext();
            }
        };

    this.save = function () {
            args.commitChanges();
        };

    this.cancel = function () {
            $input.val(defaultValue);
            args.cancelChanges();
        };

    this.hide = function () {
            $wrapper.hide();
        };

    this.show = function () {
      $wrapper.show();
        };

    this.position = function (position) {
      $wrapper
          .css("top", position.top - 5)
          .css("left", position.left - 5)
        };

    this.destroy = function () {
            $wrapper.remove();
        };

    this.focus = function () {
                $input.focus();
        };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
            $input.select();
        };

    this.serializeValue = function () {
      return $input.val();
        };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
        };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

    this.validate = function () {
        {
            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }


    //noinspection FunctionNamingConventionJS
    function TransposedEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        scope.realEditor = args.item.field.editor;

        this.init = function()
        {
            // scope.realEditor = args.item.field.editor;
            scope.realEditor(args);
            //scope.realEditor.init();
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
            this.setDirectValue(defaultValue);
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

        this.position = function(position)
        {
            // nada
        };

        this.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        this.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        this.serializeValue = function()
        {
            return $input.val();
        };

        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;
            item[args.column.field] = state;


        };

        /* this.applyValue = function(item, state)
         {
         scope.realEditor.applyValue(item, state);

         if (item.field.setBackingStoreValue)
         {
         item.field.setBackingStoreValue(args.column, item, state);
         }
         item[args.column.field] = state;
         //update the object providing the transposed value.


         };*/

        this.isValueChanged = function()
        {

            return scope.realEditor.isValueChanged();

        };

        this.validate = function()
        {
            return scope.realEditor.validate();
        };

        this.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedColorEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var scope = this;
        var defaultValue;
        var isOpen = false;
        var $container = $(args.container);

        this.init = function()
        {
            $input = $("<input type='text' class='editor-text' id='colorEditor'  />");

            $input.bind("keydown.nav", function(e)
            {
                if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            });

            $input.appendTo($container);

            $input.focus().select();
            scope.show();
        };

        this.destroy = function()
        {
            $input.spectrum("destroy");
            $input.remove();
            isOpen = false;
        };

        this.focus = function()
        {
            scope.show();
            $input.focus();
        };

        this.save = function()
        {
            args.commitChanges();
        };

        this.cancel = function()
        {
            this.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        this.hide = function()
        {
            if (isOpen)
            {
                $input.spectrum("hide");
                isOpen = false;
            }
        };

        this.show = function()
        {
            if (!isOpen)
            {
                $input.spectrum({
                    color                : defaultValue,
                    clickoutFiresChange  : true,
                    togglePaletteOnly    : true,
                    showInitial          : true,
                    showInput            : true,
                    showPalette          : true,
                    showSelectionPalette : true,
                    maxPaletteSize       : 10,
                    move                 : function(color)
                    {
                    },
                    show                 : function()
                    {

                    },
                    beforeShow           : function()
                    {

                    },
                    hide                 : function(color)
                    {
                        scope.save();
                    },

                    togglePaletteMoreText : 'more',
                    togglePaletteLessText : 'less',
                    preferredFormat       : "hex",
                    palette               : [
                        [
                            "rgb(0, 0, 0)",
                            "rgb(67, 67, 67)",
                            "rgb(102, 102, 102)",
                            "rgb(204, 204, 204)",
                            "rgb(217, 217, 217)",
                            "rgb(255, 255, 255)"
                        ],
                        [
                            "rgb(152, 0, 0)",
                            "rgb(255, 0, 0)",
                            "rgb(255, 153, 0)",
                            "rgb(255, 255, 0)",
                            "rgb(0, 255, 0)",
                            "rgb(0, 255, 255)",
                            "rgb(74, 134, 232)",
                            "rgb(0, 0, 255)",
                            "rgb(153, 0, 255)",
                            "rgb(255, 0, 255)"
                        ],
                        [
                            "rgb(230, 184, 175)",
                            "rgb(244, 204, 204)",
                            "rgb(252, 229, 205)",
                            "rgb(255, 242, 204)",
                            "rgb(217, 234, 211)",
                            "rgb(208, 224, 227)",
                            "rgb(201, 218, 248)",
                            "rgb(207, 226, 243)",
                            "rgb(217, 210, 233)",
                            "rgb(234, 209, 220)",
                            "rgb(221, 126, 107)",
                            "rgb(234, 153, 153)",
                            "rgb(249, 203, 156)",
                            "rgb(255, 229, 153)",
                            "rgb(182, 215, 168)",
                            "rgb(162, 196, 201)",
                            "rgb(164, 194, 244)",
                            "rgb(159, 197, 232)",
                            "rgb(180, 167, 214)",
                            "rgb(213, 166, 189)",
                            "rgb(204, 65, 37)",
                            "rgb(224, 102, 102)",
                            "rgb(246, 178, 107)",
                            "rgb(255, 217, 102)",
                            "rgb(147, 196, 125)",
                            "rgb(118, 165, 175)",
                            "rgb(109, 158, 235)",
                            "rgb(111, 168, 220)",
                            "rgb(142, 124, 195)",
                            "rgb(194, 123, 160)",
                            "rgb(166, 28, 0)",
                            "rgb(204, 0, 0)",
                            "rgb(230, 145, 56)",
                            "rgb(241, 194, 50)",
                            "rgb(106, 168, 79)",
                            "rgb(69, 129, 142)",
                            "rgb(60, 120, 216)",
                            "rgb(61, 133, 198)",
                            "rgb(103, 78, 167)",
                            "rgb(166, 77, 121)",
                            "rgb(91, 15, 0)",
                            "rgb(102, 0, 0)",
                            "rgb(120, 63, 4)",
                            "rgb(127, 96, 0)",
                            "rgb(39, 78, 19)",
                            "rgb(12, 52, 61)",
                            "rgb(28, 69, 135)",
                            "rgb(7, 55, 99)",
                            "rgb(32, 18, 77)",
                            "rgb(76, 17, 48)"
                        ]
                    ]
                }, scope);
                isOpen = true;
            }
            $input.spectrum("show");
        };

        this.position = function(position)
        {
            if (!isOpen)
            {
                return;
            }
            //$cp.css("top", position.top + 20).css("left", position.left);
        };


        this.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            $input.spectrum("set", val);
            defaultValue = scope.serializeValue();
        };

        this.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        this.serializeValue = function()
        {
            return $input.val();
        };

        this.applyValue = function(item, state)
        {
             item[args.column.field] = state;
            //args.grid.setDataItemValueForColumn(item, args.column, state);
        };

        this.isValueChanged = function()
        {
            assert(defaultValue !== null);
            var v = scope.serializeValue();
            return v !== defaultValue;

        };

        this.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

    function SelectCellEditor(args)
    {
        var $select;
        var defaultValue;
        var scope = this;
        var opt;

        function getKeyFromKeyVal(opt, val)
        {
            var i, v, index = 0;

            for (i in opt)
            {
                v = opt[i];
                if (v.val === val)
                {
                    index = i;
                    break;
                }
            }
            return index;
        }

        this.init = function()
        {
            var i;

            defaultValue = null;
            opt = (args.metadataColumn && args.metadataColumn.options) || args.column.options;
            assert(opt);
            opt = typeof opt === 'function' ? opt.call(args.column) : opt;
            assert(opt);

            var option_str = [];
            for (i in opt)
            {
                var v = opt[i];
                option_str.push("<OPTION value='" + (v.key == null ? v.id : v.key) + "'>" + (v.value == null ? v.label : v.value) + "</OPTION>");
            }
            $select = $("<SELECT tabIndex='0' class='editor-select'>" + option_str.join('') + "</SELECT>").appendTo(args.container).focus().select();

            // this expects the multiselect widget (http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/) to be loaded
            $select.multiselect({
                autoOpen         : true,
                minWidth         : $(args.container).innerWidth() - 5,
                multiple         : false,
                header           : false,
                noneSelectedText : "...",
                classes          : "editor-multiselect",
                selectedList     : 1,
                close            : function(event, ui)
                {
                    //args.grid.getEditorLock().commitCurrentEdit();
                }
            });
        };

        this.destroy = function()
        {
            $select.multiselect("destroy");
            $select.remove();
        };

        this.save = function()
        {
            args.commitChanges();
        };

        this.cancel = function()
        {
            this.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        this.hide = function()
        {
            $select.hide();
        };

        this.show = function()
        {
            $select.show();
        };

        this.position = function(position)
        {
            // nada
        };

        this.focus = function()
        {
            $select.focus();
        };

        this.setDirectValue = function(val)
        {
            var key = getKeyFromKeyVal(opt, val);
            key = opt[key].key;
            defaultValue = key;
            $select.val(key);
            $select.multiselect("refresh");
        };

        this.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $select.select();
        };

        this.serializeValue = function()
        {
            return $select.val();
        };

        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        this.isValueChanged = function()
        {
            return scope.serializeValue() !== defaultValue;
        };

        this.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };
    }

    //noinspection FunctionNamingConventionJS
    function TransposedTextEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function()
        {
            $input = $("<INPUT type=text class='editor-text' />").appendTo(args.container).bind("keydown.nav", function(e)
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            }).focus().select();
            defaultValue = '';
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
            this.setDirectValue(defaultValue);
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

        this.position = function(position)
        {
            // nada
        };

        this.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        this.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        this.serializeValue = function()
        {
            return $input.val();
        };

        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;


        };


        this.isValueChanged = function()
        {
            return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
        };

        this.validate = function()
        {
            if (args.column.validator)
            {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid)
                {
                    return validationResults;
                }
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedIntegerEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function()
        {
            $input = $("<INPUT type=text class='editor-text' />");

            $input.bind("keydown.nav", function(e)
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            });

            $input.appendTo(args.container);
            $input.focus().select();
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
            this.setDirectValue(defaultValue);
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

        this.position = function(position)
        {
            // nada
        };

        this.setDirectValue = function(val)
        {
            var intVal = parseInt(val);
            if (isNaN(intVal))
            {
                intVal = 0;
            }
            defaultValue = intVal;
            $input.val(intVal);
            $input[0].defaultValue = intVal;
        };

        this.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        this.serializeValue = function()
        {
            return parseInt($input.val(), 10) || 0;
        };

        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;


        };

        this.isValueChanged = function()
        {
            return (!($input.val() == "" && defaultValue === null)) && ($input.val() != defaultValue);
        };

        this.validate = function()
        {
            if (isNaN($input.val()))
            {
                return {
                    valid : false,
                    msg   : "Please enter a valid integer"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedFloatEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function()
        {
            $input = $("<INPUT type=text class='editor-text' />");

            $input.bind("keydown.nav", function(e)
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            });

            $input.appendTo(args.container);
            $input.focus().select();
            defaultValue = 0.0;
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
            this.setDirectValue(defaultValue);
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

        this.position = function(position)
        {
            // nada
        };

        this.setDirectValue = function(val)
        {
            var floatVal = parseFloat(val);
            if (isNaN(floatVal))
            {
                floatVal = 0;
            }
            defaultValue = floatVal;
            $input.val(floatVal);
            $input[0].defaultValue = floatVal;
        };

        this.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        this.serializeValue = function()
        {
            var v = $input.val();
            if (v === '')
            {
                return 0.0;
            }
            return parseFloat(applyModifier(defaultValue, v)) || 0.0;
        };

        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;


        };


        this.isValueChanged = function()
        {
            return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
        };

        this.validate = function()
        {
            if (isNaN($input.val()))
            {
                return {
                    valid : false,
                    msg   : "Please enter a valid decimal number"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedPercentEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function()
        {
            $input = $("<INPUT type=text class='editor-text' />");

            $input.bind("keydown.nav", function(e)
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            });

            $input.appendTo(args.container).focus().select();
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
            this.setDirectValue(defaultValue);
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

        this.position = function(position)
        {
            // nada
        };

        this.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        this.loadValue = function(item)
        {
            var percentValue = 0;
            var decimalValue = 0;
            defaultValue = item[args.column.field];
            if(_.isNumber(defaultValue))
            {
                 decimalValue = parseFloat(defaultValue);
                 percentValue = Math.round(decimalValue * 100);
            }
            if (percentValue === 0)
            {
                return 0;
            }
            if (percentValue > 100)
            {
                percentValue = 100;
            }
            $input.val(percentValue);
            $input[0].defaultValue = percentValue;
            scope.setDirectValue(percentValue);
            $input.select();
        };


        this.serializeValue = function()
        {
            var intValue = parseInt($input.val(), 10) || 0;
            //noinspection UnnecessaryLocalVariableJS
            var decimalValue = intValue / 100;
            return decimalValue;
        };

        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;

        };


        this.isValueChanged = function()
        {
            return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
        };

        this.validate = function()
        {
            if (isNaN($input.val()))
            {
                return {
                    valid : false,
                    msg   : "Please enter a valid integer"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedCheckboxEditor(args)
    {
        var $select;
        var defaultValue;
        var scope = this;

        this.init = function()
        {
            $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus ='true'>").appendTo(args.container).focus().select();
            defaultValue = false;
        };

        this.destroy = function()
        {
            $select.remove();
        };

        this.save = function()
        {
            args.commitChanges();
        };

        this.cancel = function()
        {
            this.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        this.hide = function()
        {
            $select.hide();
        };

        this.show = function()
        {
            $select.show();
        };

        this.position = function(position)
        {
            // nada
        };

        this.focus = function()
        {
            $select.focus();
        };

        this.setDirectValue = function(val)
        {
            val = !!val;
            defaultValue = val;
            $select.prop('checked', val);
        };

        this.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $select.select();
        };

        this.serializeValue = function()
        {
            return $select.prop('checked');
        };

        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        this.isValueChanged = function()
        {
            return (this.serializeValue() !== defaultValue);
        };

        this.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }

    //noinspection FunctionNamingConventionJS
    function DataPointTextEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
   var scope = this;

        this.init = function()
        {
            $input = $("<INPUT type=text class='editor-text' />");
            $input.bind("keydown.nav", function(e)
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT)
                {
                    if (!((e.target.selectionStart === e.target.value.length) &&
                        (e.keyCode === $.ui.keyCode.RIGHT) ||
                        (e.target.selectionStart === 0) &&
                        (e.keyCode === $.ui.keyCode.LEFT)))
                    {
                        e.stopImmediatePropagation();
                    }
                }
            });
            $input.appendTo(args.container).focus().select();
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
            this.setDirectValue(defaultValue);
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

        this.position = function(position)
        {
            // nada
        };

        this.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

  this.loadValue = function(item)
        {
            defaultValue = "";
            if (item.hasOwnProperty(args.column.field))
            {
                defaultValue = item[args.column.field];
            } else
            {
                defaultValue = item.properties[args.column.field] || "";
            }

            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
             scope.setDirectValue(defaultValue);
            $input.select();
        };

     


           this.serializeValue = function()
        {
            return $input.val();
        };
        
        this.applyValue = function(item, state)
        {
            item[args.column.field] = state;

        };


        this.isValueChanged = function()
        {
            return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
        };


       /* this.applyValue = function(item, state)
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
            if (args.column.validator)
            {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid)
                {
                    return validationResults;
                }
            }

            return {
                valid : true,
                msg   : null
            };
        };

        this.init();
    }


})(jQuery);

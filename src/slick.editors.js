/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function($)
{
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
                Percentage         : PercentageEditor, //RowMulti           : RowEditor,
                ReadOnly           : ReadOnlyEditor,
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

        scope.init = function()
        {
            $input = $("<INPUT type=text class='editor-text' />")
            .appendTo(args.container)
            .bind("keydown.nav", function(e)
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            })
            .focus()
            .select();
        };

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.getValue = function()
        {
            return $input.val();
        };

        scope.setValue = function(val)
        {
            $input.val(val);
        };

        scope.loadValue = function(item)
        {
            defaultValue = item[args.column.field] || "";
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        scope.serializeValue = function()
        {
            return $input.val();
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        scope.validate = function()
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

        scope.init();
    }


    //noinspection FunctionNamingConventionJS
    function IntegerEditor(args)
    {
        var $input;
        var defaultValue;
        var scope = this;

        scope.init = function()
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
        };

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.loadValue = function(item)
        {
            defaultValue = item[args.column.field];
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        scope.serializeValue = function()
        {
            return parseInt($input.val(), 10) || 0;
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        scope.validate = function()
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

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function DateEditor(args)
    {
        var $input;
        var defaultValue;
        var scope = this;
        var calendarOpen = false;
        var imageDir = args.imagesPath || "../images";
        var dateFormat = 0;
        var detectableDateFormats = ["yy-mm-dd",   // ISO
            $.datepicker.ISO_8601, $.datepicker.COOKIE, $.datepicker.RFC_1036, $.datepicker.RFC_2822, $.datepicker.RFC_850, $.datepicker.TIMESTAMP,
            "dd-mm-yyyy",   // European
            "mm/dd/yy",     // US
            "dd-mm-yy",     // European
            $.datepicker.TICKS];
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

        scope.init = function()
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

        scope.destroy = function()
        {
            $.datepicker.dpDiv.stop(true, true);
            $input.datepicker("hide");
            $input.datepicker("destroy");
            $input.remove();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.show = function()
        {
            if (calendarOpen)
            {
                $.datepicker.dpDiv.stop(true, true).show();
            }
        };

        scope.hide = function()
        {
            if (calendarOpen)
            {
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
        scope.position = function(position)
        {
            if (!calendarOpen)
            {
                return;
            }

            $.datepicker.dpDiv.css("top", position.top + 30).css("left", position.left);

        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.setDirectValue = function(val)
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

        scope.loadValue = function(item)
        {
            defaultValue = item[args.column.field];
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };
        scope.serializeValue = function()
        {
            return $input.datepicker("getDate");
        };

        scope.applyValue = function(item, state)
        {
            var fmt = detectableDateFormats[dateFormat] || detectableDateFormats[0];
            state = $.datepicker.formatDate(fmt, state); // state.format('isoDate');
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            var d = $input.datepicker("getDate");
            return !d || !defaultValue || d.getTime() !== defaultValue.getTime();
        };

        scope.validate = function()
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

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function YesNoSelectEditor(args)
    {
        var $select;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
            $select.appendTo(args.container);
            $select.focus();
        };

        scope.destroy = function()
        {
            $select.remove();
        };

        scope.focus = function()
        {
            $select.focus();
        };

        scope.loadValue = function(item)
        {
            $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
            $select.select();
        };

        scope.serializeValue = function()
        {
            return ($select.val() == "yes");
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return ($select.val() != defaultValue);
        };

        scope.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function CheckboxEditor(args)
    {
        var $select;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
            $select.appendTo(args.container);
            $select.focus();
        };

        scope.destroy = function()
        {
            $select.remove();
        };

        scope.focus = function()
        {
            $select.focus();
        };

        scope.loadValue = function(item)
        {
            defaultValue = !!item[args.column.field];
            if (defaultValue)
            {
                $select.prop('checked', true);
            } else
            {
                $select.prop('checked', false);
            }
        };

        scope.serializeValue = function()
        {
            return $select.prop('checked');
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return (scope.serializeValue() !== defaultValue);
        };

        scope.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function PercentCompleteEditor(args)
    {
        var $input, $picker;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            $input = $("<INPUT type=text class='editor-percentcomplete' />");
            $input.width($(args.container).innerWidth() - 25);
            $input.appendTo(args.container);

            $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
            $picker.append(
                "<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

            $picker.find(".editor-percentcomplete-buttons")
            .append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

            $input.focus().select();

            $picker.find(".editor-percentcomplete-slider").slider({
                orientation : "vertical",
                range       : "min",
                value       : defaultValue,
                slide       : function(event, ui)
                {
                    $input.val(ui.value)
                }
            });

            $picker.find(".editor-percentcomplete-buttons button").bind("click", function(e)
            {
                $input.val($(this).attr("val"));
                $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
            })
        };

        scope.destroy = function()
        {
            $input.remove();
            $picker.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.loadValue = function(item)
        {
            $input.val(defaultValue = item[args.column.field]);
            $input.select();
        };

        scope.serializeValue = function()
        {
            return parseInt($input.val(), 10) || 0;
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
        };

        scope.validate = function()
        {
            if (isNaN(parseInt($input.val(), 10)))
            {
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

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function LongTextEditor(args)
    {
        var $input, $wrapper;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            var $container = $("body");

            $wrapper = $(
                "<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
            .appendTo($container);

            $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
            .appendTo($wrapper);

            $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
            .appendTo($wrapper);

            $wrapper.find("button:first").bind("click", scope.save);
            $wrapper.find("button:last").bind("click", scope.cancel);
            $input.bind("keydown", scope.handleKeyDown);

            scope.position(args.position);
            $input.focus().select();
        };

        scope.handleKeyDown = function(e)
        {
            if (e.which == $.ui.keyCode.ENTER && e.ctrlKey)
            {
                scope.save();
            } else if (e.which == $.ui.keyCode.ESCAPE)
            {
                e.preventDefault();
                scope.cancel();
            } else if (e.which == $.ui.keyCode.TAB && e.shiftKey)
            {
                e.preventDefault();
                args.grid.navigatePrev();
            } else if (e.which == $.ui.keyCode.TAB)
            {
                e.preventDefault();
                args.grid.navigateNext();
            }
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            $input.val(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $wrapper.hide();
        };

        scope.show = function()
        {
            $wrapper.show();
        };

        scope.position = function(position)
        {
            $wrapper
            .css("top", position.top - 5)
            .css("left", position.left - 5)
        };

        scope.destroy = function()
        {
            $wrapper.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.loadValue = function(item)
        {
            $input.val(defaultValue = item[args.column.field]);
            $input.select();
        };

        scope.serializeValue = function()
        {
            return $input.val();
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        scope.validate = function()
        {
            {
                return {
                    valid : true,
                    msg   : null
                };
            }
            scope.init();
        };
    }


    //noinspection FunctionNamingConventionJS
    function FloatEditor(args)
    {

        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            $input = $("<INPUT type='text' class='editor-float' />").appendTo(args.container).bind("keydown.nav", function(e)
            {
                if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT)
                {
                    //noinspection OverlyComplexBooleanExpressionJS
                    if (!((e.target.selectionStart === e.target.value.length) && (e.keyCode === $.ui.keyCode.RIGHT) ||
                        (e.target.selectionStart === 0) && (e.keyCode === $.ui.keyCode.LEFT)))
                    {
                        e.stopImmediatePropagation();
                    }

                }
            }).focus().select();
            defaultValue = 0;
        };

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.setDirectValue = function(val)
        {
            val = parseFloat(val);
            if (isNaN(val))
            {
                val = 0;
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
            $input.select();
        };

        scope.serializeValue = function()
        {
            var v = $input.val();
            if (v === '')
            {
                return 0.0;
            }
            return parseFloat(applyModifier(defaultValue, v)) || 0.0;
        };

        scope.applyValue = function(item, state)
        {
            args.grid.setDataItemValueForColumn(item, args.column, state);
        };

        scope.isValueChanged = function()
        {
            assert(defaultValue !== null);
            return $input.val() !== (defaultValue + "");
        };

        scope.validate = function()
        {
            var val = $input.val();
            if (isNaN(val) && !isValidModifier(val))
            {
                return {
                    valid : false,
                    msg   : "Please enter a valid numeric value"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function PercentageEditor(args)
    {
        var $input;
        var defaultValue;
        var scope = this;

        function roundPerunage(v)
        {
            return Math.round(v * 1E6) / 1E6;
        }

        function stringToPerunage(val)
        {
            var multiplier = 1;
            val += "";
            if (val.charAt(val.length - 1) === '%')
            {
                val = val.slice(0, -1);    // remove also the % char if it is there
                multiplier = 100;
            }
            // what remains must be a number
            val = roundPerunage(parseFloat(val) / multiplier);
            if (isNaN(val))
            {
                val = 0;
            }
            return val;
        }

        scope.init = function()
        {
            $input = $("<INPUT type='text' class='editor-percentage' />").appendTo(args.container).bind("keydown.nav", function(e)
            {
                if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            }).focus().select();
            defaultValue = '';
        };

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.setDirectValue = function(val)
        {
            val = stringToPerunage(val);
            val = (val * 100) + " %";
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
            $input.select();
        };

        scope.serializeValue = function()
        {
            var v = $input.val();
            if (v === '')
            {
                return 0;
            }
            var sv = stringToPerunage(defaultValue) * 100;
            return stringToPerunage(applyModifier(sv, v) / 100) || 0;
        };

        scope.applyValue = function(item, state)
        {
            args.grid.setDataItemValueForColumn(item, args.column, state);
        };

        scope.isValueChanged = function()
        {
            assert(defaultValue !== null);
            return $input.val() !== defaultValue;
        };

        scope.validate = function()
        {
            var val = $input.val();
            if (val.charAt(val.length - 1) === '%')
            {
                val = val.slice(0, -1);    // remove also the % char if it is there
            }
            if (isNaN(val) && !isValidModifier(val))
            {
                return {
                    valid : false,
                    msg   : "Please enter a valid percentage"
                };
            }

            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }


    //noinspection FunctionNamingConventionJS
    function ReadOnlyEditor(args)
    {
        var $input;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            $input = $("<span class='editor-text-readonly' />").appendTo(args.container);
            defaultValue = '';
        };

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.save = function()
        {
            // nada
        };

        scope.cancel = function()
        {
            // nada
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.focus = function() { };

        scope.setDirectValue = function(val)
        {
            defaultValue = val;
            if (val == null)
            {
                val = "";
            }
            $input.text(val);
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
            $input.select();
        };

        scope.serializeValue = function()
        {
            return defaultValue; // $input.text(); -- make sure the value is NEVER changed, which might happen when it goes 'through the DOM'
        };

        scope.applyValue = function(item, state)
        {
            args.grid.setDataItemValueForColumn(item, args.column, state);
        };

        scope.isValueChanged = function()
        {
            return false;
        };

        scope.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function ColorEditor(args)
    {
        var $input;
        var defaultValue;
        var scope = this;
        var isOpen = false;
        var $container = $(args.container);

        scope.init = function()
        {
            $input = $("<input type='color' />").appendTo($container).bind("keydown.nav", function(e)
            {
                if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT)
                {
                    e.stopImmediatePropagation();
                }
            }).focus().select();
            scope.show();
        };

        scope.destroy = function()
        {
            $input.spectrum("destroy");
            $input.remove();
            isOpen = false;
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.show = function()
        {
            if (!isOpen)
            {
                $input.spectrum({
                    className            : 'spectrumSlick',
                    clickoutFiresChange  : true,
                    showButtons          : false,
                    showPalette          : true,
                    showInput            : true,
                    showAlpha            : false,
                    showSelectionPalette : true,
                    maxPaletteSize       : 16,
                    preferredFormat      : "hex6",
                    appendTo             : "body",
                    flat                 : true,
                    palette              : [["#000000", "#262626", "#464646", "#626262", "#707070", "#7D7D7D", "#898989", "#959595", "#A0A0A0", "#ACACAC",
                        "#B7B7B7", "#C2C2C2", "#D7D7D7", "#E1E1E1", "#EBEBEB", "#FFFFFF"],
                        ["#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#ED1C24", "#FFF200", "#00A651", "#00AEEF", "#2E3192", "#EC008C"],
                        ["#F7977A", "#F9AD81", "#FDC68A", "#FFF79A", "#C4DF9B", "#A2D39C", "#82CA9D", "#7BCDC8", "#6ECFF6", "#7EA7D8", "#8493CA", "#8882BE",
                            "#A187BE", "#BC8DBF", "#F49AC2", "#F6989D"],
                        ["#F26C4F", "#F68E55", "#FBAF5C", "#FFF467", "#ACD372", "#7CC576", "#3BB878", "#1ABBB4", "#00BFF3", "#438CCA", "#5574B9", "#605CA8",
                            "#855FA8", "#A763A8", "#F06EA9", "#F26D7D"],
                        ["#ED1C24", "#F26522", "#F7941D", "#FFF200", "#8DC73F", "#39B54A", "#00A651", "#00A99D", "#00AEEF", "#0072BC", "#0054A6", "#2E3192",
                            "#662D91", "#92278F", "#EC008C", "#ED145B"],
                        ["#9E0B0F", "#A0410D", "#A36209", "#ABA000", "#598527", "#1A7B30", "#007236", "#00746B", "#0076A3", "#004B80", "#003471", "#1B1464",
                            "#440E62", "#630460", "#9E005D", "#9E0039"],
                        ["#790000", "#7B2E00", "#7D4900", "#827B00", "#406618", "#005E20", "#005826", "#005952", "#005B7F", "#003663", "#002157", "#0D004C",
                            "#32004B", "#4B0049", "#7B0046", "#7A0026"]]
                });
                isOpen = true;
            }
            $input.spectrum("show");
        };

        scope.hide = function()
        {
            if (isOpen)
            {
                $input.spectrum("hide");
                isOpen = false;
            }
        };

        scope.position = function(position)
        {
            if (!isOpen)
            {
                return;
            }
            //$cp.css("top", position.top + 20).css("left", position.left);
        };

        scope.focus = function()
        {
            scope.show();
            $input.focus();
        };

        scope.setDirectValue = function(val)
        {
            if (val == null)
            {
                val = "";
            }
            $input.spectrum("set", val);
            defaultValue = scope.serializeValue();
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
            $input.select();
        };

        scope.serializeValue = function()
        {
            return $input.spectrum("get").toString();
        };

        scope.applyValue = function(item, state)
        {
            args.grid.setDataItemValueForColumn(item, args.column, state);
        };

        scope.isValueChanged = function()
        {
            assert(defaultValue !== null);
            var v = scope.serializeValue();
            return v !== defaultValue;
        };

        scope.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }


    //noinspection FunctionNamingConventionJS
    function TransposedEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        scope.realEditor = args.item.field.editor;

        scope.init = function()
        {
            // scope.realEditor = args.item.field.editor;
            scope.realEditor(args);
            //scope.realEditor.init();
        };

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        scope.serializeValue = function()
        {
            return $input.val();
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
            item[args.column.field] = state;


        };

        /* scope.applyValue = function(item, state)
         {
         scope.realEditor.applyValue(item, state);

         if (item.field.setBackingStoreValue)
         {
         item.field.setBackingStoreValue(args.column, item, state);
         }
         item[args.column.field] = state;
         //update the object providing the transposed value.


         };*/

        scope.isValueChanged = function()
        {

            return scope.realEditor.isValueChanged();

        };

        scope.validate = function()
        {
            return scope.realEditor.validate();
        };

        scope.init();
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

        scope.init = function()
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

        scope.destroy = function()
        {
            $input.spectrum("destroy");
            $input.remove();
            isOpen = false;
        };

        scope.focus = function()
        {
            scope.show();
            $input.focus();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            if (isOpen)
            {
                $input.spectrum("hide");
                isOpen = false;
            }
        };

        scope.show = function()
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
                    palette               : [["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)",
                        "rgb(255, 255, 255)"],
                        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)",
                            "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)",
                            "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)",
                            "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)",
                            "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)",
                            "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                            "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)",
                            "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)",
                            "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)",
                            "rgb(76, 17, 48)"]]
                }, scope);
                isOpen = true;
            }
            $input.spectrum("show");
        };

        scope.position = function(position)
        {
            if (!isOpen)
            {
                return;
            }
            //$cp.css("top", position.top + 20).css("left", position.left);
        };


        scope.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            $input.spectrum("set", val);
            defaultValue = scope.serializeValue();
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        scope.serializeValue = function()
        {
            return $input.val();
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
            //args.grid.setDataItemValueForColumn(item, args.column, state);
        };

        scope.isValueChanged = function()
        {
            assert(defaultValue !== null);
            var v = scope.serializeValue();
            return v !== defaultValue;

        };

        scope.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
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

        scope.init = function()
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

        scope.destroy = function()
        {
            $select.multiselect("destroy");
            $select.remove();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $select.hide();
        };

        scope.show = function()
        {
            $select.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.focus = function()
        {
            $select.focus();
        };

        scope.setDirectValue = function(val)
        {
            var key = getKeyFromKeyVal(opt, val);
            key = opt[key].key;
            defaultValue = key;
            $select.val(key);
            $select.multiselect("refresh");
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $select.select();
        };

        scope.serializeValue = function()
        {
            return $select.val();
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return scope.serializeValue() !== defaultValue;
        };

        scope.validate = function()
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

        scope.init = function()
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

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        scope.serializeValue = function()
        {
            return $input.val();
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;


        };


        scope.isValueChanged = function()
        {
            return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
        };

        scope.validate = function()
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

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedIntegerEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        scope.init = function()
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


        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.setDirectValue = function(val)
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

        scope.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        scope.serializeValue = function()
        {
            return parseInt($input.val(), 10) || 0;
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;


        };

        scope.isValueChanged = function()
        {
            return (!($input.val() == "" && defaultValue === null)) && ($input.val() != defaultValue);
        };

        scope.validate = function()
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

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedFloatEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        scope.init = function()
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

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.setDirectValue = function(val)
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

        scope.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $input.select();
        };


        scope.serializeValue = function()
        {
            var v = $input.val();
            if (v === '')
            {
                return 0.0;
            }
            return parseFloat(applyModifier(defaultValue, v)) || 0.0;
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;


        };


        scope.isValueChanged = function()
        {
            return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
        };

        scope.validate = function()
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

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedPercentEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        scope.init = function()
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

        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        scope.loadValue = function(item)
        {
            var percentValue = 0;
            var decimalValue = 0;
            defaultValue = item[args.column.field];
            if (_.isNumber(defaultValue))
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


        scope.serializeValue = function()
        {
            var intValue = parseInt($input.val(), 10) || 0;
            //noinspection UnnecessaryLocalVariableJS
            var decimalValue = intValue / 100;
            return decimalValue;
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;

        };


        scope.isValueChanged = function()
        {
            return (!($input.val() === "" && defaultValue === null)) && ($input.val() !== defaultValue);
        };

        scope.validate = function()
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

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function TransposedCheckboxEditor(args)
    {
        var $select;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus ='true'>").appendTo(args.container).focus().select();
            defaultValue = false;
        };

        scope.destroy = function()
        {
            $select.remove();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $select.hide();
        };

        scope.show = function()
        {
            $select.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.focus = function()
        {
            $select.focus();
        };

        scope.setDirectValue = function(val)
        {
            val = !!val;
            defaultValue = val;
            $select.prop('checked', val);
        };

        scope.loadValue = function(item)
        {
            scope.setDirectValue(item[args.column.field]);
            $select.select();
        };

        scope.serializeValue = function()
        {
            return $select.prop('checked');
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;
        };

        scope.isValueChanged = function()
        {
            return (scope.serializeValue() !== defaultValue);
        };

        scope.validate = function()
        {
            return {
                valid : true,
                msg   : null
            };
        };

        scope.init();
    }

    //noinspection FunctionNamingConventionJS
    function DataPointTextEditor(args)
    {
        //noinspection LocalVariableNamingConventionJS
        var $input;
        var defaultValue;
        var scope = this;

        scope.init = function()
        {
            $input = $("<INPUT type=text class='editor-text' />");
            $input.bind("keydown.nav", function(e)
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT)
                {
                    if (!((e.target.selectionStart === e.target.value.length) && (e.keyCode === $.ui.keyCode.RIGHT) ||
                        (e.target.selectionStart === 0) && (e.keyCode === $.ui.keyCode.LEFT)))
                    {
                        e.stopImmediatePropagation();
                    }
                }
            });
            $input.appendTo(args.container).focus().select();
            defaultValue = 0;
        };


        scope.destroy = function()
        {
            $input.remove();
        };

        scope.focus = function()
        {
            $input.focus();
        };

        scope.save = function()
        {
            args.commitChanges();
        };

        scope.cancel = function()
        {
            scope.setDirectValue(defaultValue);
            args.cancelChanges();
        };

        scope.hide = function()
        {
            $input.hide();
        };

        scope.show = function()
        {
            $input.show();
        };

        scope.position = function(position)
        {
            // nada
        };

        scope.setDirectValue = function(val)
        {
            if (val === null)
            {
                val = "";
            }
            defaultValue = val;
            $input.val(val);
            $input[0].defaultValue = val;
        };

        scope.loadValue = function(item)
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


        scope.serializeValue = function()
        {
            return $input.val();
        };

        scope.applyValue = function(item, state)
        {
            item[args.column.field] = state;

        };


        scope.isValueChanged = function()
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


        scope.validate = function()
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

        scope.init();
    }


    //noinspection FunctionNamingConventionJS
    function applyModifier(val, mod)
    {
        var m = isValidModifier(mod);
        if (!m)
        {
            return mod;
        }
        var dv = parseFloat(val);
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
        assert(0); // should never get here
    }

    //noinspection FunctionNamingConventionJS
    function isValidModifier(v)
    {
        var sv = v.toString().trim();
        var ope = sv.charAt(0);
        if ("+-*/".indexOf(ope) < 0)
        {
            return false;
        }  // no good if it does not start with an operation
        sv = sv.substr(1);    //remove first char
        if (sv.indexOf('+') >= 0 || sv.indexOf('-') >= 0 || sv.indexOf('*') >= 0 || sv.indexOf('/') >= 0)
        {
            return false;
        }  // no more signs please.
        var pct = false;
        if (sv.charAt(sv.length - 1) === '%')
        {
            pct = true;
            sv = sv.slice(0, -1);    // remove also the % char if it is there
        }
        // what remains must be a number
        if (isNaN(sv))
        {
            return false;
        }
        return {
            operator  : ope,
            isPercent : pct,
            value     : parseFloat(sv) / (pct ? 1 : 100)         // when it is a percentage, produce the equivalent perunage
        };
    }



    //noinspection FunctionNamingConventionJS
    function RowEditor(args)
    {
        var theEditor;
        var scope = this;
        scope.init = function()
        {
            //var data = args.grid.getData();
            if (args.item.editor === undefined)
            {
                theEditor = new ReadOnlyEditor(args);
            } else
            {
                theEditor = new (args.item.editor)(args);
            }
        };

        scope.destroy = function()
        {
            theEditor.destroy();
        };

        scope.save = function()
        {
            theEditor.save();
        };

        scope.cancel = function()
        {
            theEditor.cancel();
        };

        scope.hide = function()
        {
            theEditor.hide();
        };

        scope.show = function()
        {
            theEditor.show();
        };

        scope.position = function(position)
        {
            theEditor.position(position);
        };

        scope.focus = function()
        {
            theEditor.focus();
        };

        scope.setDirectValue = function(val)
        {
            theEditor.setDirectValue(val);
        };

        scope.loadValue = function(item)
        {
            theEditor.loadValue(item);
        };

        scope.serializeValue = function()
        {
            return theEditor.serializeValue();
        };

        scope.applyValue = function(item, state)
        {
            theEditor.applyValue(item, state);
        };

        scope.isValueChanged = function()
        {
            return theEditor.isValueChanged();
        };

        scope.validate = function()
        {
            return theEditor.validate();
        };

        scope.init();
    }

})(jQuery);

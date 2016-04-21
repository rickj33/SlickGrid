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


        function TransposedColorEditor(args)
        {
            //noinspection LocalVariableNamingConventionJS

            var scope = this;
            scope.args = args;
            scope.$input = null;

            scope.defaultValue = scope.args.item[scope.args.column.field];
            scope.isOpen = false;
            scope.$container = $(scope.args.container);

            scope.init = function()
            {
                scope.$input = $("<input type='text' class='editor-text' id='colorEditor'  />");

                scope.$input.bind("keydown.nav", function(e)
                {
                    if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT)
                    {
                        e.stopImmediatePropagation();
                    }
                });

                scope.$input.appendTo(scope.$container);

                scope.$input.focus().select();
                scope.show();
            };

            scope.destroy = function()
            {
                scope.$input.spectrum("destroy");
                scope.$input.remove();
                scope.isOpen = false;
            };

            scope.focus = function()
            {
                scope.show();
                scope.$input.focus();
            };

            scope.save = function()
            {
                scope.args.commitChanges();
            };

            scope.cancel = function()
            {
                scope.setDirectValue(scope.defaultValue);
                scope.args.cancelChanges();
            };

            scope.hide = function()
            {
                if (scope.isOpen)
                {
                    scope.$input.spectrum("hide");
                    scope.isOpen = false;
                }
            };

            scope.show = function()
            {
                if (!scope.isOpen)
                {
                    scope.$input.spectrum({
                        ignoreClickOutEvent : true,
                        color                : scope.defaultValue,
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
                            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)",
                                "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)",
                                "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)",
                                "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)",
                                "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)",
                                "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)",
                                "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)",
                                "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)",
                                "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)",
                                "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]]
                    }, scope);
                    scope.isOpen = true;
                    scope.$input.spectrum("show");
                }

            };

            scope.position = function(position)
            {
                if (!scope.isOpen)
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
                scope.$input.spectrum("set", val);
                scope.defaultValue = scope.serializeValue();
            };

            scope.loadValue = function(item)
            {
                scope.setDirectValue(item[scope.args.column.field]);
                scope.$input.select();
            };


            scope.serializeValue = function()
            {
                return scope.$input.val();
            };

            scope.applyValue = function(item, state)
            {
                item[scope.args.column.field] = state;
            };

            scope.isValueChanged = function()
            {
                // assert(scope.defaultValue !== null);
                var v = scope.serializeValue();
                return v !== scope.defaultValue;

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


            this.init();

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
            this.init = function()
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

            this.position = function(position)
            {
                theEditor.position(position);
            };

            this.focus = function()
            {
                theEditor.focus();
            };

            this.setDirectValue = function(val)
            {
                theEditor.setDirectValue(val);
            };

            this.loadValue = function(item)
            {
                theEditor.loadValue(item);
            };

            this.serializeValue = function()
            {
                return theEditor.serializeValue();
            };

            this.applyValue = function(item, state)
            {
                theEditor.applyValue(item, state);
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

    })(jQuery);

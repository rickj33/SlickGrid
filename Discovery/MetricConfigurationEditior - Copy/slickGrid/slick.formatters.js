/***
 * Contains basic SlickGrid formatters.
 *
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 *
 * @module Formatters
 * @namespace Slick
 */

(function ($)
{
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Formatters": {
                "PercentComplete"    : PercentCompleteFormatter,
                "PercentCompleteBar" : PercentCompleteBarFormatter,
                "YesNo"              : YesNoFormatter,
                "Checkmark"          : CheckmarkFormatter,
                "Checkbox"          : CheckboxFormatter,
                "Date"                 : DateFormatter,
                "TransposedColor"    : TransposedColorFormatter,
                "TransposedFormatter": TransposedFormatter,
                "TransposedCheckbox" : TransposedCheckboxFormatter,
                 "TransposedCheckmark" : TransposedCheckmarkFormatter,
                 "TransposedPercent"   : TransposedPercentFormatter

            }
        }
    });

    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function PercentCompleteFormatter(row, cell, value, columnDef, dataContext)
    {
        if (value === null || value === "")
        {
            return "-";
        } else if (value < 50)
        {
            return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
        } else
        {
            return "<span style='color:green'>" + value + "%</span>";
        }
    }

    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function CheckboxFormatter(row, cell, value, columnDef, dataContext)
    {
        return value ?  "<input type='checkbox' checked='checked'>": "<input type='checkbox'>";
    }

    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function DateFormatter(row, cell, value, columnDef, dataContext)
    {
        if (value === null || value === "")
        {
            return "";
        }
        //noinspection UnnecessaryLocalVariableJS
        var result = moment(value).format('MM-DD-YYYY hh:mm a');
        return result;

    }

    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext)
    {
        if (value === null || value === "")
        {
            return "";
        }

        var color;

        if (value < 30)
        {
            color = "red";
        } else if (value < 70)
        {
            color = "silver";
        } else
        {
            color = "green";
        }

        return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
    }

    function TransposedFormatter(row, cell, value, columnDef, dataContext)
    {
        if (value === null || value === "")
        {
            return "";
        }

        if (dataContext.field.formatter)
        {
            return dataContext.field.formatter(row, cell, value, columnDef, dataContext);
        }

        return value;
    }

     //noinspection JSUnusedLocalSymbols
    function TransposedPercentFormatter(row, cell, value, columnDef, dataContext)
    {
        if (value === null || value === "")
        {
            return 0;
        }


        return convertToPercent(value);
    }

  function   convertToPercent(value)
    {

        //noinspection UnnecessaryLocalVariableJS
        var percentValue = value;



        return  percentValue * 100;
    }

    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function TransposedColorFormatter(row, cell, value, columnDef, dataContext)
    {
        if (value === null || value === "")
        {
            return "";
        }

        return "<span  style='color:" + value + "'>" + value + "</span>";
    }



    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function TransposedCheckboxFormatter(row, cell, value, columnDef, dataContext)
    {
        return value ? "<input type='checkbox' checked='checked'>": "<input type='checkbox'>";

    }

  function TransposedCheckmarkFormatter(row, cell, value, columnDef, dataContext)
    {
         return value ? "<img src='images/tick.png'>" : "";

    }

    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function YesNoFormatter(row, cell, value, columnDef, dataContext)
    {
        return value ? "Yes" : "No";
    }

    //noinspection JSUnusedLocalSymbols
    /**
     * @return string
     */
    function CheckmarkFormatter(row, cell, value, columnDef, dataContext)
    {
        return value ? "<img src='images/tick.png'>" : "";
    }
})(jQuery);

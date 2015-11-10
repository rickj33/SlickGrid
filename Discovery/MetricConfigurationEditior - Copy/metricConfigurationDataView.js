function MetricConfiguationDataView(metricConfiguration)
{

    var DynamicPropertyType = {
        Boolean : 1,
        Int     : 2,
        Double  : 3,
        String  : 4,
        Color   : 5,
        Percent : 6
    };

    var _items = [];
    var _rows = [];
    var _currentColumnId = 0;

    var enabledColumnId = -1;
    var _propertyNameColumnId = -1;
    var _metricConfiguration = metricConfiguration;

    var _breaks = metricConfiguration.breaks;

    var _propertyRowLabels = _buildPropertyNameRows();
    var _columns = _buildColumns();

    var data = buildData();

    var _propertyNameColumn = undefined;


    var onRowsChanged = new Slick.Event();


    function destroy()
    {
        _propertyNameColumn = null;
        _columns.length = 0;
        _propertyRowLabels.length = 0;

    }

    function getColumns()
    {
        return _columns;
    }

    function getPropertyNameColumn()
    {

        if (!_propertyNameColumn)
        {
            var columnId = _getNextColumnId();
            _propertyNameColumn = {
                id          : columnId,
                name        : 'Property',
                field       : 'property',
                focusable   : false,
                minWidth    : 150,
                sortable    : false,
                resizable   : true,
                editor      : null,
                metricBreak : null,
                cssClass    : 'breakPropertyNames'
            };
            _propertyNameColumnId = columnId;
        }
        return _propertyNameColumn;
    }

    function _buildColumns()
    {
        var column;
        var columnsArray = [];

        columnsArray.push(getPropertyNameColumn());
        var breaks = _buildBreakColumns();
        var allColumns = _.union(columnsArray, breaks);

        return allColumns;
    }


    function _buildBreakColumns()
    {
        var columnsArray = [];
        var breaks = _metricConfiguration.breaks;
        for (var i = 0; i < breaks.length; i++)
        {
            //start off withe break columnnumber equal to 1, so the breaks names are one based. break1, break2 etc

            var breakColumnNumber = i + 1;
            var column = {
                id          : _getNextColumnId(),
                name        : 'Break ' + breakColumnNumber,
                field       : 'break' + i,
                minWidth    : 100,
                sortable    : false,
                resizable   : true,
                metricBreak : breaks[i], /*  editor            : Slick.Editors.TransposedEditor,
                 formatter         : Slick.Formatters.TransposedFormatter,*/
                /*   headerCssClass : 'breakHeaderName',
                 cssClass       : 'breakPropertyValues'*/

            };
            columnsArray.push(column);
        }
        return columnsArray;
    }

    function _buildPropertyNameRows()
    {
        var metricConfiguration = _metricConfiguration;

        var fields = _getAllPropertyFields(metricConfiguration);
        var propertyFields = [];

        var rowId = 0;
        _.forEach(fields, function(field)
        {
           //var editorFormatter = getEditorAndFormatter(field.propertyType);

            var breakField = {
                name         : field.propertyName,
                row          : rowId,
                propertyType : field.propertyType,
                display      : field.displayName,
                visible      : field.hidden,
                fromStyle    : true,
                readOnly     : field.readonly, // enabled         : field.enabled,
                /* editor          : editorFormatter.editor,
                 formatter       : editorFormatter.formatter*/
            };
            propertyFields.push(breakField);
            rowId++;
        });
        return propertyFields;

    }

    function _getAllPropertyFields(metricConfiguration)
    {
        /* var markerKey = metricConfiguration.getMarkerStylingClientKey();
         var breakKey = metricConfiguration.getBreakCalculationClientKey();
         var markerFields = MetricStylingService.getMarkerFields(markerKey);
         var breakCalcFields = MetricStylingService.getBreakCalcFields(breakKey);*/

        var markerFields = markerStylingOptions.properties;
        var breakCalcFields = breakCalculation.properties;
        var allFields = _.union(breakCalcFields, markerFields);
        return allFields;
    }


    function buildData(metricConfiguration)
    {

        for (var i = _propertyRowLabels.length - 1; i >= 0; i--)
        {
            //noinspection AssignmentResultUsedJS
            var rowNode = ( _rows[i] = {});

            var field = _propertyRowLabels[i];

            rowNode.field = field;

            for (var x = 0; x < _columns.length; x++)
            {
                var column = _columns[x];
                if (column.id === _propertyNameColumnId)
                {
                    rowNode[column.field] = field.display;
                    continue;
                }
                if (column.id === enabledColumnId)
                {
                    rowNode[column.field] = field.enabled;
                    continue;
                }
                var breakId = column.metricBreak ? column.metricBreak.id : -1;
                rowNode[column.field] = getPropertyValue(field.name, breakId);

            }
        }
    }


    function getPropertyValue(propertyName, breakId)
    {
        //-1 indicates the property is not part of a break, but part of the property set.
        var propBreak = _breaks[breakId];
        if (propBreak.breakValidationValues[propertyName] !== undefined)
        {
            return propBreak.breakValidationValues[propertyName];
        }
        if (propBreak.markerConfigurationValues[propertyName])
        {
            return propBreak.markerConfigurationValues[propertyName];
        }

        return null;

    }


    function _getNextColumnId()
    {
        var result = _currentColumnId;
        _currentColumnId++;
        return result;
    }

    function getEditorAndFormatter(propertyType)
    {

        var result = {
            editor    : undefined,
            formatter : undefined
        };

        if (propertyType === DynamicPropertyType.String)
        {
            result.editor = Slick.Editors.TransposedText;
            result.formatter = null;
            return result;
        }
        if (propertyType === DynamicPropertyType.Double)
        {
            result.editor = Slick.Editors.TransposedFloat;
            result.formatter = null;
            return result;
        }
        if (propertyType === DynamicPropertyType.Percent)
        {
            result.editor = Slick.Editors.TransposedPercent;
            result.formatter = Slick.Formatters.TransposedPercent;
            return result;
        }
        if (propertyType === DynamicPropertyType.Int)
        {
            result.editor = Slick.Editors.TransposedInteger;
            result.formatter = null;
            return result;
        }
        if (propertyType === DynamicPropertyType.Color)
        {
            result.editor = Slick.Editors.TransposedColor;
            result.formatter = Slick.Formatters.TransposedColor;
            return result;
        }
        if (propertyType === DynamicPropertyType.Boolean)
        {
            result.editor = Slick.Editors.TransposedCheckbox;
            result.formatter = Slick.Formatters.TransposedCheckbox;
            return result;
        }
        return Slick.Editors.TransposedText;
    }


    function getLength()
    {
        return _rows.length - 1;
    }

    /**
     * Return a item at row index `i`.
     * When `i` is out of range, return `null`.
     * @public
     * @param {Number} i index
     * @param {String} colId column ID
     * @returns {Object|null} item
     */
    function getItem(_x4, _x5)
    {

        var _again = true;

        _function: while (_again)
        {
            var i = _x4, colId = _x5;
            item = v = key = nested = undefined;
            _again = false;

            if (colId != null)
            {

                // `i` can be passed item `Object` type internally.
                var item = typeof i === 'number' ? getItem(i) : i, v = item && item[colId];

                if (v == null)
                {
                    for (var key in item)
                    {
                        if (item.hasOwnProperty(key))
                        {
                            var nested = item[key];
                            if (typeof nested === 'object')
                            {
                                _x4 = nested;
                                _x5 = colId;
                                _again = true;
                                continue _function;
                            }
                        }
                    }
                    return null;
                }
                return item;
            }
            return _rows[i] || null;
        }
    }


    function getValue(i, columnDef)
    {
        return getItem(i, columnDef.id) != null ? getItem(i, columnDef.id)[columnDef.field] : '';
    }


    /**
     * Notify changed.
     */
    function _refresh()
    {
        _rows = _genRowsFromItems(_items);
        onRowsChanged.notify();
    }



    function getItemMetadata(row, cell)
    {
        if(cell === _propertyNameColumnId){
            return {};
        }
        var rowData = row;
        var rowField = _rows[row].field;
        var editorFormatter = getEditorAndFormatter(rowField.propertyType);
        var columnsResult = {};
        columnsResult[cell] = {
            editor : editorFormatter.editor,
            formatter: editorFormatter.formatter,
        };

        var rowMetaData = {
            columns : columnsResult
        };
        return rowMetaData;
    }


    $.extend(this, {
        // methods
        "getColumns"            : getColumns,
        "getPropertyNameColumn" : getPropertyNameColumn,
        "buildData"             : buildData,
        "getPropertyValue"      : getPropertyValue,
        "getLength"             : getLength,
        "getItem"               : getItem,
        "getValue"              : getValue,

        "getItemMetadata" : getItemMetadata,

        "destroy" : destroy,

        "onRowsChanged" : onRowsChanged
    });

}


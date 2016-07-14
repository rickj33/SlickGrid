var TestApp = function()
{
  //  this.removeText = 'Remove selected from dataset';
  this._columns = [];
  this.grid = null;

  this.copyManagerOptions = {
    startPasteColumn: 1,
    includeHeaderWhenCopying: true,
    fieldNameStartValue: 1000,
    dataItemColumnValueExtractor: function(item, columnDef)
    {
      return item[columnDef.field];
    }
  };

  this.defaultColumns = [
  {
    "propertyId": 21,
    "name": "A",
    "field": "21"
  }];

  this.handler = new Slick.EventHandler();
  this.pasteManager = new Slick.ExternalPasteManager(this._getCopyManagerPluginOptions());
  this.checkboxSelector = new Slick.CheckboxSelectColumn(
  {
    cssClass: 'slick-cell-checkboxsel' // jshint ignore:line
  });

  this._dataview = new Slick.Data.DataView();

  this.overrideEdit = false;

  this._buildGridColumns = TestApp.prototype._buildGridColumns.bind(this);

  this.handleOnPasteCells = TestApp.prototype.handleOnPasteCells.bind(this);
  this.handleRowCountChanged = TestApp.prototype.handleRowCountChanged.bind(this);
  this.handleRowsChanged = TestApp.prototype.handleRowsChanged.bind(this);
  this.handleSort = TestApp.prototype.handleSort.bind(this);
};

TestApp.prototype.init = function()
{

  var options = {
    enableCellNavigation: true,
    editable: true,
    autoEdit: true,
    enableAddRow: true,
    asyncEditorLoading: false,
    forceFitColumns: true
  };
  var columns = this._buildGridColumns(this.defaultColumns);

  this.grid = new Slick.Grid("#myGrid", this._dataview, columns, options);

  this.overrideEdit = true;
  this.grid.setSelectionModel(new Slick.RowSelectionModel(
  {
    selectActiveRow: false
  }));

  this.grid.registerPlugin(this.pasteManager);
  this.grid.registerPlugin(this.checkboxSelector);

  this.handler.subscribe(this.pasteManager.onPasteCells, this.handleOnPasteCells);

  this.handler.subscribe(this.pasteManager.onValidationError, this.handleOnValidationError);
  this.handler.subscribe(this.grid.onSort, this.handleSort);

  if (this._dataview.onRowCountChanged !== undefined)
  {
    this.handler.subscribe(this._dataview.onRowCountChanged, this.handleRowCountChanged);
  }
  if (this._dataview.onRowsChanged !== undefined)
  {
    this.handler.subscribe(this._dataview.onRowsChanged, this.handleRowsChanged);
  }

  this.grid.getCanvasNode().focus();

  //clear the selection set.
  this.grid.getSelectionModel().setSelectedRanges([]);
  this.grid.resizeCanvas();
};



TestApp.prototype.handleRowCountChanged = function()
{
  this.grid.updateRowCount();
  this.grid.render();
};


TestApp.prototype.handleRowsChanged = function(e, args)
{
  if (args && args.rows)
  {
    this.grid.invalidateRows(args.rows);
  }
  else
  {
    this.grid.invalidateAllRows();
  }
  this.grid.render();
};


TestApp.prototype.handleOnPasteCells = function(e, args)
{


  //get all the columns but the first one, which is the checkbox
  //var columns = _.tail(this.grid.getColumns());

  var parseResults = args.parseResults;
  var columns = parseResults.meta.fields;
  // var columns = this.grid.getColumns();

  this.overrideEdit = true;
  var updatedColumns = this._buildGridColumns(columns);

  this.grid.setColumns(updatedColumns);
  //clear the selection set.
    this.grid.autosizeColumns();
  this.grid.getSelectionModel().setSelectedRanges([]);
  this.grid.resizeCanvas();
};

TestApp.prototype.handleOnValidationError = function(e, args) {



};

TestApp.prototype._buildGridColumns = function(columns)
{
  var result = [];
  /*var columns =*/

  for (var i = 0; i < columns.length; i++)
  {
    //noinspection MagicNumberJS,MagicNumberJS
    var column = {
      id: i,
      name: columns[i],
      field: columns[i],
      minWidth: 160,
      sortable: true,
      resizable: true,
      editor: Slick.Editors.Text
    };
    result.push(column);
  }
  return result;
};


TestApp.prototype.handleSort = function(e, args)
{
  // This will fire the change events and update the grid.
  if(args.sortCol){
  this._dataview.fastSort(args.sortCol.field, args.command === 'sort-asc');
}
};

TestApp.prototype._getCopyManagerPluginOptions = function()
{


  //noinspection MagicNumberJS,MagicNumberJS
  var pluginOptions = {
    startPasteColumn: 1,
    includeHeaderWhenCopying: true,
    fieldNameStartValue: 1000,
    dataItemColumnValueExtractor: function(item, columnDef)
    {
      return item[columnDef.field];
    }
  };
  return pluginOptions;
};
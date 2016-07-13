   var TestPastParsingModel = function()
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
     this.copyManager = new Slick.CellExternalCopyManager(this._getCopyManagerPluginOptions());
     this.checkboxSelector = new Slick.CheckboxSelectColumn(
     {
       cssClass: 'slick-cell-checkboxsel' // jshint ignore:line
     });

     this._dataview = new Slick.Data.DataView();

     this.overrideEdit = false;

     this._buildGridColumns = TestPastParsingModel.prototype._buildGridColumns.bind(this);

     this.handleOnPasteCells = TestPastParsingModel.prototype.handleOnPasteCells.bind(this);
   };


   TestPastParsingModel.prototype.init = function()
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


     var grid = new Slick.Grid("#myGrid", this._dataview, columns, options);

     this.overrideEdit = true;
        grid.setSelectionModel( new Slick.RowSelectionModel({selectActiveRow : false}));
     grid.registerPlugin(this.copyManager);
     grid.registerPlugin(this.checkboxSelector);
 

     this.handler.subscribe(this.copyManager.onPasteCells, this.handleOnPasteCells);
     grid.getCanvasNode().focus();

     //clear the selection set.
     grid.getSelectionModel().setSelectedRanges([]);
     grid.resizeCanvas();
   };



   TestPastParsingModel.prototype.handleOnPasteCells = function(e, args)
   {
     this.grid

     //get all the columns but the first one, which is the checkbox
     //var columns = _.tail(this.grid.getColumns());

 var columns = this.grid.getColumns();

     this.overrideEdit = true;
    var updatedColumns = this._buildGridColumns(columns);

     this.grid.setColumns(updatedColumns);
     //clear the selection set.
     grid.getSelectionModel().setSelectedRanges([]);
     grid.resizeCanvas();
   };


   TestPastParsingModel.prototype._buildGridColumns = function(columns)
   {
     var result = [];
     /*var columns =*/

     for (var i = 0; i < columns.length; i++)
     {
       //noinspection MagicNumberJS,MagicNumberJS
       var column = {
         id: i,
         name: columns[i].name,
         field: columns[i].field,
         minWidth: 160,
         sortable: true,
         resizable: true,
         editor: Slick.Editors.Text
       };
       result.push(column);
     }
     return result;
   };



   TestPastParsingModel.prototype._getCopyManagerPluginOptions = function()
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
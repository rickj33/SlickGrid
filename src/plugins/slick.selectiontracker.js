(function ($) {
  $.extend(true, window, {
    Slick: {
      SelectionTracker: SelectionTracker
    }
  });

  function SelectionTracker(options) {
    //noinspection JSUnusedLocalSymbols
      var _destroyed = false;
    var
      self = this,
      _grid,
      _options,
      _loader,
      _rowSelectionModel,
      _handler = new Slick.EventHandler(),
      _selectionChanged = new Slick.Event(),
      _selection = [],

      _identities = null,
      _defaults = {
        idMember: "id",
        useIdentities: false,
        identitiesAttribute: "identities"
      };

    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _rowSelectionModel = grid.getSelectionModel();
      _loader = _options.loader;

      if (_rowSelectionModel && _rowSelectionModel.onSelectionChanged) {
        _handler.subscribe(_rowSelectionModel.onSelectionChanged, handleSelectionChanged);
      }

      if (_loader) {
        _handler.subscribe(_loader.onDataLoaded, handleLoaderDataLoaded);
        setSelection(_.map(_loader.data, _options.idMember));
      }
    }

    function destroy() {
        if (!_destroyed){
            _destroyed = true;
      _handler.unsubscribeAll();
    }
    }

    //noinspection JSUnusedLocalSymbols
    function handleSelectionChanged(e, args) {
      var
        PAGE_SIZE = 50,
        id, idx, idents,
        gridData = _grid.getData(),
        deletedIDs = [],
        addedIDs = [];

      if (args.deletes && args.deletes.length) {
        if (_options.useIdentities){
          idents = _loader.getIdentities();
          _.forEach(args.deletes, function(row) {
            id = idents[row];
            idx = _selection.indexOf(id);
            if (idx > -1) {
              deletedIDs.push(id);
              _selection.splice(idx,1);
            }
          });
        } else {
          // obsolete
          if (args.deletes.length >= PAGE_SIZE) {
            deletedIDs = 'page';
          } else {
            _.forEach(args.deletes, function(row) {
              id = gridData[row][_options.idMember];
              idx = _selection.indexOf(id);
              if (idx > -1) {
                deletedIDs.push(id);
                _selection.splice(idx,1);
              }
            });
          }
        }
      }
      else if (args.selection && args.selection.length) {
        if (_options.useIdentities) {
          idents = _loader.getIdentities();
          _.forEach(args.selection, function(row) {
            id = idents[row];
            addedIDs.push(idents[row]);
            idx = _selection.indexOf(id);
            if (idx == -1) {
              addedIDs.push(id);
              _selection.push(id);
            }
          });
        } else {
          // obsolete
          if (args.selection.length >= PAGE_SIZE) {
            addedIDs = 'page';
          } else {
            _.forEach(args.selection, function(row) {
              id = gridData[row][_options.idMember];
              idx = _selection.indexOf(id);
              if (idx == -1) {
                addedIDs.push(id);
                _selection.push(id);
              }
            });
          }
        }
      }

      _selectionChanged.notify({
        added: addedIDs,
        removed: deletedIDs,
        selection: _selection
      });
    }

    //noinspection JSUnusedLocalSymbols
    function handleLoaderDataLoaded(e, args) {
      var
      _identities = args[options.identitiesAttribute];
      _grid.updateRowCount();
      _grid.render();
    }

    function getSelection() {
      return _selection;
    }

    function setSelection(ids) {
      _selection = ids || [];
      var
        d = _grid.getData(), id,
        selectedRows = [];

      _.forEach(d, function(v, k) {
        if (!v) return;
        id = v[options.idMember];
        if (id && _selection.indexOf(id) > -1) {
          selectedRows.push(k);
        }
      });

      _grid.setSelectedRows(selectedRows);
    }

    function clearSelection() {
      _selection = [];
    }

    // public api
    return {
      "init": init,
      "destroy": destroy,

      "getSelection": getSelection,
      "setSelection" : setSelection,
      "clearSelection": clearSelection,
      "selectionChanged": _selectionChanged
    };
  }
})(jQuery);

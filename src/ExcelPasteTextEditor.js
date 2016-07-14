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

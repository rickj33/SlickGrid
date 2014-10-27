Ha!  That’s exactly what I do, and what I was going to tell you to do!  ;-)  If you want a quick jump-start, here’s a couple snippets that demonstrate how I do it (these aren’t complete examples;  these are snippets from a larger body of code;  I think everything you need to get up and running is here, though):

 

The data arrives in a JSON object something like this:

{

                "ColumnHeadings": ["MsgID", "LastName", "FirstName"],

                "RowData": [      ["1", "Smith", "Bob"],

                                                ["2", "Jones", "Sally"] ]

}

 

All that’s needed to get the data on-screen is:

 

                var gridQMsgs;

                var gridQMsgsColumns = [];                                          

                var gridQMsgsOptions = {...whatever...};

                var gridQMsgsDataView = new Slick.Data.DataView(); ;

                var gridQMsgsData = [];

 

// This tracks index in the data array that's associated with each column

                // It’ll be used to populate the “field:xxx” field for each column definition

                var iCnt = 0;       

                //push all the column definitions.

                jQuery.each(jsonResp.ColumnHeadings, function () {

                                var colSpec = { id: this, name: this, field: iCnt, sortable: true};

                                gridQMsgsColumns.push(colSpec)

                                iCnt += 1;             // Next column index

                                return (true); // returning false halts iteration

                });

 

                //Create the SlickGrid in the specified Div

                gridQMsgs = new Slick.Grid("#DivToHoldGrid", gridQMsgsDataView, gridQMsgsColumns, gridQMsgsOptions);

 

                // Create reference to data for convenience

                gridQMsgsData = jsonResp["RowData"];

 

                // Get the data on-screen/populate the DataView

                gridQMsgsDataView.setItems(gridQMsgsData, 0);

 

 
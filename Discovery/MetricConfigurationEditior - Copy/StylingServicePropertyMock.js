var markerStylingOptions = 
{
	"datasetType": 0,
	"name": "Area",
	"description": "",
	"configurationId": "Area",
	"clientKey": "area",
	"properties": [
	{
		"readonly": false,
		"hidden": false,
		"propertyName": "fillColor",
		"displayName": "Fill Color",
		"propertyType": 5,
		"defaultValue": "blue"
	},
	{
		"readonly": false,
		"hidden": false,
		"propertyName": "fillOpacity",
		"displayName": "Fill Opacity",
		"propertyType": 6,
		"defaultValue": 0.75
	},
	{
		"readonly": false,
		"hidden": false,
		"propertyName": "weight",
		"displayName": "Border Width",
		"propertyType": 2,
		"defaultValue": 1
	},
	{
		"readonly": false,
		"hidden": false,
		"propertyName": "color",
		"displayName": "Border Color",
		"propertyType": 5,
		"defaultValue": "black"
	},
	{
		"readonly": false,
		"hidden": false,
		"propertyName": "opacity",
		"displayName": "Border Opacity",
		"propertyType": 6,
		"defaultValue": 1
	},
	{
		"readonly": false,
		"hidden": false,
		"propertyName": "stroke",
		"displayName": "Show Border",
		"propertyType": 1,
		"defaultValue": true
	}
	]
};

var breakCalculation = {
 "configurationId": "EqualSizeDataRange",
      "clientKey": "rangevalidator",
      "properties": [
        {
          "readonly": false,
          "hidden": false,
          "propertyName": "min",
          "displayName": "Min Value",
          "propertyType": 3,
          "defaultValue": 0
        },
        {
          "readonly": false,
          "hidden": false,
          "propertyName": "max",
          "displayName": "Max Value",
          "propertyType": 3,
          "defaultValue": 0
        },
        {
          "readonly": false,
          "hidden": false,
          "propertyName": "mininclusive",
          "displayName": "Min Inclusive",
          "propertyType": 1,
          "defaultValue": true
        },
        {
          "readonly": false,
          "hidden": false,
          "propertyName": "maxinclusive",
          "displayName": "Max Inclusive",
          "propertyType": 1,
          "defaultValue": false
        }
      ],
      "name": "Equal Size Data Range"


}
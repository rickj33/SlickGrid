
   var mapTreeStructure =  {
                  "id": "maps/2",
                  "legendTitle": "Map test legend",
                  "name": "TestMapForDisplay",
                  "ownerId": "owner/1",
                  "description": "test description",
                  "layers": [
                      {
                          "name": "Test Layer",
                          "dataSet": {
                              "ownerId":"owner/1",
                              "dataPoints": [
                                  {
                                      "geoId": "48167720302",
                                      "stateName": "Texas",
                                      "countyName": "Galveston",
                                      "featureContainer": "48167.topojson",
                                      "name": "7203.02",
                                      "dataValue": 0.0,
                                      "id": 0,
                                      "value": "0.0",
                                      "databaseId": "geography/66274",
                                      "key": "48167720302",
                                      "latitude": 29.5027403,
                                      "longitude": -95.2071109,
                                      "properties": [],
                                      "dataPointType": 0
                                  },
                                  {
                                      "geoId": "48167720502",
                                      "stateName": "Texas",
                                      "countyName": "Galveston",
                                      "featureContainer": "48167.topojson",
                                      "name": "7205.02",
                                      "dataValue": 0.0,
                                      "id": 1,
                                      "value": "0.0",
                                      "databaseId": "geography/66275",
                                      "key": "48167720502",
                                      "latitude": 29.4848585,
                                      "longitude": -95.116607,
                                      "properties": [],
                                      "dataPointType": 0
                                  }
                              ],
                              "dataSetConfiguration": {
                                  "columns": [
                                      {
                                          "name": "State",
                                          "field": "stateName",
                                          "width": 100
                                      },
                                      {
                                          "name": "County",
                                          "field": "countyName",
                                          "width": 100
                                      },
                                      {
                                          "name": "Census Tract",
                                          "field": "name",
                                          "width": 100
                                      },
                                      {
                                          "name": "GeoId",
                                          "field": "geoId",
                                          "width": 100
                                      },
                                      {
                                          "name": "Value",
                                          "field": "value",
                                          "width": 40
                                      },
                                      {
                                          "name": "Key",
                                          "field": "key",
                                          "width": 40
                                      }
                                  ],
                                  "geographyType": 3,
                                  "geographyTypeCode": 3,
                                  "dataSetType": 0
                              },
                              "geographyType": 3,
                              "dataSetType": 0,
                              "id": "DataSets/2",
                              "name": "TestMapForDisplay",
                              "etag": null,
                              "lastModified": "0001-01-01T00:00:00"
                          },
                          "featureContainerNames": [
                              "48167.topojson",
                              "48201.topojson",
                              "48039.topojson"
                          ],
                          "style": {
                              "breaks": [
                                  {
                                      "id": 0,
                                      "dataPointKeys": [
                                          "48167720302",
                                          "48167720502",
                                        
                                      ],
                                      "style": {
                                          "id": 0,
                                          "fillColor": "#FFFFFF",
                                          "fillOpacity": 1.0,
                                          "borderWidth": 1,
                                          "borderColor": "black",
                                          "borderOpacity": 1.0
                                      },
                                      "minValue": 0.0,
                                      "maxValue": 0.0,
                                      "numberOfDataPoints": 904,
                                      "roundingDigits": 0,
                                      "legendText": "0 - 0"
                                  }
                              ],
                              "defaultRoundingDigits": 0,
                              "defaultNumberOfDataPoints": 0,
                              "initialized": true,
                              "visible": false,
                              "opacity": 0.0,
                              "labelSource": 2,
                              "showLegend": true,
                              "legendTitle": "",
                              "colorScheme": -1,
                              "calculationType": 1,
                              "numberOfDataBreaks": 1,
                              "breakFormatString": "{min} - {max}",
                              "groupBreaksBy": 1
                          }
                      }
                  ]
              };


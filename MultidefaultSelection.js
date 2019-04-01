var isDefaultSelected = false;

define(["jquery", "text!./style.css"], function ($, cssContent) {
	'use strict'
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties: {
			version: 1.1,
			qListObjectDef: {
				qShowAlternatives: true,
				qFrequencyMode: "V",
				qInitialDataFetch: [{
					qWidth: 1,
					qHeight: 150
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimension: {
					type: "items",
					translation: "Dimension",
					ref: "qListObjectDef",
					min: 1,
					max: 1,
					items: {
						field: {
							type: "string",
							expression: "always",
							expressionType: "dimension",
							ref: "qListObjectDef.qDef.qFieldDefs.0",
							translation: "Field",
							show: function (data) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						}
					}
				},
				settings: {
					uses: "settings",
					items: {
						options: {
							type: "items",
							label: "Multi Select",
							items: {
								
								multiple: {
									type: "boolean",
									label: "select",
									ref: "multiple",
									defaultValue: false
								},
								defaultvalue: {
									type: "string",
									label: "Default selected value(with comma sep)",
									ref: "defaultselection"
								}
							}
						}
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ($element, layout) {
			var self = this, html = "";
			var data = [];
			var selected = 0;
			var defaultvalue = null;
			var defaultselectionList = layout.defaultselection.split(',');
			var selectValues = [];
			var allPossible = true;

			this.backendApi.eachDataRow(function (rownum, row) {				
				if (row[0].qState === 'S') {
					selected = 1;
				}
				data.push(row[0]);
				
				if( row[0].qState != 'O' ) {
					allPossible = false;
				}
			});


			for (var i = 0; i < data.length; i++) {
				var text = data[i].qText;

				if (isDefaultSelected == false) {
					if (defaultselectionList.length > 0) {
						for (var v = 0; v < defaultselectionList.length; v++) {
							if (data[i].qText == defaultselectionList[v]) {
								selectValues.push(data[i].qElemNumber);
							}
						}

					}
				} else {
					selectValues.push(data[i].qElemNumber);
				}


				var objtype = '';
				if (layout.objtype === undefined) {
					objtype = 'radio';
				}  else if (layout.objtype === 'C') {
					objtype = 'checkbox';
				} 


			}

			

			var dim = 0;

			if (isDefaultSelected == false) {
				self.backendApi.selectValues(dim, selectValues, layout.multiple);
			}

			$element.html(html);
			isDefaultSelected = true;
			
		}
	};
});

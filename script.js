// Code goes here

const urlParams = new URLSearchParams(window.location.search);
var lang = urlParams.get('lang') == null ? "en" : urlParams.get('lang');

var show_longname= urlParams.get('longname') == null ? "true" : urlParams.get('longname');

var show_storage = urlParams.get('storage') == null ? "false" : urlParams.get('storage');


var sort_by = urlParams.get('sort_by') == null ? "sortByArrivalDate" : urlParams.get('sort_by');

var show_unit_price = urlParams.get('unitprice') == null ? "none" : urlParams.get('unitprice');

var show_special_recommend_only = urlParams.get('recommendonly') == null ? "none" : urlParams.get('recommendonly');

var filter_years_string = urlParams.get('filter_years') == null ? "none" : urlParams.get('filter_years');
var filter_crafts_string = urlParams.get('filter_crafts') == null ? "none" : urlParams.get('filter_crafts');
var filter_cultivars_string = urlParams.get('filter_cultivars') == null ? "none" : urlParams.get('filter_cultivars');

var filter_years = filter_years_string.split(",");
var filter_crafts = filter_crafts_string.split(",");
var filter_cultivars = filter_cultivars_string.split(",");

function update_filter_years_string()
{
	var result = "";
	for( yrs in filter_years )
		result += (result == "" ? "" : ",") + filter_years[yrs]; 
	filter_years_string = ( result == "") ? "none" : result;
}

function update_filter_crafts_string()
{
	var result = "";
	for( idx in filter_crafts )
		result += (result == "" ? "" : ",") + filter_crafts[idx]; 
	filter_crafts_string = ( result == "") ? "none" : result;
}

function update_filter_cultivars_string()
{
	var result = "";
	for( idx in filter_cultivars)
		result += (result == "" ? "" : ",") + filter_cultivars[idx]; 
	filter_cultivars_string = ( result == "") ? "none" : result;
}

function update_url_parameters()
{
	para_string ="?lang="+window.lang+"&longname="+show_longname;
	if( sort_by != null )	para_string += "&sort_by="+sort_by;
	if( show_special_recommend_only != null )	para_string += "&recommendonly="+show_special_recommend_only;

	if( filter_years_string != null || filter_years_string == "none")	para_string += "&filter_years="+filter_years_string;
	if( filter_crafts_string != null || filter_crafts_string == "none")	para_string += "&filter_crafts="+filter_crafts_string;
	if( filter_cultivars_string != null || filter_cultivars_string == "none")	para_string += "&filter_cultivars="+filter_cultivars_string;

	console.log( "para_string" + para_string );
	window.history.replaceState(null, null, para_string); 
}

function scan_json_file_and_update_options()
{
	$.getJSON("db.json"). then( function(json) {

		// update years from db

		var all_years = []; 
		for( var idx in json ) {
			if( $.inArray( json[idx]["year"], all_years ) == -1 ) 
				all_years.push( json[idx]["year"] );
		}
		all_years.sort();
		all_years.reverse();

		var yearOptions = [];
		for( var a_year in all_years ) {
			yearOptions.push( { label: all_years[a_year], value: all_years[a_year] } );
		}

		VirtualSelect.init({
			ele: '#years-select',
			options: yearOptions,
			multiple: true ,
			placeholder: "All Years",
			selectedValue: filter_years 
		});

		// update process types / craft type

		var process_types = [];
		for( var idx in json ) {
			if( $.inArray( json[idx]["process_type"], process_types ) == -1 ) 
				process_types.push( json[idx]["process_type"] );
		}

		var craftOptions = [];
		for( var a_process_type in process_types ) {
			craftOptions.push( { label: process_types[a_process_type] , value: process_types[a_process_type] } );
		}

		VirtualSelect.init({
			ele: '#crafts-select',
			options: craftOptions,
			multiple: true ,
			selectedValue: filter_crafts,
			placeholder: "All Craft Types"
		}); 

		// update cultivars 

		var cultivars = [];
		for( var idx in json ) {
			if( $.inArray( json[idx]["cultivar_en"], cultivars) == -1 ) 
				cultivars.push( json[idx]["cultivar_en"] );
		}
		cultivars.sort();

		var cultivarOptions = [];
		for( var idx in cultivars ) {
			cultivarOptions.push( { label: cultivars[idx] , value: cultivars[idx] } );
		}

		VirtualSelect.init({
			ele: '#cultivars-select',
			options: cultivarOptions,
			multiple: true ,
			selectedValue: filter_cultivars,
			placeholder: "All Cultivars"
		}); 
	});

}

function update_body( show_price = false ) {
	var table_string = "";

	$.getJSON("db.json"). then( function(json) {
		if( filter_years_string != null && filter_years_string!= "none" ) {
			for( var idx in json ) {
				if( $.inArray( json[idx]["year"], filter_years ) == -1 ) {
					json[idx] = undefined;	
				}
			} 
		}
		if( filter_crafts_string != null && filter_crafts_string!= "none" ) {
			for( var idx in json ) {
				if(json[idx] != undefined && $.inArray( json[idx]["process_type"], filter_crafts ) == -1 ) {
					json[idx] = undefined;	
				}
			} 
		}
		if( filter_cultivars_string != null && filter_cultivars_string!= "none" ) {
			for( var idx in json ) {
				if(json[idx] != undefined && $.inArray( json[idx]["cultivar_en"], filter_cultivars ) == -1 ) {
					json[idx] = undefined;	
				}
			} 
		}
		if( show_special_recommend_only == "true" ) {
			for( var idx in json ) {
				if(json[idx] != undefined && json[idx]["special_recommend"] != "true") {
					json[idx] = undefined;	
				}
			} 

		}
		for( var idx in json ) {
			if( json[idx] == undefined )
				delete json[idx];
		}
		if( sort_by != null && sort_by != "none" ) {
			if( sort_by == "harvest" ) {
				json.sort(function(a, b){
					return Date.parse( b["harvest_date"]) - Date.parse( a["harvest_date"]);
				}); 
			} else if( sort_by == "craft" ) {
				json.sort(function(a, b){
					if( a['process_type'] == b['process_type'] ) return Date.parse( b["harvest_date"]) - Date.parse( a["harvest_date"]);
					return (a['process_type'] > b['process_type']) ? 1 : -1 ;
				}); 
			} else if( sort_by == "cultivar" ) {
				json.sort(function(a, b){
					if( a['cultivar_en'] == b['cultivar_en'] ) return Date.parse( b["harvest_date"]) - Date.parse( a["harvest_date"]);
					return (a['cultivar_en'] > b['cultivar_en']) ? 1 : -1 ;
				}); 
			} else if( sort_by == "arrival" ) {
				json.sort(function(a, b){
					return Date.parse( b["arrival_date"]) - Date.parse( a["arrival_date"]);
				}); 
			}
		}

		if( lang == "zh" ) {

			table_string += "<table> <thead> \n" ; 
			if(show_longname == "true" ) 
				table_string += "<th>FullName</th>";
			else
				table_string += "<th> 品種 </th> \n" + 
					"<th> 型態 </th> \n" + 
					"<th> 市/縣 </th> <th> 產地 </th> <th> 環境 </th> <th> 焙火形態 </th>\n";
			table_string += "<th> 克/盒 </th> \n" ; 
			if( show_price && show_unit_price == "true" ) { table_string += "<th>NTD/600g</th>"; }
			if( show_price ) { table_string += "<th>USD/Box</th>"; }
			if( show_storage == "true" ) { table_string += "<th>in stock</th>"; }
			if(show_longname == "true" ) 
				table_string +=  "<th> 入庫時間 </th>\n";
			else
				table_string +=  "<th> 節氣 </th>\n"+ " <th>採摘/制作</th>";
			table_string +=  "<th>Instagram</th> </thead> \n <tbody> ";

			var roast_dict ={ 
					"LightCharcoalRoast": "炭焙(輕)",
					"MidCharcoalRoast": "炭焙(中)",
					"HeavyCharcoalRoast": "炭焙(重)"
					 };

			for( var idx in json ) {

				table_string +=  "<tr>\n";

				if( show_longname == "true" ){
					table_string += "<td>" + json[idx]["fullname_zh"] +( (json[idx]["special_recommend"] == undefined)?"":"*" ) + " </td>\n";

				} else {
					table_string +=  "<td>" + json[idx]["cultivar_zh"] + " </td> \n";
					table_string +=  "<td>" + pt_dict[json[idx]["process_type"]] + ( (json[idx]["special_recommend"] == undefined)?"":"*" ) + " </td> \n";

					table_string +=  "<td>" + json[idx]["harvest_city_zh"] + " </td> \n";
					table_string +=  "<td>" +(json[idx]["harvest_area_zh"] == undefined ? "" :json[idx]["harvest_area_zh"] ) + " </td> \n";

					table_string +=  "<td>" +( env_dict[json[idx]["cleaness"]] == undefined ? "" : env_dict[json[idx]["cleaness"]] ) + " </td> \n";
					table_string +=  "<td>" + (json[idx]["roast_type"] == undefined ? " " : roast_dict[json[idx]["roast_type"]] ) + " </td> \n";
				}
				if( json[idx]["status"] == "send2charcoal" ) {
					table_string +=  "<td>待焙火</td> \n"; 
				} else if( json[idx]["status"] == "sold" ) {
					table_string +=  "<td>無庫存</td> \n"; 
				} else if( json[idx]["gram_per_box"] == null || json[idx]["gram_per_box"] == "0" ) {
					table_string +=  "<td>尚未包裝</td> \n"; 
				} else
					table_string +=  "<td>" + json[idx]["gram_per_box"] + "g/Box </td> \n";
				if( show_price ) {
					if( show_unit_price == "true" ) {
						if( json[idx]["price_per_box"] == null || json[idx]["price_per_box"] == "0" ) {
							table_string +=  "<td> N/A </td> \n"; 
						} else  if (json[idx]["process_type"] == "YanCha" || json[idx]["process_type"] == "DanCong") {
							table_string +=  "<td class=\"price\">¥" +  
						 	(parseInt(json[idx]["price_per_box"]) / parseInt(json[idx]["gram_per_box"]) * 500 * 7.2 )
							+ "</td> \n"; 
						} else  {
							table_string +=  "<td class=\"price\">$" +  
						 	(parseInt(json[idx]["price_per_box"]) / parseInt(json[idx]["gram_per_box"]) * 600 * 30 )
							+ "</td> \n"; 
						}

					}

					if( json[idx]["price_per_box"] == null || json[idx]["price_per_box"] == "0" ) {
						table_string +=  "<td> N/A </td> \n"; 
					} else 
						table_string +=  "<td class=\"price\">$" + json[idx]["price_per_box"] + "/Box </td> \n"; 
				}
				if( show_storage == "true" ) {
					if( json[idx]["nb_in_stock"] == null  ) {
						table_string +=  "<td> N/A </td> \n"; 
					} else 
						table_string +=  "<td class=\"nb_in_stock\">" + json[idx]["nb_in_stock"] +"/"+ json[idx]["nb_initial"] + " </td> \n"; 
				}
					
				if( show_longname == "true" ){
					table_string +=  "<td>" + json[idx]["arrival_date"] + " </td> \n";

				} else {
					table_string +=  "<td>" +(json[idx]["solar_term"] == undefined ? "" : json[idx]["solar_term"]) + " </td> \n";
					table_string +=  "<td>" + json[idx]["harvest_date"] + " </td> \n";
				}

				if( json[idx]["instagram_url"] == null ) {
					table_string +=  "<td> N/A </td>\n";
				} else {
					table_string +=  "<td> <a href="+json[idx]["instagram_url"]+">instagram </a> </td>";
				}


				table_string +=  "</tr>\n";
			}

			table_string += "</tbody> ";
		} else { // default "en"

			table_string += "<div class=\"main\">  <table> <thead> \n";  
			if(show_longname == "true" ) 
				table_string += "<th>FullName</th>";
			else 
				table_string += "<th>Cultivar Name </th> \n" + 
					"<th>Type</th> <th>City</th> <th>From</th> <th>Enviroment</th>  <th>RoastType</th>";
			
			table_string += "<th>Gram/Box</th>";

			if( show_price ) { table_string += "<th>USD/Box</th>"; } 
			if(show_longname == "true" ) 
				table_string += "<th>ArrivalDate</th>"; 
			else
				table_string += "<th>HarvestDate</th>"; 
			table_string +=	"<th>Instagram</th> </thead> \n <tbody> ";

			for( var idx in json ) {

				table_string +=  "<tr>\n";

				if( show_longname == "true" ){
					table_string += "<td>" + json[idx]["fullname_en"] +( (json[idx]["special_recommend"] == undefined)?"":"*" ) + " </td>\n";
				} else { 
					table_string +=  "<td>" + json[idx]["cultivar_en"] + " </td> \n";
					table_string +=  "<td>" + json[idx]["process_type"] + ( (json[idx]["special_recommend"] == undefined)?"":"*" ) + " </td> \n";
					table_string +=  "<td>" + json[idx]["harvest_city_en"] + " </td> \n";
					table_string +=  "<td>" + (json[idx]["harvest_area_en"] == undefined? "": json[idx]["harvest_area_en"]) + " </td> \n"; 
					table_string +=  "<td>" + json[idx]["cleaness"] + " </td> \n";
					table_string +=  "<td>" + (json[idx]["roast_type"] == undefined ? " " : json[idx]["roast_type"] ) + " </td> \n";
				}

				if( json[idx]["status"] == "send2charcoal" ) {
					table_string +=  "<td>WaitForRoast</td> \n"; 
				} else if( json[idx]["status"] == "sold" ) {
					table_string +=  "<td>Sold</td> \n"; 
				} else if( json[idx]["gram_per_box"] == null || json[idx]["gram_per_box"] == "0" ) {
					table_string +=  "<td>NotPackedYet </td> \n"; 
				} else
					table_string +=  "<td>" + json[idx]["gram_per_box"] + "g/Box </td> \n";

				if( show_price ) {
					if( json[idx]["price_per_box"] == null || json[idx]["price_per_box"] == "0" ) {
						table_string +=  "<td> N/A </td> \n"; 
					} else 
						table_string +=  "<td class=\"price\">$" + json[idx]["price_per_box"] + "/Box </td> \n"; 
				}

				if( show_longname != "true" ){
					table_string +=  "<td>" + json[idx]["harvest_date"] + " </td> \n";
				} else 
					table_string +=  "<td>" + json[idx]["arrival_date"] + " </td> \n";

				if( json[idx]["instagram_url"] == null ) {
					table_string +=  "<td> N/A </td>\n";
				} else {
					table_string +=  "<td> <a href="+json[idx]["instagram_url"]+">instagram </a> </td>";
				} 

				

				table_string +=  "</tr>\n";
			}

			table_string += "</tbody>";

		}
		document.getElementsByClassName('main')[0].innerHTML = table_string ;
		
		$("#keyword").keyup(function(){
//			$("#div").html($("#keyword").val())
			//this._show_price = false;
			if( $("#keyword").val() == "teamapletw" ) {
				this._show_price = true;
				update_body( this._show_price );
			} else if(this. _show_price == true ) {
				this._show_price = false;
				update_body( this._show_price ); 
			}
		});
	});
}


function update_html_views()
{
	update_body( false );
	update_radio_buttons();
}

function update_radio_buttons()
{
	if( lang!= null && lang != "none" ) { 
		if( lang == "en" ) { 
			$("#en").prop("checked", true);
		} else if (lang == "zh" ) {
			$("#zh").prop("checked", true);
		} 
	}
	if( show_longname!= null && lang != "none" ) { 
		if( show_longname == "false" ) { 
			$("#tabledetail").prop("checked", true);
		} else if (show_longname == "true" ) {
			$("#longname").prop("checked", true);
		} 
	}
	if( sort_by != null && sort_by != "none" ) { 
		if( sort_by == "arrival" ) {
			$("#sortByArrivalDate").prop("checked", true);
		} else if( sort_by == "harvest" ) {
			$("#sortByHarvestDate").prop("checked", true);
		} else if( sort_by == "craft" ) {
			$("#sortByCraftType").prop("checked", true);
		} else if( sort_by == "cultivar" ) {
			$("#sortByCultivar").prop("checked", true);
		}
	} 
	if( show_special_recommend_only != null && show_special_recommend_only != "none" ) { 
		if( show_special_recommend_only == "true" ) {
			$("#showSpecialRecommendOnly").prop("checked", true);
		} else {
			$("#showSpecialRecommendOnly").prop("checked", false);
		}
	}
}

$(document).ready(function () { 
	scan_json_file_and_update_options();

	update_html_views();


	$(".language").click(function() {
		window.lang = lang = this.value; 
		
		update_url_parameters(); 
		update_html_views();
	});
	$(".viewtype").click(function() {
		show_longname = this.value; 

		update_url_parameters(); 
		update_html_views();
	});
	$(".sortBy").click(function() {
		sort_by = this.value; 

		update_url_parameters(); 
		update_html_views();
	}); 
	$("#showSpecialRecommendOnly"). change(function() { 
		if( $(this).prop("checked") ) 
			show_special_recommend_only = "true";
		else
			show_special_recommend_only = "false";

		update_url_parameters(); 
		update_html_views();
	});
	$('#years-select').change(function() {
		filter_years = this.value; 

		update_filter_years_string(); 
		update_url_parameters(); 
		update_html_views();
	});
	$('#crafts-select').change(function() {
		filter_crafts = this.value; 

		update_filter_crafts_string(); 
		update_url_parameters(); 
		update_html_views();
	});
	$('#cultivars-select').change(function() {
		filter_cultivars= this.value; 

		update_filter_cultivars_string(); 
		update_url_parameters(); 
		update_html_views();
	});

} );


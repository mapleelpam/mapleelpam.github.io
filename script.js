// Code goes here

const urlParams = new URLSearchParams(window.location.search);
var lang = urlParams.get('lang') == null ? "en" : urlParams.get('lang');

var show_longname= urlParams.get('longname') == null ? "true" : urlParams.get('longname');

var show_storage = urlParams.get('storage') == null ? "false" : urlParams.get('storage');

var filter_year = urlParams.get('filter_year') == null ? "2022" : urlParams.get('filter_year');

var sort_by = urlParams.get('sort_by') == null ? "none" : urlParams.get('sort_by');

var show_unit_price = urlParams.get('unitprice') == null ? "none" : urlParams.get('unitprice');

var show_special_recommend_only = urlParams.get('recommendonly') == null ? "none" : urlParams.get('recommendonly');

var filter_type = urlParams.get('filter_type');
console.log(" filter_type"+filter_type);

var filter_cultivar_string = urlParams.get('filter_cultivar');
var filter_cultivar = null;
if( filter_cultivar_string != null ) {
	filter_cultivar = filter_cultivar_string.split(" ");	
}
console.log(" filter_cultivar_string "+filter_cultivar_string);
console.log(" filter_cultivar "+filter_cultivar);
console.log(" show_storage - "+show_storage);

function update_url_parameters()
{
	para_string ="?lang="+window.lang+"&longname="+show_longname;
	if( sort_by != null )	para_string += "&sort_by="+sort_by;
	if( show_special_recommend_only != null )	para_string += "&recommendonly="+show_special_recommend_only;
	if( filter_type != null )	para_string += "&filter_type="+filter_type;
	if( filter_year != null )	para_string += "&filter_year="+filter_year;
	if( filter_cultivar != null ) {
		filter_cultivar_string = "";
		for( var idx in filter_cultivar ) {
			filter_cultivar_string += (idx == 0 ? "" : "+") + filter_cultivar[idx]; 
		}
		para_string += "&filter_cultivar="+filter_cultivar_string;
	}
	console.log( "para_string" + para_string );
	window.history.replaceState(null, null, para_string); 
}

function update_body( lang = "en",  show_price = false ) {
	var table_string = "";

	$.getJSON("db.json"). then( function(json) {
		if( filter_type != null ) {
			for( var idx in json ) {
				if( json[idx]["process_type"] != filter_type ) {
					json[idx] = undefined;	
				}
			} 
		}
		if( filter_year != null && filter_year != "none" ) {
			for( var idx in json ) {
				if( json[idx]["year"] != filter_year ) {
					json[idx] = undefined;	
				}
			} 
		}
		if( filter_cultivar != null ) {
			for( var idx in json ) {
				//if( json[idx]["cultivar_en"] != filter_cultivar) {

				if( filter_cultivar.includes( json[idx]["cultivar_en"] ) == false ) {
					json[idx] = undefined;	
				}
			} 
		}
		if( show_special_recommend_only == "true" ) {
			for( var idx in json ) {
				if( json[idx]["special_recommend"] != "true") {
					json[idx] = undefined;	
				}
			} 

		}
		for( var idx in json ) {
			if( json[idx] == undefined )
				delete json[idx];
		}
		if( sort_by != null && sort_by != "none" ) {
			if( sort_by == "sortByHarvestDate" ) {
				json.sort(function(a, b){
					return Date.parse( b["harvest_date"]) - Date.parse( a["harvest_date"]);
				}); 
			} else if( sort_by == "sortByType" ) {
				json.sort(function(a, b){
					if( a['process_type'] == b['process_type'] ) return Date.parse( b["harvest_date"]) - Date.parse( a["harvest_date"]);
					return (a['process_type'] > b['process_type']) ? 1 : -1 ;
				}); 
			} else if( sort_by == "sortByCultivar" ) {
				json.sort(function(a, b){
					if( a['cultivar_en'] == b['cultivar_en'] ) return Date.parse( b["harvest_date"]) - Date.parse( a["harvest_date"]);
					return (a['cultivar_en'] > b['cultivar_en']) ? 1 : -1 ;
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
			if( show_price && show_unit_price == "true" ) { table_string += "<th>USD/600g</th>"; }
			if( show_price ) { table_string += "<th>USD/Box</th>"; }
			if( show_storage == "true" ) { table_string += "<th>in stock</th>"; }
			if(show_longname == "true" ) 
				table_string +=  "<th> 入庫時間 </th>\n";
			else
				table_string +=  "<th> 節氣 </th>\n"+ " <th>採摘/制作</th>";
			table_string +=  "<th>Instagram</th> </thead> \n <tbody> ";

			var pt_dict = { "HongCha": "紅茶",
					"BaoZhong": "包種",
					"YanCha": "岩茶",
					"CharcoalBaoZhong": "炭焙包種",
					"Oolong": "烏龍",
					"RolledOolong": "球形烏龍",
					"DongDing": "凍頂烏龍",
					"TGY": "鐵觀音",
					"CharcoalTGY": "炭焙鐵觀音",
					"BianCha": "扁茶",
					"Green": "綠茶",
					"WhiteTea": "白茶",
					"OrientalBeauty":"白毫烏龍" };

			var env_dict ={ "Wild": "野放",
					"SemiWild": "半野",
					"PureWild": "純野",
					"WildOldBush": "野放老欉",
					"PureWildOldBush": "純野老欉",
					"WildTallBush": "野放高欉"
					 };
			
			var roast_dict ={ 
					"LightCharcoalRoast": "炭焙(輕)",
					"MidCharcoalRoast": "炭焙(中)",
					"HeavyCharcoalRoast": "炭焙(重)"
					 };
			var roast_dict_longname ={ 
					"LightCharcoalRoast": "輕炭焙",
					"MidCharcoalRoast": "中炭焙",
					"HeavyCharcoalRoast": "重炭焙"
					 };

			for( var idx in json ) {

				table_string +=  "<tr>\n";

				if( show_longname == "true" ){
					table_string +=  "<td>" + json[idx]["harvest_date"] +"-"+json[idx]["solar_term"] 
						+"-"+json[idx]["harvest_city_zh"]+"-"+json[idx]["harvest_area_zh"]
						+ "-" + json[idx]["cultivar_zh"]  
						+( env_dict[json[idx]["cleaness"]] == undefined ? "" : "-" + env_dict[json[idx]["cleaness"]] )
						+( (json[idx]["roast_type"] == undefined)?"":("-"+roast_dict_longname[json[idx]["roast_type"]]) )
						+( (json[idx]["special_name_zh"] == undefined)?"":("-"+json[idx]["special_name_zh"]) ) 
						+ "-" + pt_dict[json[idx]["process_type"]]
						+( (json[idx]["special_recommend"] == undefined)?"":"*" )
						+ " </td> \n";

				} else {
					table_string +=  "<td>" + json[idx]["cultivar_zh"] + " </td> \n";
					table_string +=  "<td>" + pt_dict[json[idx]["process_type"]] + ( (json[idx]["special_recommend"] == undefined)?"":"*" ) + " </td> \n";

					table_string +=  "<td>" + json[idx]["harvest_city_zh"] + " </td> \n";
					table_string +=  "<td>" + json[idx]["harvest_area_zh"] + " </td> \n";

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
						} else  {
							table_string +=  "<td class=\"price\">$" +  
						 	(parseInt(json[idx]["price_per_box"]) / parseInt(json[idx]["gram_per_box"]) * 600 )
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
					table_string +=  "<td>" + json[idx]["solar_term"] + " </td> \n";
					table_string +=  "<td>" + json[idx]["harvest_date"] + " </td> \n";
				}

				if( json[idx]["instagram_url"] == null ) {
					table_string +=  "<td> not avaliable</td>\n";
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
					table_string +=  "<td>" + json[idx]["harvest_date"] +"-"+json[idx]["harvest_city_en"]+"-"+json[idx]["harvest_area_en"]
						+ "-" + json[idx]["cultivar_en"] + "-" + json[idx]["cleaness"] 
						+( (json[idx]["roast_type"] == undefined)?"":("-"+json[idx]["roast_type"]) )
						+( (json[idx]["special_name_en"] == undefined)?"":("-"+json[idx]["special_name_en"]) )
						+ "-" + json[idx]["process_type"] 
						+( (json[idx]["special_postfix"] == undefined)?"":("-"+json[idx]["special_postfix"]) )
						+( (json[idx]["special_recommend"] == undefined)?"":"*" )
						+ " </td> \n";
				} else { 
					table_string +=  "<td>" + json[idx]["cultivar_en"] + " </td> \n";
					table_string +=  "<td>" + json[idx]["process_type"] + ( (json[idx]["special_recommend"] == undefined)?"":"*" ) + " </td> \n";
					table_string +=  "<td>" + json[idx]["harvest_city_en"] + " </td> \n";
					table_string +=  "<td>" + json[idx]["harvest_area_en"] + " </td> \n"; 
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
		
		$(".translate").click(function() {
			console.log(" click ");
			var btn_lang = $(this).attr("id"); 
			window.lang = btn_lang;
			console.log(" click "+lang);
//			window.history.replaceState(null, null, "?lang="+lang); 
			update_url_parameters();
			update_body( lang, false );
			location.reload();
		});
		$(".longname").click(function() {
			console.log(" longname click ");
			var btn_longname = $(this).attr("value"); 
			show_longname = btn_longname;
			console.log(" click "+show_longname);
//			window.history.replaceState(null, null, "?lang="+lang); 
			update_url_parameters();
			update_body( lang, false );
			location.reload();
		});
		$(".filterYear").click(function() {
			var btn_value= $(this).attr("value"); 
			filter_year= btn_value;
			update_url_parameters();
			update_body( lang, false );
			location.reload();
		});
		$(".sortBy").click(function() {
			var btn_value= $(this).attr("value"); 
			sort_by = btn_value;
			update_url_parameters();
			update_body( lang, false );
			location.reload();
		});
		$(".showOnly").click(function() {
			show_special_recommend_only = "true";
			update_url_parameters();
			update_body( lang, false );
			location.reload();
		});
	
		$("#keyword").keyup(function(){
//			$("#div").html($("#keyword").val())
			//this._show_price = false;
			if( $("#keyword").val() == "teamapletw" ) {
				this._show_price = true;
				update_body( lang, this._show_price );
			} else if(this. _show_price == true ) {
				this._show_price = false;
				update_body( lang, this._show_price ); 
			}
		});
	});
}

update_body( lang,  false );

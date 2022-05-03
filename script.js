// Code goes here

function update_body( lang = "en", show_full_name = false, show_price = false ) {
	var table_string = "";

	$.getJSON("db.json"). then( function(json) {
		if( lang == "zh" ) {

			table_string += "<table> <thead> \n" + 
				"<th> 品種 </th> \n" + 
				"<th> 型態 </th> \n" + 
				"<th> 市/縣 </th> <th> 產地 </th> <th> 環境 </th> <th>克/盒</th> \n";
			if( show_price ) { table_string += "<th>USD/Box</th>"; }
			table_string +=  "<th> 節氣 </th>\n"+ " <th>採摘/制作</th>";
			if(show_fullname == "true" ) table_string += "<th>FullName</th>";
			table_string +=  "<th>Instagram</th> </thead> \n <tbody> ";

			var pt_dict = { "HongCha": "紅茶",
					"BaoZhong": "包種",
					"CharcoalBaoZhong": "炭焙包種",
					"CharcoalTGY": "炭焙鐵觀音",
					"BianCha": "扁茶",
					"Green": "綠茶",
					"OrientalBeauty":"白毫烏龍" };

			var env_dict ={ "Wild": "野放",
					"SemiWild": "半野",
					"PureWild": "純野",
					"WildOldBush": "野放老欉",
					"WildTallBush": "野放高欉"
					 };

			for( var idx in json ) {

				table_string +=  "<tr>\n";
				table_string +=  "<td>" + json[idx]["cultivar_zh"] + " </td> \n";
				table_string +=  "<td>" + pt_dict[json[idx]["process_type"]] + " </td> \n";

				table_string +=  "<td>" + json[idx]["harvest_city_zh"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["harvest_area_zh"] + " </td> \n";

				table_string +=  "<td>" + env_dict[json[idx]["cleaness"]] + " </td> \n";
				if( json[idx]["gram_per_box"] == null || json[idx]["gram_per_box"] == "0" ) {
					table_string +=  "<td>尚未包裝</td> \n"; 
				} else
					table_string +=  "<td>" + json[idx]["gram_per_box"] + "g/Box </td> \n";
				if( show_price ) {
					if( json[idx]["price_per_box"] == null || json[idx]["price_per_box"] == "0" ) {
						table_string +=  "<td> N/A </td> \n"; 
					} else 
						table_string +=  "<td class=\"price\">$" + json[idx]["price_per_box"] + "/Box </td> \n"; 
				}
					

				table_string +=  "<td>" + json[idx]["solar_term"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["harvest_date"] + " </td> \n";

				if( show_fullname == "true" ){
					table_string +=  "<td>" + json[idx]["harvest_date"] +"-"+json[idx]["solar_term"] +"-"+json[idx]["harvest_city_zh"]+"-"+json[idx]["harvest_area_zh"]
						+ "-" + json[idx]["cultivar_zh"] + "-" + env_dict[json[idx]["cleaness"]] + "-" + pt_dict[json[idx]["process_type"]]
						+ " </td> \n";
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

			table_string += "<div class=\"main\">  <table> <thead> \n" + 
				"<th>Cultivar Name </th> \n" + 
				"<th>Type</th> <th>City</th> <th>From</th> <th>Enviroment</th> <th>Gram/Box</th>";

			if( show_price ) { table_string += "<th>USD/Box</th>"; } 
			table_string += "<th>Harvest</th>"; 
			if(show_fullname == "true" ) table_string += "<th>FullName</th>";
			table_string +=	"<th>Instagram</th> </thead> \n <tbody> ";

			for( var idx in json ) {

				table_string +=  "<tr>\n";
				table_string +=  "<td>" + json[idx]["cultivar_en"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["process_type"] + " </td> \n";

				table_string +=  "<td>" + json[idx]["harvest_city_en"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["harvest_area_en"] + " </td> \n";

				table_string +=  "<td>" + json[idx]["cleaness"] + " </td> \n";
				if( json[idx]["gram_per_box"] == null || json[idx]["gram_per_box"] == "0" ) {
					table_string +=  "<td>NotPackedYet </td> \n"; 
				} else
					table_string +=  "<td>" + json[idx]["gram_per_box"] + "g/Box </td> \n";

				if( show_price ) {
					if( json[idx]["price_per_box"] == null || json[idx]["price_per_box"] == "0" ) {
						table_string +=  "<td> N/A </td> \n"; 
					} else 
						table_string +=  "<td class=\"price\">$" + json[idx]["price_per_box"] + "/Box </td> \n"; 
				}

				table_string +=  "<td>" + json[idx]["harvest_date"] + " </td> \n";


				if( show_fullname == "true" ){
					table_string +=  "<td>" + json[idx]["harvest_date"] +"-"+json[idx]["harvest_city_en"]+"-"+json[idx]["harvest_area_en"]
						+ "-" + json[idx]["cultivar_en"] + "-" + json[idx]["cleaness"] + "-" + json[idx]["process_type"] 
						+ " </td> \n";
				}

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
			var lang = $(this).attr("id"); 
			window.history.replaceState(null, null, "?lang="+lang); 
			update_body( lang );
		});
	
		$("#keyword").keyup(function(){
//			$("#div").html($("#keyword").val())
			//this._show_price = false;
			if( $("#keyword").val() == "teamapletw" ) {
				this._show_price = true;
				update_body( lang, show_fullname, this._show_price );
			} else if(this. _show_price == true ) {
				this._show_price = false;
				update_body( lang, show_fullname, this._show_price ); 
			}
		});
	});
}

const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang');
const show_fullname= urlParams.get('fullname');
update_body( lang, show_fullname, false );

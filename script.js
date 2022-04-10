// Code goes here

function update_body( lang = "en" ) {
	console.log(" update_body -> lang = "+lang);
	var table_string = "";

	$.getJSON("db.json"). then( function(json) {
		if( lang == "zh" ) {

			table_string += "<table> <thead> \n" + 
				"<th> 品種 </th> \n" + 
				"<th> 型態 </th> \n" + 
				"<th> 市/縣 </th> <th> 產地 </th> <th> 環境 </th> <th>克/盒</th> \n"+ 
				"<th> 節氣 </th>\n"+
				" <th>採摘/制作</th><th>Instagram</th> </thead> \n <tbody> ";

			var pt_dict = { "HongCha": "紅茶",
					"BianCha": "扁茶",
					"Green": "綠茶",
					"Oriental Beauty":"白毫烏龍" };

			var env_dict ={ "Wild": "野放",
					"Pure Wild": "純野",
					"Wild/ OldBush": "野放老欉"
					 };

			for( var idx in json ) {

				table_string +=  "<tr>\n";
				table_string +=  "<td>" + json[idx]["cultivar_zh"] + " </td> \n";
				table_string +=  "<td>" + pt_dict[json[idx]["process_type"]] + " </td> \n";

				table_string +=  "<td>" + json[idx]["harvest_city_zh"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["harvest_area_zh"] + " </td> \n";

				table_string +=  "<td>" + env_dict[json[idx]["cleaness"]] + " </td> \n";
				table_string +=  "<td>" + json[idx]["gram_per_box"] + "g/Box </td> \n";

				table_string +=  "<td>" + json[idx]["solar_term"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["harvest_date"] + " </td> \n";

				if( json[idx]["instagram_url"] == null ) {
					table_string +=  "<td> empty </td>\n";
				} else {
					table_string +=  "<td> <a href="+json[idx]["instagram_url"]+">instagram </a> </td>";
				}


				table_string +=  "</tr>\n";
			}

			table_string += "</tbody> ";
		} else { // default "en"

			table_string += "<div class=\"main\">  <table> <thead> \n" + 
				"<th>Cultivar Name </th> \n" + 
				"<th>Type</th> <th>City From</th> <th>From</th> <th>Enviroment</th> <th>Gram/Box</th> <th>Harvest Date</th><th>Instagram</th> </thead> \n <tbody> ";

			for( var idx in json ) {

				table_string +=  "<tr>\n";
				table_string +=  "<td>" + json[idx]["cultivar_en"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["process_type"] + " </td> \n";

				table_string +=  "<td>" + json[idx]["harvest_city_en"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["harvest_area_en"] + " </td> \n";

				table_string +=  "<td>" + json[idx]["cleaness"] + " </td> \n";
				table_string +=  "<td>" + json[idx]["gram_per_box"] + "g/Box </td> \n";

				table_string +=  "<td>" + json[idx]["harvest_date"] + " </td> \n";

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
			update_body( lang );
		});
	
	});
}

update_body();

// Code goes here

function update_body( lang = "en" ) {
	console.log(" update_body -> lang = "+lang);
	var table_string = "<button class=\"translate\" id=\"en\">English</button> <button class=\"translate\" id=\"zh\">Chinese</button> ";

	$.getJSON("db.json"). then( function(json) {
		if( lang == "zh" ) {
			console.log("中文  click zh 中文");


			table_string += "<div class=\"main\">  <table> <thead> \n" + 
				"<th> 品種 </th> \n" + 
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
					table_string +=  "<td> empty </td>\n";
				} else {
					table_string +=  "<td> <a href="+json[idx]["instagram_url"]+">instagram </a> </td>";
				}


				table_string +=  "</tr>\n";
			}
			//		console.log( table_string );

			table_string += "</tbody> </div>";
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
					table_string +=  "<td> empty </td>\n";
				} else {
					table_string +=  "<td> <a href="+json[idx]["instagram_url"]+">instagram </a> </td>";
				}


				table_string +=  "</tr>\n";
			}
			//		console.log( table_string );

			table_string += "</tbody> </div>";

		}
		document.body.innerHTML = table_string ;
		
		$(".translate").click(function() {
			console.log(" click ");
			var lang = $(this).attr("id"); 
			update_body( lang );

			console.log(" click -> "+lang);
		});
	
	});
}

update_body();

// Second argument takes in filters
// alert("something");
// var a = $('#midsize').text()
// console.log(a);
// $('#segmentFilter').onchange(function(){alert()});
// $('#midsize').click(function() {
// 	console.log("apdsjnfapuewf");
// 	alert();
// });
// $('#segmentFilter').onchange(function(value){alert()})
// document.getElementById("segmentFilter").addEventListener("change", alertMsg);
// function alertMsg(){
// 	alert();
// }
//
// $()
// $("#segmentFilter").addEventListener("change", function() {
// 	console.log(this);
// })
// alert();
var segments = [];
var manufacturers = [];
var brands = [];
var models = [];
var type = 'bar'

$('#myonoffswitch').click(function() {
	if (this.checked){
		type = 'bar';
	} else {
		type = 'line';
	}
	parseData(createGraph, [segments, manufacturers, brands, models], type)
});

var prevSegmentsLen;
function segmentsChange(value) {
	// console.log(value);
	segments = [];
	var ul = $('.chosen-choices')[0];
	var li = ul.getElementsByTagName("li");
	for (var n = 0; n < li.length - 1; n++) {
		console.log($(li[n]).text())
		segments.push($(li[n]).text());
	}
	if (!prevSegmentsLen || li.length > prevSegmentsLen) {
		prevSegmentsLen = li.length;
	} else if (prevSegmentsLen <= li.length) {
		prevSegmentsLen--;
		segments.pop();
	}
	parseData(createGraph, [segments, manufacturers, brands, models], type)
}
var prevManufacturersLen;
function manufacturersChange(value) {
	manufacturers = [];
	var ul = $('.chosen-choices')[1];
	var li = ul.getElementsByTagName("li");
	for (var n = 0; n < li.length - 1; n++) {
		console.log($(li[n]).text())
		manufacturers.push($(li[n]).text());
	}
	if (!prevManufacturersLen || li.length > prevManufacturersLen) {
		prevManufacturersLen = li.length;
	} else if (prevManufacturersLen <= li.length) {
		prevManufacturersLen--;
		manufacturers.pop();
	}
	parseData(createGraph, [segments, manufacturers, brands, models], type)
}

var prevBrandsLen;
function brandsChange(value) {
	brands = [];
	var ul = $('.chosen-choices')[2];
	var li = ul.getElementsByTagName("li");
	for (var n = 0; n < li.length - 1; n++) {
		console.log($(li[n]).text())
		brands.push($(li[n]).text());
	}
	if (!prevBrandsLen || li.length > prevBrandsLen) {
		prevBrandsLen = li.length;
	} else if (prevBrandsLen <= li.length) {
		prevBrandsLen--;
		brands.pop();
	}
	parseData(createGraph, [segments, manufacturers, brands, models], type)
}
var prevModelsLen;
function modelsChange(value) {
	models = [];
	var ul = $('.chosen-choices')[3];
	var li = ul.getElementsByTagName("li");

	for (var n = 0; n < li.length - 1; n++) {
		console.log($(li[n]).text())
		models.push($(li[n]).text());
	}
	if (!prevModelsLen || li.length > prevModelsLen) {
		prevModelsLen = li.length;
	} else if (prevModelsLen <= li.length) {
		prevModelsLen--;
		models.pop();
	}
	parseData(createGraph, [segments, manufacturers, brands, models], type)
}


// console.log($("select"));

parseData(createGraph, [[], [], [], []], type);

function parseData(createGraph, args, type) {
	Papa.parse("../data/master.csv", {
		download: true,
		complete: function(results) {
			createGraph(filter(results.data, args), type);
		}
	});
}

function filter(data, args) {
    var segments = args[0];
    var manufacturers = args[1];
    var brands = args[2];
    var models = args[3];
    var toReturn = [];

    // Segments
    for (var i = 0; i < segments.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j][0] == segments[i]) {
                toReturn.push(data[j]);
            }
        }
    }

    // Manufacturers
    for (var i = 0; i < manufacturers.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j][1] == manufacturers[i]) {
                toReturn.push(data[j]);
            }
        }
    }

    // Brands
    for (var i = 0; i < brands.length; i++) {
        for (var j = 0; j < data.length - 1; j++) {
            if (data[j][2].includes(brands[i])) {
                toReturn.push(data[j]);
            }
        }
    }

    // Models
    for (var i = 0; i < models.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j][2] == models[i]) {
                toReturn.push(data[j]);
            }
        }
    }

    // Remove Duplicates
	const unique = new Set(toReturn);
    return [...unique];
}

function createGraph(data, type) {
	months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	lines = [];
	for (var j = 0; j < data.length; j++) {
		currModel = [];
		for (var i = 2; i < 15; i++) {
			currModel.push(data[j][i]);
		}
		lines.push(currModel);
	}

	var chart = c3.generate({
		bindto: '#chart',
	    data: {
			columns: lines,
			type: type
	    },
	    axis: {
	        x: {
	            type: 'category',
	            categories: months,
	            tick: {
	            	multiline: false,
                	culling: {
                    	max: 15
                	}
            	}
	        }
	    },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'bottom'
	    }
	});
}

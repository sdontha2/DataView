let d3 = require('d3');
global.fetch = require("node-fetch");


d3.csv('http://172.16.188.89:8080/master.csv').then(function(data) {
    var currentState = [];
    currentState = filter([[], [], ["Nissan"], []], data);
    console.log(currentState);
});

function filter(args, data) {
    var segments = args[0];
    var manufacturers = args[1];
    var brands = args[2];
    var models = args[3];
    var toReturn = [];

    // Segments
    for (var i = 0; i < segments.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j].Segment == segments[i]) {
                toReturn.push(data[j]);
            }
        }
    }

    // Manufacturers
    for (var i = 0; i < manufacturers.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j].Manufacturer == manufacturers[i]) {
                toReturn.push(data[j]);
            }
        }
    }

    // Brands
    for (var i = 0; i < brands.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j].Model.includes(brands[i])) {
                toReturn.push(data[j]);
            }
        }
    }

    // Models
    for (var i = 0; i < models.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j].Model == models[i]) {
                toReturn.push(data[j]);
            }
        }
    }

    // Remove Duplicates
    const unique = new Set(toReturn);
    return [...unique];
}

const request = require("request");
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const mkdirp = require('mkdirp');
const csv = require('csv-parser');


let vehicleSizes = ['Small', 'Midsize', 'Large']
let vehicleLuxury = [0, 1] // 0 = non luxury, 1 = luxury
let vehicleTypes = ['Car', 'SUV', 'Sports']
let modernYears = [2018, 2017]
let monthNames = [ "january", "february", "march", "april", "may", "june", "july", "august", "september"];
let year = 2019;
let toCSV = 'Segment,Manufacturer,Model,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec';
toCSV += '\n';




function retrieveData(size, type, luxury) {
  let luxuryUrl = luxury == 1 ? "luxury-" : ""
  let url = 'https://www.goodcarbadcar.net/2019-us-' + size + '-' + luxuryUrl + type + '-sales-figures/';
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      let luxuryFile = luxury == 1 ? "luxury_" : ""
      let luxurySeg = luxury == 1 ? "Luxury " : ""
      const $ = cheerio.load(html);
      // let file = '2019_' + size + '_' + luxuryFile + type + '_data.csv'
      // let header = ''
      // header += "Segment,Manufacturer,"
      // $('#table_5 thead tr th').each(function() {
      //   header += $(this).text().trim() + ','
      // })
      // header = header.substring(0, header.length - 1)
      // header += '\n'

      let segment = size + " " + luxurySeg + type + ","
      // toCSV += header;
      $('#table_5 tbody tr').each(function() {
        toCSV += segment;
        var array = $(this).text().split('\n')
        array.pop()
        array.shift()
        array.push('\n')
        let car = array[0]
        //TODO: add segment attribute as well
        if (car.includes("Chrysler") || car.includes("Ram") || car.includes("Dodge") || car.includes("Jeep") || car.includes("Fiat") || car.includes("Alfa Romeo") || car.includes("Maserati")) {
          toCSV += "FCA,"
        } else if (car.includes("BMW") || car.includes("Mini")) {
          toCSV += "BMW,"
          console.log(car + " BMW")
        } else if (car.includes("Mercedes-Benz") || car.includes("Smart")) {
          toCSV += "Daimler AG,"
          console.log(car + " Daimler AG")
        } else if (car.includes("Ford") || car.includes("Lincoln")) {
          toCSV += "Ford Motors,"
          console.log(car + " Ford Motors")
        } else if (car.includes("Chevrolet") || car.includes("Buick") || car.includes("Cadillac") || car.includes("GMC")) {
          toCSV += "General Motors,"
          console.log(car + " General Motors")
        } else if (car.includes("Honda") || car.includes("Acura")) {
          toCSV += "Honda,"
          console.log(car + " Honda")
        } else if (car.includes("Hyundai") || car.includes("Kia") || car.includes("Genesis")) {
          toCSV += "Hyundai-Kia,"
          console.log(car + " Hyundai-Kia")
        } else if (car.includes("Jaguar") || car.includes("Rover")) {
          toCSV += "Jaguar Land Rover,"
          console.log(car + " JLR")
        } else if (car.includes("Nissan") || car.includes("Infiniti") || car.includes("Mitsubishi")) {
          toCSV += "Nissan,"
          console.log(car + " Nissan")
        } else if (car.includes("Toyota") || car.includes("Lexus") || car.includes("Scion")) {
          toCSV += "Toyota,"
          console.log(car + " Toyota")
        } else if (car.includes("Volkswagen") || car.includes("Audi")) {
          toCSV += "Volkswagen,"
          console.log(car + " Volkswagen")
        } else if (car.includes("Volvo") || car.includes("Tesla") || car.includes("Mazda") || car.includes("Isuzu") || car.includes("Porsche") || car.includes("Subaru")) {
          toCSV += car.split(" ").filter(Boolean)[0] + ","
          console.log(car + " " + car.split(" "));
        } else {
          console.log("Unknown Manufacturer for: " + car);
        }


        for (var n = 0; n < array.length; n++) {
          array[n] = array[n].replace(',', '')
          array[n] = array[n].trim()
        }
        array = array.join(',')
        array = array.substring(0, array.length - 1) + '\n';
        toCSV += array;
      })
      // console.log(file)
      fs.writeFile('master.csv', toCSV, function(err) {
        if (err) {
          console.log("ERROR: " + err)
        }
      });
    } else if (error) {
      console.log("Error retrieving data for " + url)
    }
  })
}
for (let s = 0; s < vehicleSizes.length; s++) {
  for (let t = 0; t < vehicleTypes.length; t++) {
    for (let l = 0; l < vehicleLuxury.length; l++) {
      retrieveData(vehicleSizes[s], vehicleTypes[t], vehicleLuxury[l]);
    }
  }
}


//
// function retrieveData(size, type, luxury, month, year, dir) {
//   luxuryUrl = luxury == 1 ? "luxury-" : ""
//   if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
//   }
//   if (!year && !month) {
//     month = "october"
//     if (type == "sports") {
//       url = 'http://www.goodcarbadcar.net/2019-us-sports-car-sales-figures/'
//     } else {
//
//       url = 'http://www.goodcarbadcar.net/us-' + size + '-' + luxuryUrl + type + '-sales-figures/'
//     }
//     console.log(url);
//     request(url, (error, response, html) => {
//
//       luxuryFile = luxury == 1 ? "luxury_" : ""
//       if (type == "sports") {
//         file = dir + '/2019_' + month + '_sports_car_sales.csv'
//       } else {
//         file = dir + '/2019_' + month + '_' + size + '_' + luxuryFile + type + '.csv'
//       }
//       if (!error && response.statusCode == 200) {
//
//         const $ = cheerio.load(html);
//         let toCSV = '';
//
//         let header = ''
//         $('#table_1 thead tr th').each(function() {
//           header += $(this).text().trim() + ','
//         })
//         header = header.substring(0, header.length - 1)
//         header += '\n'
//
//         toCSV += header;
//         $('#table_1 tbody tr').each(function() {
//           var array = $(this).text().split('\n')
//           array.pop()
//           array.shift()
//           array.push('\n')
//           // console.log(array)
//           for (var n = 0; n < array.length; n++) {
//             array[n] = array[n].replace(',', '')
//             array[n] = array[n].trim()
//           }
//           array = array.join(',')
//           array = array.substring(0, array.length - 1) + '\n';
//           toCSV += array;
//         })
//         console.log(file)
//         fs.writeFile(file, toCSV, function(err) {
//           if (err) {
//             console.log("ERROR: " + err)
//           }
//         });
//       } else if (error) {
//         console.log("Error retrieving data for: " + size + " " + type + " " + luxury)
//       }
//     })
//   } else {
//     if (type == "sports") {
//       url = 'http://www.goodcarbadcar.net/2019-us-sports-car-sales-figures/'
//     } else {
//       url = 'http://www.goodcarbadcar.net/' + size + '-' + luxuryUrl + type + '-sales-in-america-' + month + '-2019/'
//     }
//     console.log(url);
//     request(url, (error, response, html) => {
//
//       luxuryFile = luxury == 1 ? "luxury_" : ""
//       if (type == "sports") {
//         file = '/2019_' + month + '_sports_car_sales.csv'
//       } else {
//         file = '/2019_' + month + '_' + size + '_' + luxuryFile + type + '.csv'
//       }
//       console.log(file);
//       if (!error && response.statusCode == 200) {
//         console.log("SOMETIGNs fasdjfah;lefhpaiuwefhaiuwef")
//         const $ = cheerio.load(html);
//         let toCSV = '';
//         let header = ''
//         $('#table_1 thead tr th').each(function() {
//           header += $(this).text().trim() + ','
//         })
//         header = header.substring(0, header.length - 1)
//         header += '\n'
//         toCSV += header;
//         $('#table_1 tbody tr').each(function() {
//           var array = $(this).text().split('\n')
//           array.pop()
//           array.shift()
//           array.push('\n')
//           for (var n = 0; n < array.length; n++) {
//             array[n] = array[n].replace(',', '')
//             array[n] = array[n].trim()
//           }
//           array = array.join(',')
//           array = array.substring(0, array.length - 1) + '\n';
//           toCSV += array;
//         })
//         console.log('wtf');
//         console.log(file)
//         fs.writeFile(file, toCSV, function(err) {
//
//           if (err) {
//             console.log("ERROR: " + err)
//           }
//         });
//       } else {
//         console.log("Error retrieving data for: " + size + " " + type + " " + luxury)
//       }
//     })
//   }
// }
//
// let dir = "2019_october"
// for (var s = 0; s < vehicleSizes.length; s++) {
//   for (var t = 0; t < vehicleTypes.length; t++) {
//     for (var l = 0; l < vehicleLuxury.length; l++) {
//       retrieveData(vehicleSizes[s], vehicleTypes[t], vehicleLuxury[l], null, null, dir);
//     }
//   }
// }
//
// console.log(monthNames);
// for (var m = 0; m < monthNames.length; m++) {
//   dir = "2019_" + monthNames[m]
//   for (var t = 0; t < vehicleTypes.length; t++) {
//     for (var l = 0; l < vehicleLuxury.length; l++) {
//       for (var s = 0; s < vehicleSizes.length; s++) {
//         // console.log('hello');
//         retrieveData(vehicleSizes[s], vehicleTypes[t], vehicleLuxury[l], monthNames[m], '2019', dir);
//       }
//     }
//   }
// }

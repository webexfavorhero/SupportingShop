fs = require('fs');
var OSPoint = require('ospoint');

fs.readFile('postcode_en_data.json', 'utf8', function(err, data) {
  if(err) { console.log(err); }
  else {
    var postcodes = JSON.parse(data);
    var latLonData = {};
    for(i = 0; i < postcodes.length; i++) {
      pcdata = postcodes[i];
      p = new OSPoint(pcdata[2], pcdata[1]);
      key = pcdata[0].toLowerCase().trim().replace(' ', '');
      llData = p.toWGS84();
      newPCData = {latitude: llData.latitude, longitude: llData.longitude, postcode: pcdata[0]};
      latLonData[key] = newPCData;
    }
    //console.log(latLonData);

    console.log("latlon data created");

    var stream = fs.createWriteStream("postcode_ll_data.json");
    stream.once('open', function(fd) {
      stream.write('{');
      doComma = false;
      var doComma;
      for (k in latLonData) {
        if (doComma) {
          stream.write(',');
        }
        stream.write('{"' + k + '":' + JSON.stringify(latLonData[k]) + '}');
        if (!doComma) {
          doComma = true
        }
        ;
        console.log("Completed: " + k);
      }
      stream.write('}');
      stream.end();
    });


  }
});

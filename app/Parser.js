var url = require('url');
var fs = require('fs');
var request = require('request');
// var xml2js = require('xml2js');

// var xmlParser = new xml2js.Parser();

var Parser = {
  init: function (router) {
    this.router = router;
    this.set();
  },

  set: function () {
    this.router.get('/:country/:state/:city.xml', function (req, res) {
      var country = req.params.country;
      var state = req.params.state;
      var city = req.params.city;

      this.findXML(country, state, city, function (content) {
        res.write(content);
        res.end();
      });
    }.bind(this));
  },

  findXML: function (country, state, city, cb) {
    var content = '';
    var name = country + '_' + state + '_' + city + '.xml';

    try {
      content = fs.readFileSync(__dirname + '/xml/' + name);
      cb(content);
    } catch (e) {
      this.request(country, state, city, cb);
    }
    
    return content;
  },

  request: function (country, state, city, cb) {
    var firstPart = 'http://spotthestation.nasa.gov/sightings/xml_files';
    var name = country + '_' + state + '_' + city + '.xml';
    var url = firstPart + '/' + name;
    var uri = 'http://issfeed2.herokuapp.com/';
    var guidUrl = uri + country + '/' + name + '/' + city;

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var atomLink = '<atom:link href="' + uri + '"';

        body = body.replace(/<title>.*<\/title>/, 'Ola, semana academica!!!');
        body = body.replace(/<link>.*<\/link>/, '<link>' + uri + name + '</link>');
        body = body.replace(/<managingEditor>.*<\/managingEditor>/, '');
        body = body.replace(/<webMaster>.*<\/webMaster>/, '');
        body = body.replace(/(&lt;br\/&gt;|<br\/>)/g, '');
        body = body.replace(/<atom[:a-z =]{1,}href="[^"]{1,}"/, atomLink);
        body.match(/<guid>.*<\/guid>/g).map(function (guid, index) {
          body = body.replace(/<guid>.*spotthestation.*<\/guid>/, '<guid>' + guidUrl + '/' + index+ '/' + '</guid>');
        });

        body.match(/<\/description>.*(\n\r|\n|\r).*<guid>/g).map(function (intersection, index) {
          body = body.replace(/<\/description>.*(\n\r|\n|\r).*<guid>/g, '</description><link>' + guidUrl + '/' + index + '/' +  '</link><guid>');
        });

        // body = body.replace(/(\r?\n|\r)/g, '')

        body = body.replace(/rel="self"/g, 'rel="alternate"');

        cb(body);

        // this.save(name, body);
      }

      if (error || response.statusCode != 200) {
        cb('error');
      }
    }.bind(this));
  },

  save: function (name, content) {
    var path = __dirname + '/xml/' + name;

    console.log('path', path)

    // xmlParser.parseString(content);

    // xmlParser.addListener('end', function(result) {
    //   fs.writeFile(path.replace(/\.xml/, '.json'), JSON.stringify(result), function (err) {
    //     if (err) {
    //       return console.log(err);
    //     }

    //     console.log('Saved .json');
    //   });
    // });
    try {
      fs.writeFile(path, content, function (err) {
        if (err) {
          return console.log(err);
        }

        console.log('Saved ', path);
      }); 
    } catch (e) {
      console.log('deu ruim')
    }
    
  }
}

module.exports = function (router) {
  if (!Parser.router) {
    Parser.init(router);
  }

  return Parser;
}

var url = require('url');
var fs = require('fs');
var request = require('request');

let Parser = {
  init(router) {
    this.router = router;
    this.set();
  },

  set() {
    this.router.get('/xml/:country/:state/:city.xml', (req, res) => {
      const country = req.params.country;
      const state = req.params.state;
      const city = req.params.city;

      this.findXML(country, state, city, (content) => {
        res.write(content);
        res.end();
      });
    });
  },

  findXML(country, state, city, cb) {
    let content = '';
    let name = `${country}_${state}_${city}.xml`;

    try {
      content = fs.readFileSync(`${__dirname}/xml/${name}`);
      cb(content);
    } catch (e) {
      this.request(name, cb);
    }
    
    return content;
  },

  request(name, cb) {
    let firstPart = `http://spotthestation.nasa.gov/sightings/xml_files`;
    let url = `${firstPart}/${name}`;

    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        cb(body);
        this.save(name, body);
      }

      if (error || response.statusCode != 200) {
        cb('error');
      }
    });
  },

  save(name, content) {
    let path = `${__dirname}/xml/${name}`;

    fs.writeFile(path, content, (err) => {
      if (err) {
        return console.log(err);
      }

      console.log('Saved ', path);
    }); 
  }
}

module.exports = (router) => {
  if (!Parser.router) {
    Parser.init(router);
  }

  return Parser;
}

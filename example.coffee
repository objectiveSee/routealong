express = require 'express'
bodyParser = require 'body-parser'

HitchAdapter = require './hitchWikiAdapter.js'
hitchAdapter = new HitchAdapter()

hitchSearch = require('./routesearch.js')(hitchAdapter);


router = express.Router()
  .get '/', (req, res) ->
    res.render 'example'

  .post '/routealong', (req, res) ->
    hitchSearch.searchRoute req.body, (results) ->
      
      # TODO: compress it in the adapter :)
      points = []
      already = {}
      for result in results
        continue if result[0] is 'true'
        for point in result
          points.push point unless already[result.id]++

      res.json points

app = express()
  .set 'view engine', 'jade'
  .set 'views', __dirname+'/views/'
  .use bodyParser.json()
  .use router

app.listen port = process.env.PORT || 5000
console.log "server started on http://localhost:#{port}/"

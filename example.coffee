express = require 'express'
bodyParser = require 'body-parser'

router = express.Router()
  .get '/', (req, res) ->
    res.render 'example'

  .post '/routealong', (req, res) ->
    console.log req.body

    res.setHeader 'Content-Type', 'text/plain'
    res.end 'thank you client! your route includes '+req.body.length+' points!'

app = express()
  .set 'view engine', 'jade'
  .set 'views', __dirname+'/views/'
  .use bodyParser.json()
  .use router

app.listen port = process.env.PORT || 5000
console.log "server started on http://localhost:#{port}/"

express = require 'express'

app = express()
  .set 'view engine', 'jade'
  .set 'views', __dirname+'/views/'
  .use express.Router().get '/', (req, res) ->
    res.render 'example'

app.listen port = process.env.PORT || 5000
console.log "server started on http://localhost:#{port}/"

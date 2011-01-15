{exec} = require 'child_process'
fs = require 'fs'

task 'build', 'Build project from edge.coffee to edge.js', ->
  exec 'coffee -p edge.coffee', (err, stdout, stderr) ->
    throw err if err
    jsfile = stdout.replace(".call(this);", '')
    jsfile = '$' + jsfile
    fs.writeFile 'edge.js', jsfile, (err) ->
      throw err if err

'use strict'

const exec = require('child_process').exec
const cmd = 'electron-packager ' + __dirname + ' fileswarm --platform=darwin --arch=all --overwrite --icon=' + __dirname + '/assets/IPFS_SwarmLogo_Draft111915.svg.icns'

exec(cmd, (error, stdout, stderr) => {
  if (error) {
  	console.log(error)
  }
  if (stderr) {
  	console.log(stderr)
  }
  console.log(stdout)
})

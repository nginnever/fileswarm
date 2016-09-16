const Web3 = require('web3')
const store = require('../store').store
const bs58 = require('bs58')
const IPFS = require('ipfs-api')
const each = require('async').eachSeries

const chunker = require('block-stream2')
const Readable = require('readable-stream')
const through2 = require('through2')
const Buffer = require('buffer/').Buffer
const fileReaderStream = require('filereader-stream')
const concat = require('concat-stream')
const ipfs = window.IpfsApi('localhost', '5001')
const abiFile = require('../utils/abi.js').file
const abiManager = require('../utils/abi.js').manager
const managerAddy = '0x5223c88b57523e01764aa9331fb2bf3017d91933'
const CHUNK_SIZE = 262144
// import lightwallet from 'eth-lightwallet'
// import web3hook from 'hooked-web3-provider'

let web3

// window interval for seeding challenges
var intervalID
var intervalID2
var stopSeed
//let ipfs
// import {createDaemon} from '../utils/ipfs'

// Internal functions
function hex_to_ascii(str1) {
  var hex  = str1.toString()
  var str = ''
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
  }
  return str
}

function setWeb3() {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    // local server
    web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.28:8545"))
    //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    // demo server
    // web3 = new Web3(new Web3.providers.HttpProvider("http://149.56.133.176:8545"))
  }

  return web3
}

function ipfsOn () {
  return new Promise((resolve, reject) => {
    //ipfs = IPFS('/ip4/127.0.0.1/tcp/5001')
    //const ipfs = window.IpfsApi('localhost', '5001')
    //console.log(ipfs)
    // ipfs.id((err, res) => {
    //   console.log(res)
    //   console.log(err)
    // })
    // ipfs.cat('QmTw6BFqgEDqUR4Sf32MEd39SLQRSQCoMpdQguzrC3ZcUn')
    // .then((id) => {
    //   console.log(id)
    //   resolve(id)
    // })
    // .catch(function(err) {
    //   reject(err)
    // })
  resolve('test')
  })
}

function getInitSeeds (acc) {
  return new Promise((resolve, reject) => {
    var currentStore = store.getState()
    var user = currentStore.seedReducer.toJSON().user

    if (user === undefined) user = []

    if (user[acc] === undefined) {
      user[acc] = {chunks: []}
    }

    user[acc].chunks.push({
      file: 'test-file',
      address: 'test.jpg',
      size: 2345,
      success: 203
    })

    store.dispatch({
      type: 'GET_SEEDS',
      user: {user: user}
    })

    resolve()
  })
}

function getInitFiles (acc) {
  return new Promise((resolve, reject) => {
    const _manager = getManagerContract()
    var fileshash = _manager.userFiles(web3.eth.accounts[acc])[0]
    console.log('database files hash: ')
    console.log(_manager.userFiles(web3.eth.accounts[acc])[0])

    // TODO: find a better way to access struct values in web3
    console.log(fileshash)
    if (fileshash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      var user = [
        {
          files: [
            {
              hash: 'test-file',
              name: 'test.jpg',
              size: 20309209,
              balance: 1337
            }
          ]
        }
      ]
      store.dispatch({
        type: 'GET_FILES',
        files: { user: user }
      })
      resolve()
    } else {
      var fh = '1220' + fileshash.slice(2, fileshash.length)
      console.log(fh)
      console.log(bs58.encode(new Buffer(fh, 'hex')).toString())
      ipfs.get(new Buffer(fh, 'hex'), (err, res) => {
        if (err) {
          console.log(err)
        }
        res.pipe(concat((_files) => {
          _files[0].content.pipe(concat((_users) => {
            console.log('USER OBJECT from db returned')
            var userArr = JSON.parse(_users.toString())
            console.log(userArr)

            var manager = getManagerContract()
            var fonline = manager.filecount().c[0]

            console.log('files online')
            console.log(fonline)

            store.dispatch({
              type: 'GET_FILES',
              user: { user: userArr }
            })

            store.dispatch({
              type: 'GET_ONLINE',
              online: { online: fonline }
            })
            
            resolve()

          }))
        }))
      })

    }

  })
}

function getManagerContract () {
  var manager = web3.eth.contract(abiManager)
  var managerInst = manager.at(managerAddy)

  return managerInst
}

function getFileContract (addy) {
  var file = web3.eth.contract(abiFile)
  var fileInst = file.at(addy)

  return fileInst
}

function fsc (size) {
  return chunker({ size: size, zeroPadding: false })
}

function getSeeds () {
  var currentStore = store.getState()
  var user = currentStore.seedReducer.toJSON().user
  var seeds = []
  var fcount = 0
  var managerInst = getManagerContract()
  var _filesInst
  var _faddy

  // search manager contract files
  var _fileslength = managerInst.filecount().c[0]
  console.log('MANAGER CONTRACT FILES ARRAY')
  console.log(_fileslength)
  
  // for each file in files() grab the file hash
  // use async here, this array will get large over time
  // TODO: add solidity and api methods for removig old files
  for (var i = 0; i < _fileslength; i++) {
    if (stopSeed) return // weird bug here
    _filesInst = getFileContract(managerInst.files(i))
    // look at attributes of all files here
    // console.log(_filesInst.chunks())

    var _fileHash = _filesInst.fileHash()
    _fileHash = _fileHash.slice(2, _fileHash.length)
    _fileHash = '1220' + _fileHash
    console.log(_fileHash)
    seeds.push(_fileHash)
  }
  
  // TODO: make picking up seeds at random index
  console.log('FINISHED DOWNLOADING SEEDS')
  
  // TODO: consider eachSeries with parallel limir
  each(seeds, (element, callback) => {
    if (stopSeed) {
      callback()
      return
    }
    // ipfs get the file hash
    ipfs.get(new Buffer(element, 'hex'), (err, res) => {
      // Don't do anything with this res, just check that 
      // downloading the file from ipfs didn't fail
      // this could hang the app and take time
      if (err) {
        console.log(err)
      }

      console.log('New File Downloaded, ready to seed!')

      // set as a challenger
      //_filesIsnt.seed(getFileContract(managerInst.files(i)), {from: web3.eth.accounts[currentStore.seedReducer.toJSON().user, gas:3000000]})
      _faddy = managerInst.files(fcount)
      _filesInst = getFileContract(_faddy)
      fcount++
      _filesInst.addSeeder(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount], {from: web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount], gas: 3000000})
      console.log('added seeder to file contract: ')
      console.log(managerInst.files(fcount))

    })
    setTimeout(_wait, 15000)
    function _wait () {
      if (stopSeed) {
        return
      }
      console.log('function waited for contract to be mined')
      var format = _filesInst.fileHash()
      format = '1220' + format.slice(2, format.length)

      user[currentStore.accountReducer.toJSON().activeAccount].chunks.push({
        file: bs58.encode(new Buffer(format, 'hex')).toString(),
        address: _faddy,
        size: 1234, // maybe add field in contract
        success: 23 // TODO: make this dynamic
      })
      console.log(user)

      const newb = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount]))
      
      //user[account].files.contract = managerInst.files(managerInst.filecount() - 1)

      // dispatch the new balance
      store.dispatch({
        type: 'GET_BALANCE',
        balance: {balance: newb.c}
      })

      store.dispatch({
        type: 'GET_SEEDS',
        user: {user: user}
      })


      // check the file to be sure seeding
      callback()
    }
  }, (err) => {
    console.log('FINISHED PICKING UP SEEDS')

  })

  // create the new users seed object from new seed grabbed
  //if (currentStore.seedReducer.toJSON().disk <= currentStore.seedReducer.toJSON().amtseed)
  
  
  // set the total amount of space used
  //var amtseed = currentStore.seedReducer.toJSON().amtseed
  // var amtseed = 1000
  // store.dispatch({
  //   type: 'GET_AMT',
  //   amtseed: {amtseed: amtseed}
  // })

  return
}

function c () {
  // grab the current seeds from the store.
  var currentStore = store.getState()
  var chunks = currentStore.seedReducer.toJSON().user[currentStore.accountReducer.toJSON().activeAccount]
  var _managerInst = getManagerContract()

  console.log('challenge function chunks')
  console.log(chunks)

  // for each seed contract, get the latest challenge hash
  each(chunks.chunks, (element, callback) => {
    if (stopSeed) {
      callback()
      return
    }
    console.log(element.address)
    console.log('-------------------')
    var _filesInst = getFileContract(element.address)
    if (_filesInst.address == 'test.jpg') {
      callback()
      return
    }

    _filesInst.challengeHash((err, res) => {
      if (err) {
        console.log(err)
      }
      console.log(res)

      // check to see if the round number has increased beyond the seeders 
      // round count. If the seeders count is lower then the seeders has not
      // challenged the new round.
      // If round counts are equal, try setting a new challenge on the contract
      console.log('*********************')
      console.log(_filesInst.seeders(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount])[2].c[0])
      console.log(_filesInst.round().c[0])

      // if (_filesInst.challengeHash() === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      //   callback()
      //   return
      // }

      if (_filesInst.seeders(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount])[2].c[0] === _filesInst.round().c[0] || 
          _filesInst.challengeHash() === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        console.log('setting new challenge')
        _filesInst.setNewChallenge({from: web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount], gas: 3000000})
        callback()
        return
      } else {
        console.log('answering challenge')
        // if the seeders round number is lower then we can answer challenge
        // ipfs get the chunks (should be in local storage)
        var _h = _filesInst.challengeHash()
        _h = '1220' + _h.slice(2, _h.length)
        ipfs.get(new Buffer(_h, 'hex'), (err, res) => {
          if (err) {
            console.log(err)
          }

          // slice the first 100 bytes
          if (res) {
            res.pipe(concat((_files) => {
              _files[0].content.pipe(concat((_content) => {
                console.log('returned data from challenge hash')
                //console.log(_content)

                // we need to take a smaller chunk from the full chunk
                // for the hash to be stored in the contract 
                // since contracts can only verify 32 bytes atm
                // TODO: account for chunks < 100 bytes
                var s =  _content.toString('hex')
                console.log(s)
                console.log(s.length)
                s = '0x' + s


                _filesInst.challenge(s, {from: web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount], gas: 3000000}, (err, res) => {
                  if (err) console.log(err)

                  setTimeout(wait2(_filesInst), 20000)

                  function wait2(_f) {
                    if (stopSeed) {
                      callback()
                      return
                    }
                    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
                    console.log('new challenge info')
                    //console.log(_f.test())
                    //console.log('balance')
                    console.log(_f.balance().c[0])
                    //console.log(_f.seeders(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount])[2].c[0])
                    //console.log(_f.seeders(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount])[0])
                    // update UI state when finished

                    const newb = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount]))
                    
                    //user[account].files.contract = managerInst.files(managerInst.filecount() - 1)

                    // dispatch the new balance
                    store.dispatch({
                      type: 'GET_BALANCE',
                      balance: {balance: newb.c}
                    })
                  }
                  //callback()
                })

              }))
            }))
          }
          callback()
        })
      }
    })
    
  }, (err) => {
    console.log('finshed awnsering challenges')
  })


  // send the hex of the chunk to the contract

  // update UI state with new challenge reward. 

  // TODO: adjust timings of payouts 
}

// ACCOUNT API
export const getBalance = (num) => {
  return new Promise((resolve, reject) => {
    web3 = setWeb3()

    const balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[num]))

    store.dispatch({
      type: 'GET_BALANCE',
      balance: { balance: balance.c }
    })
    console.log('inside getBalance')
    resolve(balance)
  })
}

export const setAccount = (num) => {
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: 'GET_ACCOUNT',
      activeAccount: { activeAccount: num }
    })
    console.log('inside getAccount')
    resolve(true)
  })
}

export const getAccounts = () => {
  return new Promise((resolve, reject) => {
    web3 = setWeb3()
    web3.eth.getAccounts((error, result) => {
      store.dispatch({
        type: 'GET_ACCOUNTS',
        accounts: { accounts: result }
      })
      console.log('inside getAccounts')
      resolve(result)
    })
  })
}

export const unlock = (account, password) => {
  return new Promise((resolve, reject) => {
    web3 = setWeb3()
    web3.personal.unlockAccount(web3.eth.accounts[account], password, 10000, (err, res) => {
      if (err) {
        reject(err)
      }
      store.dispatch({
        type: 'GET_UNLOCKED',
        unlocked: {unlocked: true}
      })
      resolve(res)
    })
  })
}

// Initialization tasks
// TODO error handle
export const init = () => {
  console.log('begin setting up store')
  console.log('calling set account store')
  return setAccount(0)
    .then((res) => {
      console.log('after set account')
      console.log(res)
      console.log('getting accounts from geth')
    })
    .then(() => getAccounts())
    .then((res) => {
      console.log('after get accounts')
      console.log(res)
      console.log('getting balance from store')
    })
    .then(() => getBalance(0))
    .then((res) => {
      console.log('after get balance')
      console.log(res)
      console.log('init files')
    })
    .then(() => getInitFiles(0))
    .then(() => {
      console.log('after init files')
      console.log('init seeds')
    })
    .then(() => getInitSeeds(0))
    .then(() => {
      console.log('finished Initialization')
    })
}

// SEEDING API
export const getMax = (input) => {
  return new Promise((resolve, reject) => {
    console.log('setting max diskspace allowed')
    store.dispatch({
      type: 'GET_MAXDISK',
      max: {max: input}
    })
  })
}

export const getDiskspace = (input) => {
  return new Promise((resolve, reject) => {
    console.log('setting diskspace used')
    store.dispatch({
      type: 'GET_DISKSPACE',
      disk: {disk: input}
    })
  })
}

export const startSeeding = () => {
  return new Promise((resolve, reject) => {
    stopSeed = false
    // two intervals, one for pucking up seeds, 
    // the other for challenging

    // Seed interval, every 3 minutes look for new files
    //intervalID = window.setInterval(seedLoop, 5000)

    // Challenge interval, every 30 seconds challenge your chunks
    intervalID2 = window.setInterval(challenge, 40000)
    
    // this doesnt need a loop, can just start and stop when 
    // max diskspace is reached.
    // TODO: add termination method to this.

      // add new chunks
    getSeeds()

    function challenge() {
      console.log('challenge triggered')
      c()
      //challenge all existing seeds
    }


  })
}

export const stopSeeding = () => {
  return new Promise((resolve, reject) => {
    window.clearInterval(intervalID)
    window.clearInterval(intervalID2)
    stopSeed = true
  })
}

export const initSeed = (acc) => {
  console.log('in initSeed api')
  console.log(acc)
  getInitSeeds(acc)
}

// FILES API
export const upload = (hash, value, account, name, size) => {
  return new Promise((resolve, reject) => {
    if (account === undefined) { account = 0 }

    var currentStore = store.getState()
    var user = currentStore.filesReducer.toJSON().user
    var managerInst = getManagerContract()

    // save file object to ipfs and register in contract
    user[account].files.push({
      hash: hash,
      name: name,
      size: size,
      balance: value
    })
    
    console.log('NEW USER FILES ARRAY')
    console.log(user)


    ipfs.add(new Buffer(JSON.stringify(user)), (err, res) => {
      if (err) {
        console.log(err)
      }
      console.log('----IPFS add user files res----')
      console.log(res)

      // var _files = currentStore.filesReducer.toJSON().user[currentStore.accountReducer.toJSON().activeAccount]
      // console.log('files object from store')
      // console.log(_files)

      // set the new users object hash in the manager contract
      var ts = new Buffer(bs58.decode(res[0].hash)).toString('hex')
      console.log(ts)
      ts = ts.slice(4, ts.length)
      ts = '0x'+ts
      console.log('New users hash')
      console.log(ts)

      // set new contract with file hash
      var fh = new Buffer(bs58.decode(hash)).toString('hex')
      fh = fh.slice(4, fh.length)
      fh = '0x' + fh
      console.log(fh)

      managerInst.createFile(ts, fh, {from: web3.eth.accounts[account], value: value.toString(), gas:3000000}, (err, res) => {
        console.log(res)
        console.log(err)
        console.log(managerInst.files(managerInst.filecount() - 1))
      })
    })
    // wait for tx to be mined
    // TODO: use solidity events
    setTimeout(wait, 20000)

    function wait() {
      // find dag links and create the chunks in file contract

      // TODO: listen to solidity events instead of wait()

      // get the balance of the file contract
      // Get the new file contract address
      console.log('new file contract addy')
      console.log(managerInst.userFiles(web3.eth.accounts[account])[2])
      console.log('userFiles')
      
      var fileInst = getFileContract(managerInst.userFiles(web3.eth.accounts[account])[2])

      console.log('new file info')
      console.log('-------')
      console.log(fileInst)
      console.log(fileInst.balance())
      
      // Set chunks
      ipfs.object.get(hash, (err, res) => {
        console.log('OBJECT GET RETURN')
        if (err) {
          console.log(err)
        }
        //console.log(res)
        if (res.links.length === 0) {

          ipfs.get(hash, (err, res) => {
            if (err) {
              console.log(err)
            }
            res.pipe(concat((_files) => {
              _files[0].content.pipe(concat((_content) => {
                console.log('returned data from object get with no links')
                console.log(_content.length)

                // we need to take a smaller chunk from the full chunk
                // for the hash to be stored in the contract 
                // since contracts can only verify 32 bytes atm
                var smallChunk =  _content.toString('hex')
                smallChunk = smallChunk.slice(0, 100)

                // input format for verifying chunk
                // this is for seeding as well
                console.log(smallChunk.length)

                //protobuf encode the smaller chunk
                ipfs.add(new Buffer(smallChunk, 'hex'), (err, res) => {
                  if (err) {
                    console.log(err)
                  }
                  console.log('IPFS hash of contract sized chunk')
                  console.log(res)
                  var dh = new Buffer(bs58.decode(res[0].hash)).toString('hex')
                  console.log(dh)
                  dh = '0x' + dh.slice(4, dh.length)
                  console.log(dh)

                  // TODO: THis doesn't always work
                  fileInst.addChunk(dh, {from: web3.eth.accounts[account], gas: 3000000}, (err, res) => {
                    if (err) console.log(err)

                    setTimeout(wait2, 20000)

                    function wait2() {
                      console.log(fileInst.chunks(0))
                      // update UI state when finished
                      console.log('new account balance')
                      const newb = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[currentStore.accountReducer.toJSON().activeAccount]))
                      
                      //user[account].files.contract = managerInst.files(managerInst.filecount() - 1)

                      // dispatch the new balance
                      store.dispatch({
                        type: 'GET_BALANCE',
                        balance: {balance: newb.c}
                      })
                      
                      // dispatch new user files object
                      store.dispatch({
                        type: 'GET_FILES',
                        user: { user: user }
                      })
                    }

                  })
                })
              }))
            }))
            
            console.log(res)
          })
        } else {
          console.log('links > 0')
          // set the number of chunks in the contract
          fileInst.setNumChunks(res.links.length, {from: web3.eth.accounts[0], gas: 1000000})
          // for now we assume all objects will be files
          // and each file will contain one level of chunks
          // see possible hash problems with larger files
          for (var i = 0; i < res.links.length; i++) {

          }
        }
      })

      // console.log(managerInst.userFiles(web3.eth.accounts[account]))
    }

  })
}

// export const getSeeds = (addy) => {
//   return new Promise((resolve, reject) => {
//     console.log('GET SEEDS ADDY')
//     console.log(addy)
//     resolve('test')
//   })
// }

export const getInitFile = (acc) => {
  return new Promise((resolve, reject) => {
    resolve(getInitFiles(acc))
  })
}
export const getFile = (file) => {
  return new Promise((resolve, reject) => {
    // ipfs.add(fileReaderStream(file), (err, res) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     resolve(res[0].hash)
    //   }
    // })

    // this requires go-ipfs fix target not set
    // ipfs.add(contents, (err, res) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     resolve(res[0].hash)
    //   }
    // })

    /*fileReaderStream(file)
      .pipe(fsc(CHUNK_SIZE))
      .pipe(through2((_chunk, enc, cb) => {
        console.log('test')
        console.log(_chunk)
        var chunk = _chunk.slice(0, 999)

        //const buffer = Buffer.from(chunk)
        //const buffer = contents.toArrayBuffer()
        //const test = Array.apply(null, Array(20000)).map(Number.prototype.valueOf,0)
        //console.log(test)

        ipfs.add(chunk, (err, res) => {
          if (err) {
            console.log(err)
          }
          console.log(res)
          var ts = new Buffer(bs58.decode(res[0].hash)).toString('hex')
          ts = ts.slice(4, ts.length)
          console.log(ts)
          //var verify = web3.eth.contract(abi)
          //var verifyInst = verify.at('0x992fceda0583aae113d83a9e3a7a8c6fc4328598')
          console.log('0x' + buffer.toString('hex'))
          console.log(abiFile)
          resolve(res[0].hash)
          //verifyInst.verifyHash('0x' + buffer.toString('hex'), {from: web3.eth.accounts[0], gas: 3000000})
        })
        //cb()
      }))*/


    ipfs.createAddStream((err, stream) => {
      console.log(stream)

      stream.on('data', (f) => {
        console.log(f)
        resolve(f.hash)
      })

      stream.on('end', () => {
        console.log('done adding ipfs file')
        //resolve(file.hash)
      })
      
      stream.write({path: file.name, content: fileReaderStream(file)})
      stream.end()

      // target set is not a function error from piping
      //fileReaderStream(file).pipe(stream)
    })
  })
}

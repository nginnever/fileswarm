const Web3 = require('web3')
const store = require('../store').store
const bs58 = require('bs58')
const IPFS = require('ipfs-api')

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
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
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
          ],
          seeds: [
            {
              address: 'test',
              chunk: 'test'
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

// ACCOUNT API
export const getBalance = (num) => {
  return new Promise((resolve, reject) => {
    web3 = setWeb3()

    const balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[num]))

    store.dispatch({
      type: 'GET_BALANCE',
      balance: { balance: balance.c }
    })

    resolve(balance)
  })
}

export const setAccount = (num) => {
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: 'GET_ACCOUNT',
      activeAccount: { activeAccount: num }
    })
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
      resolve(result)
    })
  })
}

export const unlock = (account, password) => {
  return new Promise((resolve, reject) => {
    web3 = setWeb3()
    web3.personal.unlockAccount(web3.eth.accounts[account], password, (err, res) => {
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
  return new Promise((resolve, reject) => {
    console.log('begin setting up store')
    console.log('calling set account store')
    setAccount(0).then(() => {
      console.log('getting accounts from geth')
      getAccounts().then((res) => {
        console.log('getting balance from store')
        getBalance(0).then(() => {
          getInitFiles(0).then(() => {
            resolve()
          })
          //var hexenc = '1220bb72da8347160f5b6e001345e90d7213bd166aad262e419c98fb87b5484ef578'
          //var testhash = bs58.encode(new Buffer(hexenc, 'hex'))
          //console.log(testhash)
          //console.log(new Buffer(hexenc, 'hex'))
          //console.log(bs58.decode(testhash, 'utf8'))
          //console.log(new Buffer(bs58.decode(testhash)))
          //ipfsOn().then((id) => {
          //  console.log('test')
          //  console.log(id)
          //  resolve()
          //})
        })
      })
    })
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

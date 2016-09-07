import Web3 from 'web3'
import {store} from '../store'
import bs58 from 'bs58'
import IPFS from 'ipfs-api'

const chunker = require('block-stream2')
const through2 = require('through2')
const Buffer = require('buffer/').Buffer
const fileReaderStream = require('filereader-stream')
const concat = require('concat-stream')
const ipfs = window.IpfsApi('localhost', '5001')
const abiFile = require('../utils/abi.js').file
const abiManager = require('../utils/abi.js').manager
const managerAddy = '0x31cd8c442a7c5ce6dc13781a0b818779e2dd5139'
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

function getInitFiles () {
  return new Promise((resolve, reject) => {
    const _manager = getManagerContract()
    const fileshash = _manager.userFiles(web3.eth.accounts[0])
    console.log('database files hash: ')
    console.log(fileshash)
    if (fileshash === '0x0') {
      var user = [
        {
          files: [
            {
              hash: 'test-file',
              name: 'test.jpg',
              size: 20309209
            }
          ]
        }
      ]
      store.dispatch({
        type: 'GET_FILES',
        files: { user: user }
      })
    }
    
    // TODO: Get this from ipfs
    var user = [
      {
        files: [
          {
            hash: 'QmTw6BFqgED...',
            name: 'test.jpg',
            size: 20309209
          }
        ]
      },
      {
        files: [
          {
            hash: 'QmTw6BFqgED..',
            name: 'test1.jpg',
            size: 20309209
          }
        ]
      },
      {
        files: [
          {
            hash: 'QmTw6BFqgED..',
            name: 'test2.jpg',
            size: 20309209
          }
        ]
      }
    ]

    var manager = getManagerContract()
    var fonline = manager.filecount().c[0]

    console.log('files online')
    console.log(fonline)

    store.dispatch({
      type: 'GET_FILES',
      user: { user: user }
    })

    store.dispatch({
      type: 'GET_ONLINE',
      online: { online: fonline }
    })
    //ipfs.get
    resolve()
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
          getInitFiles().then(() => {
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

    var fObject = {
      files: []
    }

    var ts = new Buffer(bs58.decode(hash)).toString('hex')
    ts = ts.slice(4, ts.length)
    console.log(ts)
    var managerInst = getManagerContract()
    managerInst.createFile(ts, {from: web3.eth.accounts[account], value: web3.toWei(value), gas:3000000}, (err, res) => {
      console.log(res)
      console.log(err)
      console.log(managerInst.files(managerInst.filecount() - 1))
    })

    // wait for tx to be mined
    // TODO: use solidity events
    setTimeout(wait, 15000)

    function wait() {
      var _currentStore = store.getState()
      var user = _currentStore.filesReducer.toJSON().user
      
      user[account].files.push({
        hash: hash,
        name: name,
        size: size
      })

      // save files array to ipfs and save hash in manager contract

      ipfs.add(new Buffer(user), (err, res) => {
        if (err) {
          console.log(err)
        }
        console.log('----IPFS add user files res----')
        console.log(res)

        // find dag links and create the chunks in file contract
        

        console.log('new file contract addy')
        console.log(managerInst.files(managerInst.filecount - 1))

        var fileInst = getFileContract(managerInst.files(managerInst.filecount - 1))
        console.log('new file balance')
        console.log(fileInst.balance())
        console.log('new account balance')
        const newb = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[_currentStore.accountReducer.toJSON().activeAccount]))
        
        // save file object to ipfs and register in contract
        _files = _currentStore.filesReducer.user[_currentStore.accountReducer.toJSON().activeAccount]
        console.log('files object from store')
        console.log(_files)
        store.dispatch({
          type: 'GET_FILES',
          user: { user: user }
        })

        // dispatch the new balance
        store.dispatch({
          type: 'GET_BALANCE',
          balance: {balance: newb.c}
        })

        console.log(managerInst.userFiles(web3.eth.accounts[account]))
      })
    }

  })
}

export const getFile = (file) => {
  return new Promise((resolve, reject) => {
    ipfs.add(fileReaderStream(file), (err, res) => {
      if (err) {
        console.log(err)
      } else {
        resolve(res[0].hash)
      }
    })
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
  })
}


function fsc (size) {
  return chunker({ size: size, zeroPadding: false })
}

    function test (stream) {
      console.log(stream)
      return new Promise((resolve, reject) => {
        resolve('test2323')
      })
    }
import Web3 from 'web3'
import {store} from '../store'
import bs58 from 'bs58'
//import IPFS from 'ipfs-api'
const Buffer = require('buffer/').Buffer
const ipfs = window.IpfsApi('localhost', '5001')
// import lightwallet from 'eth-lightwallet'
// import web3hook from 'hooked-web3-provider'

let web3
//let ipfs
// import {createDaemon} from '../utils/ipfs'


export const search = (term) => {
  return new Promise((resolve, reject) => {
    const registryContract = web3.eth.contract(abi)
    // const regInstance = registryContract.at('0xb5f546d5bc8ab6ce0a4091c8bf906800627912cd')
    // server test net
    const regInstance = registryContract.at('0x7b7ac61b0c77fbde14b61eb31494abd05f4fd0ae')
    const listNode = regInstance.registry(term)
    resolve(listNode)
  })

}

export const iterate = () => {
  return new Promise((resolve, reject) => {
    const registryContract = web3.eth.contract(abi)
    // const regInstance = registryContract.at('0xb5f546d5bc8ab6ce0a4091c8bf906800627912cd')
    // server test net
    const regInstance = registryContract.at('0x7b7ac61b0c77fbde14b61eb31494abd05f4fd0ae')    
    const size = regInstance.size().c[0]
    console.log(size)
    var head = 'test'
    var next
    var list = []
    for (var i = 0; i < size; i++) {
      const element = regInstance.registry(head)
      console.log(i)
      if (i != 0) {
        list.push({name: next, hash:element[2]+element[3]})
      }
      next = hex_to_ascii(element[1].slice(2,element[0].length))
      head = element[1]
    }
    resolve(list)
  })

}

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
    //web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.28:8545"))

    // demo server
    web3 = new Web3(new Web3.providers.HttpProvider("http://149.56.133.176:8545"))
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
    ipfs.cat('QmTw6BFqgEDqUR4Sf32MEd39SLQRSQCoMpdQguzrC3ZcUn')
    .then((id) => {
      console.log(id)
      resolve(id)
    })
    .catch(function(err) {
      reject(err)
    })
  })
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
          var hexenc = 'f560277aa7b7ea251a142fc191eb09307a4a1bfee6f62420ec0a67398f4bbed8'
          var testhash = bs58.encode(new Buffer(hexenc, 'hex'))
          console.log(testhash)
          console.log(new Buffer(hexenc, 'hex'))
          //console.log(bs58.decode(testhash, 'utf8'))
          console.log(new Buffer(bs58.decode(testhash)))
          ipfsOn().then((id) => {
            console.log(id)
            resolve()
          })
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
export const getFile = (file) => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(file.result)
    //console.log(buffer)
    ipfs.add(buffer, (err, res) => {
      if (err) console.log(err)
      console.log(res)
    })
  })
}


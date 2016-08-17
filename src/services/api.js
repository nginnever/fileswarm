import Web3 from 'web3'
// import lightwallet from 'eth-lightwallet'
// import web3hook from 'hooked-web3-provider'

let web3
// import {createDaemon} from '../utils/ipfs'

const abi = 
  [{
    "constant": true,
    "inputs": [],
    "name": "tail",
    "outputs": [{
      "name": "",
      "type": "bytes32"
    }],
    "type": "function"
  }, {
    "constant": false,
    "inputs": [{
      "name": "name",
      "type": "bytes32"
    }, {
      "name": "hash1",
      "type": "string"
    }, {
      "name": "hash2",
      "type": "string"
    }],
    "name": "publish",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "type": "function"
  }, {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "bytes32"
    }],
    "name": "registry",
    "outputs": [{
      "name": "previous",
      "type": "bytes32"
    }, {
      "name": "next",
      "type": "bytes32"
    }, {
      "name": "hash1",
      "type": "string"
    }, {
      "name": "hash2",
      "type": "string"
    }],
    "type": "function"
  }, {
    "constant": true,
    "inputs": [],
    "name": "head",
    "outputs": [{
      "name": "",
      "type": "bytes32"
    }],
    "type": "function"
  }, {
    "constant": true,
    "inputs": [],
    "name": "size",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "type": "function"
  }, {
    "constant": false,
    "inputs": [{
      "name": "name",
      "type": "bytes32"
    }, {
      "name": "hash1",
      "type": "string"
    }, {
      "name": "hash2",
      "type": "string"
    }],
    "name": "init",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "type": "function"
  }, {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "bytes32"
    }],
    "name": "owners",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "type": "function"
  }]


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

function hex_to_ascii(str1) {
  var hex  = str1.toString()
  var str = ''
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
  }
  return str
} 

export const publish = (name, hash) => {
  return new Promise((resolve, reject) => {
    const registryContract = web3.eth.contract(abi)
    // local test net
    // const regInstance = registryContract.at('0xb5f546d5bc8ab6ce0a4091c8bf906800627912cd')
    // server test net
    const regInstance = registryContract.at('0x7b7ac61b0c77fbde14b61eb31494abd05f4fd0ae')
    var hash1 = hash.substring(0, 17)
    var hash2 = hash.substring(17, hash.length)
    regInstance.init(name, hash1, hash2, {from: web3.eth.accounts[0], gas:150000}, (err, txhash) => {
      resolve(txhash)
    })

  })

}

export const init = (provider) => {
  return new Promise((resolve, reject) => {
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      // local server
      //web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.28:8545"))

      // demo server
      web3 = new Web3(new Web3.providers.HttpProvider("http://149.56.133.176:8545"))
    } 
  })
  // options: provider
}


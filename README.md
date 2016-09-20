![](https://ipfs.io/ipfs/QmUqiP7KBUJgEcAkK7LzbQEeyQaYDrcGLUw8Gm9gtqTX1v)
![](https://ipfs.io/ipfs/QmSZqvpASNXqeKHtb4rvTh29gYGFrFUGWTPtJxi8Rfs8xf)
![](https://ipfs.io/ipfs/QmPqmaHKDJRGmavbSMDkxMD26M3KD4xg96FvX86UyKKq6x)

#fileswarm

A distributed file storage platform built with <a href="ipfs.io">IPFS</a> and <a href="ethereum.org">Ethereum</a>. Get paid to host files and pay seeders to host your files. Fileswarm is using a blockchain for publishing permissions on files and maintains registries for file properties like seeder health, value, and links to <a href="https://github.com/jbenet/random-ideas/issues/20">merkle-dag</a> objects. Your data is chunked and stored on nodes in the IPFS network and ready for you to retrieve at any time via [dht query](https://github.com/ipfs/go-ipfs/issues/1396#issuecomment-113445913). Cryptographically secure challenges  ensure that your data persists at a cost less than that of traditional companies. Private files can be encrypted by the clients preferred algorithm before seeding.

*Fileswarm is in early development and SHOULD NOT be used with real ether. Beware if you venture off testnets.

The Alpha client can be accessed here http://localhost:8080/ipfs/QmR2nmPqpMBxyA2msZvnVokiz7EdKZd8g5D325jhqunpWH

## Table of Contents

- [Project Status](#project-status)
- [How It Works](#how-it-works)
  - [Uploading / Downloading](#uploading-downloading)
  - [Seeding](#seeding)
  - [Challenges](#challenges)
  - [Payments](#payments)
  - [Costs](#costs)
- [Install](#install)
  - [Dev Server](#dev-server)
  - [Build Source](#build-source)
- [Quick Start Guide](#quickstart-guide)
  - [Requirements](#requirements)
  - [Testnet](#testnet)
  - [Init](#init)
  - [Upload](#upload)
  - [Seed](#seed)
- [Contribute](#contribute)
- [Roadmap](#roadmap)
- [License](#license)


## Project Status

**Status:** *In active development*

Check the project's [roadmap](https://github.com/nginnever/fileswarm/blob/master/ROADMAP.md) to see what's happening at the moment and what's planned next.

[![Project Status](https://badge.waffle.io/nginnever/fileswarm.svg?label=In%20Progress&title=In%20Progress)](https://waffle.io/nginnever/fileswarm)
[![CircleCI Status](https://circleci.com/gh/nginnever/fileswarm.svg?style=shield&circle-token=158cdbe02f9dc4ca4cf84d8f54a8b17b4ed881a1)](https://circleci.com/gh/nginnever/fileswarm)

See also [CHANGELOG](https://github.com/nginnever/fileswarm/blob/master/CHANGELOG.md) for what's new!


## How It Works

fileswarm is an application built from great ideas. This is a basic implementation of a distributed file system similar to [storj](https://storj.io/). The Solidity contract that runs this can be found [here](https://github.com/nginnever/fileswarm-contracts) and implements an early version of a solidity library created by @MrChico found [here](https://github.com/MrChico/verifyIPFS). Thanks Mr. Chico for taking the first steps to an IPFS verifying contract. This currently lacks file encryption before uploading, erasure coding for redundancy, and while files are chunked into merkle dags, there is no SPV style merkle auditing done on this as of yet, the current system is simple and described in the 'challenges' section below. What this does do is demonstrate leveraging two preexisting systems (IPFS and Ethereum) whereby the Ethereum EVM can execute the same process of creating a [multihash](https://github.com/multiformats/multihash) as the IPFS client and verify that any arbitrary (small) amount of data matches that hash. Sharding of files is achieved (although currently just basic fixed sized chunking) and presented to a distributed network. A blockchain can then maintain permissions and verifiability over this network. More detail on both IPFS and Ethereum is available though their respective project spaces.

#### Uploading-Downloading

When uploading a file, the application will chunk the file and create [merkle dag objects](https://github.com/ipfs/specs/tree/master/merkledag) with IPFS. You must select an input value in Ether to supply the file contract that will be created next to fund the seeders that will be responding to the file's challenges. The rate that file contracts set new challenges is fixed so assuming that there is always a seeder responding, the more value supplied the longer the file will be seeded. Your file is attached to your Ethereum public key. An identity like uPort can be applied to this key and with your key the files uploaded can be retrieved from any other location. 

#### Seeding

Seeding is done by consulting the manager contract that creates each individual file contract to find new files to seed. There is a global array of all active files in the manager. The application will iterate over each file at random and add themselves as a seeder to the file if applicable. If applicable here means that the seeder is able to download the file either from the source that is still online or from another seeder and that the file is not already at it's max amount of seeders and the seeder is not currently seeding that file. An uploader can only be guaranteed that their file exists on the number of max seeders. Future plans for erasure coding and better redundancy can be explored if there is enough interest. The seeder will be awarded ether for answering challenges that prove they have the file.

#### Challenges

fileswarm challenges are simple. The rate that file contracts set new challenges is fixed to one minute. The amount that the contract pays to seeders during each challenge round can be set (coming soon!) creating a market for seeders to pick up the most favorable files. The application stores pointers to the chunks of file data in the file smart contract, the IPFS multihashes.  One of these pointers is selected by the contract every minute at random. Randomness provided by the block number. If the seeder can respond to the contract with the right bytes that hash to that pointer, the contract will award the seeder with X amount of ether.

#### Payments

Payments to the seeders are made automatically on every successful challenge competition. When a file runs out of funds set from the original upload, it will be removed from the list for seeders to download from.

#### Costs

Ethereum gas prices will be paid by both the uploaders and seeders. The amount of costs placed on the seeder to execute the contract code to verify hashes should be payed by the uploader when the initial value is set.

TODO: Get cost metrics

## Install

fileswarm is a react/redux application and can be ran in the browser or with electron.

requirements:

- node.js
- npm

```
git clone https://github.com/nginnever/fileswarm.git
cd fileswarm
sudo npm i
```

#### Dev-server

Webpack hot reload server

``webpack-dev-server --host 0.0.0.0 --port 1337``

#### Build Source

Run from distribution

``npm run build``

Load /app/dist/index.html

Electron

currently electron isn't compatible with the ipfs webpack build so it won't work atm. 

``npm run build-osx``

## Quickstart Guide

#### Requirements

IPFS: See IPFS [install guide](https://ipfs.io/docs/install/). Soon the binary will be bundled with an install version.

CORS: Set the IPFS daemon to accept requests from localhost

``ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"http://example.com\"]"``

Geth: See [geth install](https://github.com/ethereum/go-ethereum/wiki/geth)

####Testnet:

Connect to morden testnet

```
geth --testnet console
```

Create new account if needed

```
geth --testnet account new
```

You will see a new directory in your .ethereum/testnet folder, wait for the morden testnet to sync up.

Start geth with the following flags, it is important to allow cors headers on the client and enable the rpcapi. 

```
geth --rpc --rpcaddr "localhost" --rpcport 8545 --rpccorsdomain "*" --rpcapi="db,eth,net,web3,personal,web3,debug" --datadir "<your geth install path>/.etherum" --unlock "<coinbase>" --testnet console
```

In order to use fileswarm you will need a small amount of ether to start adding yourself to seed contracts and answer challenges. Once challenge cycles have been entered the application will increase the balance of the seeder.

To obtain Morden testnet ether you can try a faucet here:

``http://icarus.parity.io/rain/<your_ether_address>``

or ZeroGox:

``https://zerogox.com/ethereum/wei_faucet``


#### Init

With webpack dev server:

- navigate to http://localhost:1337

With IPFS gateway:

- navigate to http://localhost:8080/ipfs/QmR2nmPqpMBxyA2msZvnVokiz7EdKZd8g5D325jhqunpWH

The application will initialize a user object to track your files and store it in your IPFS database with a pointer stored in the manager contract for your user account address.

#### Upload

To upload a file simply click on the file selector and choose a file. You will see a Qm... multihash appear as the file is loaded into the application. This file is now broadcast to the IPFS network. Nobody will find this file unless they request it.

Next choose an amount in Wei (lowest Ether denomination) and then click upload. Please allow time for the miners to execute your transaction and your file will appear in the main view.

You will see a multihash of your file, some details of the file, the balance remaining on the file contract, number of seeders hosting your file, and download link that will request your file from IPFS.

#### Seed

To seed select the seed tab from the dashboard. If you have not already you will need to unlock your account with the button in the bottom right of the application. Once unlocked you must then select a max diskspace allowed and slide the amount of space you would like to seed over. Now click seed and you will start to see files appear in the main view. Each hash is a file you are able to seed and your balance will periodically increase as you answer challenges on those files.

#### Contribute

contribution guidelines coming soon!

#### Roadmap

TODO

- Break apart pyramid of doom functions
  - c () seeding
  - upload ()
- Write unit tests
  - React
  - Solidity
  - IPFS
- Solidity
  - add solidity and api methods for removig old files
  - make picking up seeds at random index
  - add events to listen to
- Get cost metrics
- UI updates
  - Make main table resizable 
  - fix position of table
  - build toolbar
  - make seeders and balance and success dynamic
- Replace async with parallel
- account for chunks < 100 bytes
- better error handling
- alerts for waiting for mining
- fix electron build
- fix js-ipfs

#### License

MIT


![](https://ipfs.io/ipfs/QmUqiP7KBUJgEcAkK7LzbQEeyQaYDrcGLUw8Gm9gtqTX1v)
![](https://ipfs.io/ipfs/QmSZqvpASNXqeKHtb4rvTh29gYGFrFUGWTPtJxi8Rfs8xf)
![](https://ipfs.io/ipfs/QmPqmaHKDJRGmavbSMDkxMD26M3KD4xg96FvX86UyKKq6x)

#fileswarm

A distributed file storage platform built with <a href="ipfs.io">IPFS</a> and <a href="ethereum.org">Ethereum</a>. Get paid to host files and pay seeders to host your files. Fileswarm is using a blockchain for publishing permissions on files and maintains registries for file properties like seeder health, value, and links to <a href="https://github.com/jbenet/random-ideas/issues/20">merkle-dag</a> objects. Your data is chunked and stored on nodes in the IPFS network and ready for you to retreive at any time via [dht query](https://github.com/ipfs/go-ipfs/issues/1396#issuecomment-113445913). Cryptographically secure challenges  ensure that your data persists at a cost less than that of traditional companies. Private files can be encrypted by the clients preferred algorithm before seeding.

*Fileswarm is in early development and SHOULD NOT be used with real ether. Beware if you venture off testnets.

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
- [Quick Start Guide](#quick-start-guide)
  - [Requirements](#requirements)
  - [Init](#init)
  - [Upload](#upload)
  - [Download](#download)
  - [Seed](#seed)
- [Data Model](#data-model)
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

fileswarm is an application built from great ideas. Currently this is a basic implementation of a distributed file system similiar to [storj](https://storj.io/). This currently lacks file encryption before uploading, erasure coding for redundancy, and while files are chunked into merkle dags, there is no SPV style merkle auditing done on this as of yet, the current system is simple and described in the 'challenges' section below. What this does do is demonstrate leveraging two prexisting sytems (IPFS and Ethereum) whereby the Ethereum EVM can execute the same process of creating a [multihash](https://github.com/multiformats/multihash) as the IPFS client and verify that any arbitrary (small) amount of data matches that hash. Sharding of files is achieved (although currently just basic fixed sized chunking) and presented to a distributed network. A blockchain can then maintain permissions and verifiablility over this network. More detail on both IPFS and Ethereum is availble though their respective project spaces.

#### Uploading-Downloading

When uploading a file, the application will chunk the file and create [merkle dag objects](https://github.com/ipfs/specs/tree/master/merkledag) with IPFS. You must select an input value in Ether to supply the file contract that will be created next to fund the seeders that will be responding to the file's challenges. The rate that file contracts set new challenges is fixed so assuming that there is always a seeder reponding, the more value supplied the longer the file will be seeded. Your file is attached to your Ethereum public key. An identity like uPort can be applied to this key and with your key the files upload can be retrieved from any other location. 

#### Seeding

Seeding is done by consulting the manager contract that creates each individual file contract to find new files to seed. There is a global array of all active files in the manager. The application will iterate over each file at random and add themelves as a seeder to the file if applicable. If applicable here means that the seeder is able to download the file either from the source that is still online or from another seeder and that the file is not already at it's max amount of seeders and the seeder is not currently seeding that file. An uploader can currently only be garunteed that their file exists on the number of max seeders ethereum addresses. Future plans for erasure coding and better redundancy can be explored if there is enough interest. The seeder will awarded ether for answering challenges that prove they have the file.

#### Challenges

fileswarm challenges are currently simple. The rate that file contracts set new challenges is fixed to 1 minute. The amount that the contract pays to seeders during each challenge round can be set (coming soon!) creating a market for seeders to pick up the most favorable files. The application stores pointers to the chunks of file data in the file smart contract, the IPFS multihashes.  One of these pointers is selected by the contract every minute at random. Randomness provided by the blocknumber. If the seeder can respond to the contract with the right bytes that hash to that pointer, the contract will award the seeder with X amount of ether.

#### Payments

Payments to the seeders are made automatically on every successful challenge completetion. When a file runs out of funds set from the original upload, it will be removed from the list for seeders to download from.

#### Costs

Ethereum gas prices will be paid by both the uploaders and seeders. The amount of costs placed on the seeder to execute the contract code to verify hashes should be payed by the uploader when the initial value is set.

TODO: Get cost metrics

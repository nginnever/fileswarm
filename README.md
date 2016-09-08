#fileswarm

A distributed file storage platform built with <a href="ipfs.io">IPFS</a> and <a href="ethereum.org">Ethereum</a>. Fileswarm is built using a blockchain for publishing permissions on files and maintains registries for file properties like seeder health, value, and links to <a href="https://github.com/jbenet/random-ideas/issues/20">merkle-dag</a> objects. Your data is chunked and stored on nodes in the IPFS network and ready for you to retreive at any time via dht query. Cryptographically secure challenges and  ensure that your data persists at a cost less than that of traditional companies. Private files can be encrypted by the clients preferred algorithm before seeding.

*Fileswarm is in early development and SHOULD NOT be used with real ether. Beware if you venture off test nets.

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
  - [Init](#init)
  - [Upload](#upload)
  - [Download](#download)
  - [Seed](#seed)
- [Data Model](#data-model)
- [Contribute](#contribute)
- [Road Map](#road-map)
- [License](#license)


## Project Status

**Status:** *In active development*

Check the project's [roadmap](https://github.com/haadcode/orbit/blob/master/ROADMAP.md) to see what's happening at the moment and what's planned next.

[![Project Status](https://badge.waffle.io/nginnever/fileswarm.svg?label=In%20Progress&title=In%20Progress)](https://waffle.io/nginnever/fileswarm)
[![CircleCI Status](https://circleci.com/gh/nginnever/fileswarm.svg?style=shield&circle-token=158cdbe02f9dc4ca4cf84d8f54a8b17b4ed881a1)](https://circleci.com/gh/nginnever/fileswarm)

See also [CHANGELOG](https://github.com/nginnever/fileswarm/blob/master/CHANGELOG.md) for what's new!


## How It Works

#### IPFS
#### Ethereum

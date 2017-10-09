# Momlife Bloomcoin ERC20 Token & ICO smart contracts

This is repository with Ethereum smart contracts for MomLife Bloomcoin Token and ICO

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

First you need install NodeJS 8.x and npm 5.x is need for [Truffle](http://truffleframework.com/) development framework 

Debian and Ubuntu based Linux distributions:
```Bash
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
For Windows simply download the [Windows Installer](http://nodejs.org/#download) directly from the [nodejs.org](http://nodejs.org/) web site.

### Installing

Clone  project and install requirements
```Bash
$ git clone git@bitbucket.org:preggieapp/momtoken.git
$ cd ./momtoken 
$ npm install
```

## Running the tests

For running the test you need start TestRPC server.
```Bash
$ npm start
```

Then run tests
```Bash
$ npm test
```

For stop TestRPC server
```Bash
$ npm stop
```

## Built With

* [Truffle](http://truffleframework.com) - development framework for Ethereum.
* [Zeppelin Solidity](https://github.com/OpenZeppelin/zeppelin-solidity) - Library for writing secure Smart Contracts on Ethereum.
* [TestRPC](https://github.com/ethereumjs/testrpc) - is a Node.js based Ethereum client for testing and development.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


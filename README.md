# Polygon Roadtoweb3 File Verifier
Web3 Dapp on Polygon which stores SHA256 of files to blockchain and can verifies origin in form of address and displays hash.

## Libraries
* lite-server: https://www.npmjs.com/package/lite-server/v/2.5.3
* ethers.js: https://docs.ethers.io/v5/
* bootstrap: https://github.com/twbs/bootstrap
* Ethereum Provider API: https://docs.metamask.io/guide/ethereum-provider.html
* Crypto.subtle: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle

## Deploy
```
npm install
npm run dev
```
http://localhost:3000/


## Contracts
Polygon Mumbai Testnet -> https://mumbai.polygonscan.com/address/0xAa9C2d018CB62f8Ba3e5041cE095f86fA325bA8c

## Usage
1. Make sure you have Metamask extension installed. If not, go to: https://metamask.io/
2. Project uses Mumbai Testnet. Learn how to configure network at https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/
    * Network name: Matic Mumbai
    * RPC: https://rpc-mumbai.maticvigil.com/
    * Chain ID: 80001
    * Currency Symbol (optional): MATIC
    * Block Explorer URL (optional): https://mumbai.polygonscan.com/
3. Get MATIC at https://faucet.polygon.technology/
4. Connect Metamask wallet to localhost app.
5. Import file
5a. of which hash you want to add to blockchain and press Add File To Polygon. Sign the transaction which pops up.
5b. which you want to verify, press Get Origin Button (or enter origin address manually if you are sure about it) and press Verify File
6. Wait a second for the results.

## About
Lightweight dapp with the purpose of verifying files and ensuring you have the correct ones.
Application frontend calculates SHA256 of an imported file. Then you have the options of:
1. Insert the hash in the blockchain with your address as the origin.
2. Get an address of origin of an imported file.
3. Verify if the hash of your file matches the address of origin you enter (or get from option 2).

This way, you can ensure the files you download or find are the right ones you expect, if you can get a published address/hash from the original developer. Stored information in the blockchain are address of origin and block number which can be displayed in the application.


##### Use cases:
1. You find a random flash drive and connect it to your PC (which you shouldn't anyway). Eventually you find there some files, among them an installer of an application you suddenly might have the need to use! Then you can check if the installer has been recorded in the blockchain by the developer.
2. Developers of freeware often publish their file hashes online. You can easily check if your downloaded file is the same.
3. You can also just get a SHA256 hash with no blockchain interaction if ever you need.

##### Possible expansions:
1. On the backend side add a counter of searches of given origin address/file verifications and more other possible statistics.
2. Expand to other wallets.
3. Expand hash algorithms.
4. Possibly store files and use IPFS.

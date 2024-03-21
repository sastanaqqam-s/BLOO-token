## Simply Setup Hardhat

These packages will help you in both small and large projects. They will assist you in testing, generating code coverage, determining contract size, and calculating contract gas fees/prices in USD.

If you are setting up by cloning, please remove the "@nomicfoundation/hardhat-toolbox" and "@typechain/hardhat" packages from the package.json because they might not install correctly due to different package versions. After removing them, make sure to add "--force install" at the end to forcefully install all the packages. </p>

---

## Installation and Setup Instructions

### If you want to set up the hardhat through Clone: follow these steps-

<b> Install All Packages: </b>

    npm install --save

<b> Update Important Packages like: Hardhat and Openzeppelin: </b>

    npm install --save-dev hardhat @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades

### If you want to set up the hardhat from scratch, follow these steps-

<b> Open Terminal, Where you want to Setup </b>
In the place of <folder_name> give any name as you want

    mkdir <folder_name>
    cd <folder_name>

<b> Create Package.json file in Created folder </b>

    npm init -y

<b> Or Clean Cache (optional) </b>

    npm cache clean --force

<b> Install Dependencies Packages </b>
I have already mentioned the versions of some packages which versions I am going to use like `ethers ^5.6.9`. Because some packages are dependent on other packages.

So make sure to check your package's compatibility with other packages and use the version as needed.

    npm i --save-dev @nomicfoundation/hardhat-chai-matchers@1.0.4 @nomicfoundation/hardhat-network-helpers @nomiclabs/hardhat-ethers@2.2.3 @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-solhint @nomiclabs/hardhat-waffle @typechain/ethers-v5@7.2.0 @typechain/hardhat@2.3.1 @types/chai @types/mocha @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser hardhat chai chai-bignumber chai-bn dotenv eslint eslint-config-prettier eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-prettier eslint-plugin-promise ethereum-waffle ethers@5.6.9 hardhat-contract-sizer hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage ts-node typechain@5.2.0 typescript@5.1.6

    npm install --save @openzeppelin/contracts @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades@1.28.0

## For Hardhat Setps: 

    npx hardhat

<b> Choose script, I choose Typescript </b>
<b> Add .git ignore </b>
<b> No need to install hardhat-toolbox, or ignore this package </b>

<b> You can remove the existing contracts, testing files, and scripts from the project and replace them with your own contracts, tests, and scripts or you can use mine. </b>

--

### Make sure to update your Hardhat configuration and create a .env file, You can refer to the example .env file provided and make the necessary updates to your own .env file and the Hardhat configuration file based on your network specifications.

<b> Create & Configure .env file: </b>
Make a copy of env_example named .env.

    cp env_example .env

You can also modify any of the optional environment variables if you'd wish, but the defaults should work perfectly well.

---

### Hardhat Config

In `hardhat.config.ts` file add network with basic some parameter like set url(your network url api key) and private key(which you are using to deploy and verify your smart contract).

Then, Set `ETHERSCAN API KEY`.

#### ETHERSCAN_API_KEY

You will get the ETHERSCAN API KEY from etherscan.io, for which you need to log in to etherscan.io. After logging in, go to the "https://etherscan.io/myapikey" website and create your API key there.

#### ALCHEMY_GOERLI_API_KEY

You can get the ALCHEMY GOERLI API KEY either from Alchemy or create it from Infura. You have the option to create an API key from Alchemy based on your network preferences by visiting https://dashboard.alchemy.com/. Moreover, you can also use Alchemy's "faucet" feature to get test Ether for your Goerli network or other network.

PRIVATE_KEY : You can obtain your private key from your public address in MetaMask.

#### Then, Test your Smart contract

    npx hardhat clean

    npx hardhat compile

    npx hardhat test

    npx hardhat coverage

<b> After Successfully run test case you can use this network setup as per need <b>

---

## Add Ethereum Network into Metamask

### Test Network 

    Metamask Network Parameters
    Network Name: Goerli test network
    New RPC URL: https://goerli.infura.io/v3/
    Chain ID: 5
    Currency Symbol: GoerliETH
    Block Explorer URL: https://goerli.etherscan.io

### Deploy:

    npx hardhat run --network goerli scripts/deploy.ts

### Verify:

    npx hardhat verify --network goerli <token.address>

---

## Add Polygon Network into Metamask

### Testnet Network

    Metamask Network Parameters

    Network Name: Mumbai Testnet
    New RPC URL: https://polygon-mumbai.g.alchemy.com/v2/<apikey>
    Chain ID: 80001
    Currency Symbol: MATIC
    Block Explorer URL: https://mumbai.polygonscan.com/

Deploy: npx hardhat run --network polygon_mumbai scripts/deploy.ts
Verify: npx hardhat verify --network polygon_mumbai <token.address>

### Mainnet Network

    Network Name: Polygon Mainnet
    New RPC URL: https://polygon-rpc.com/
    Chain ID: 137
    Currency Symbol: MATIC
    Block Explorer URL: https://polygonscan.com/

### Deploy 
    
    npx hardhat run --network matic scripts/deploy.ts

### Verify
    
    npx hardhat verify --network matic <token.address>
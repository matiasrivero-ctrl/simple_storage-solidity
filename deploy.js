const ethers = require('ethers');
const fs = require('fs-extra');
const dotenv = require('dotenv');

dotenv.config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf-8');
  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf-8'
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log('Deploying, please wait...');

  const contract = await contractFactory.deploy();
  // console.log(contract);
  // Get number
  const currentFavouriteNumber = await contract.retrieve();
  console.log(`Current favourite number: ${currentFavouriteNumber.toString()}`);

  const transactionResponse = await contract.store('7');
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedNumber = await contract.retrieve();
  console.log(`Updated favourite number: ${updatedNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

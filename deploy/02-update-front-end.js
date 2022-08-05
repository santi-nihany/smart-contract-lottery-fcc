const fs = require("fs");

const FRONT_END_ADDRESSES_FILE =
    "../nextjs-smartcontract-lottery-fcc/my-app/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery-fcc/my-app/constants/abi.json";
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front-end...");
        updateContractAddresses();
        updateAbi();
    }
};

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle");
    const chainId = network.config.chainId.toString();
    //pass raffle address to frontend
    const contractAdddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"));
    if (chainId in contractAdddresses) {
        if (!contractAdddresses[chainId].includes(raffle.address)) {
            contractAdddresses[chainId].push(raffle.address);
        }
    }
    {
        contractAdddresses[chainId] = [raffle.address];
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAdddresses));
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle");
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json));
}

module.exports.tags = ["all", "frontend"];

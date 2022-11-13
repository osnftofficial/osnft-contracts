
import { expect } from "chai";
import { toUtf8Bytes } from "ethers/lib/utils";
import { ethers, upgrades } from "hardhat"
import { describe } from "mocha";
import { testApprover } from "./approver";
import { IDeployedPayload } from "./interfaces";
import { testMarketplace } from "./marketplace";
import { testNFT } from "./nft";



function getProjectId(projectUrl: string) {
    return ethers.utils.keccak256(
        toUtf8Bytes(projectUrl)
    );
}
function getSellId(tokenId: string, from: string) {
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(['bytes32', 'address'], [tokenId, from])
    );
}

describe("contracts", () => {

    const payload = {
        projects: {
            "jsstore-example": `github.com/ujjwalguptaofficial/jsstore-examples`,
            "mahal-example": 'github.com/ujjwalguptaofficial/mahal-examples',
            "mahal": 'github.com/ujjwalguptaofficial/mahal',
            "mahal-webpack-loader": 'github.com/ujjwalguptaofficial/mahal-webpack-loader',
            "jsstore": 'github.com/ujjwalguptaofficial/jsstore',
            "godam": 'github.com/ujjwalguptaofficial/godam'
        },
        getProjectId,
        getSellId
    } as IDeployedPayload;

    before(async () => {
        const [signer1, signer2, signer3, operator, defaultMarketPlace, signer4] = await ethers.getSigners();

        const approverContract = await ethers.getContractFactory('OSNFTApprover');

        const deployedApproverContract = await upgrades.deployProxy(approverContract, [], {
            initializer: 'initialize',
        }) as any;
        payload.approver = deployedApproverContract;


        const ct = await ethers.getContractFactory('OSNFT');
        const constructorArguments = ['OpenSourceNFT', 'OS', 'https://ujjwalnft.com/metadata/', payload.approver.address];


        // const deploymentData = ct.interface.encodeDeploy(constructorArguments);


        const deployedContract = await upgrades.deployProxy(ct, constructorArguments, {
            initializer: 'initialize',
        });

        await deployedContract.deployed();

        payload.deployer = signer1;
        payload.signer2 = signer2;
        payload.signer3 = signer3;
        payload.signer4 = signer4;
        payload.operator = operator;
        payload.defaultMarketPlace = defaultMarketPlace;

        payload.nft = deployedContract as any;

        console.log('nft deployed');

    })

    it('gas estimate for nft contract deployment', async () => {
        const ct = await ethers.getContractFactory('OSNFT');
        const deploymentData = ct.getDeployTransaction({

        });
        const estimatedGas = await ethers.provider.estimateGas({ data: deploymentData.data });

        expect(estimatedGas).equal(4821903);
    })

    describe('Approver', () => {
        testApprover(payload);
    });

    describe('OSNFT', () => {
        testNFT(payload);
    });

    describe('Marketplace', () => {
        testMarketplace(payload);
    });
})
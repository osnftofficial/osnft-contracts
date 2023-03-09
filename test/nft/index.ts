
import { describe } from "mocha";
import { IDeployedPayload } from "../interfaces";
// import { runPublicState } from "./public_state";
// import { setBaseTokenURI } from "./set_base_token_uri";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { testProjectTokenize } from "./tokenize_project";
import { testMinter } from "./minter";
import { testPayableToken } from "./payable_token";
import { testMint } from "./mint";
import { testBurn } from "./burn";

export function testNFT(payload: IDeployedPayload) {

    it('deploy contract', async () => {
        const ct = await ethers.getContractFactory('OSNFT');

        const deployedContract = await upgrades.deployProxy(ct, [
            'https://osnft.app/nft/',
        ], {
            initializer: 'initialize',
        });

        await deployedContract.deployed();

        payload.nft = deployedContract as any;

        // const ctV2 = await ethers.getContractFactory('OSNFTV2');
        // await upgrades.upgradeProxy(payload.nft.address, ctV2);

        // const ctV3 = await ethers.getContractFactory('OSNFTV3');
        // await upgrades.upgradeProxy(payload.nft.address, ctV3);

        console.log('nft deployed');
    })

    it('call initialize', async () => {
        const tx = payload.nft.initialize(
            'https://osnft.app/nft/',
        );
        await expect(tx).revertedWith(`Initializable: contract is already initialized`);
    })

    describe('check supports interface', () => {
        it('erc721', async () => {
            const isERC721Supported = await payload.nft.supportsInterface('0x80ac58cd');
            expect(isERC721Supported).equal(false);
        });
        it('erc1155', async () => {
            const isERC721Supported = await payload.nft.supportsInterface('0xd9b67a26');
            expect(isERC721Supported).equal(true);
        });
        it('erc721 meta data', async () => {
            const isERC721Supported = await payload.nft.supportsInterface('0x5b5e139f');
            expect(isERC721Supported).equal(false);
        });
    });

    // describe('relayer', () => {
    //     it('set relayer non admin', async () => {
    //         const relayer = payload.relayer.address;
    //         const tx = payload.nft.connect(payload.signer3)["relayer(address)"](relayer);
    //         await expect(tx).revertedWith(`Ownable: caller is not the owner`);
    //     })

    //     it('set relayer success', async () => {
    //         const relayer = payload.relayer.address;
    //         await payload.nft["relayer(address)"](relayer);

    //         const addressFrom = await payload.nft["relayer()"]();

    //         expect(addressFrom).equal(relayer);
    //     })
    // })

    describe("payable token", async () => {
        testPayableToken(payload);
    })

    describe("minters", async () => {
        testMinter(payload);
    })

    describe("tokenize project", async () => {
        testProjectTokenize(payload);
    })

    describe('mint', async () => {
        testMint(payload);
    })

    describe('burn', async () => {
        testBurn(payload);
    })


    // describe('owner of', async () => {
    //     testOwnerOf(payload);
    // })

    // describe('project meta', async () => {
    //     testProjectMeta(payload);
    // })


    // describe('approve', async () => {
    //     testApprove(payload);
    // })

    // describe('transfer from', async () => {
    //     testTransferFrom(payload);
    // })

    // describe('burn', async () => {
    //     testNFTBurn(payload);
    // })
}

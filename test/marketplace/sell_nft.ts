import { time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { IDeployedPayload } from "../interfaces";

export function testNFTSale(payload: IDeployedPayload) {

    const signMessage = async (user: SignerWithAddress, tokenId, share, price, erc20token, sellPriority, deadline) => {

        const nftMintDataType = [
            { name: "tokenId", type: "bytes32" },
            { name: "share", type: "uint32" },
            { name: "price", type: "uint256" },
            { name: "paymentToken", type: "address" },
            { name: "sellPriority", type: "uint32" },
            { name: "deadline", type: "uint256" },
        ];

        const domainData = {
            name: "OSNFT_RELAYER",
            version: "1",
            chainId: await user.getChainId(),
            verifyingContract: payload.relayer.address.toLowerCase(),
        };
        const message = {
            tokenId,
            share,
            price,
            paymentToken: erc20token,
            sellPriority,
            deadline
        };


        const signatureResult = await user._signTypedData(domainData, {
            NFTSellData: nftMintDataType,
        }, message);


        return signatureResult;
    }

    it("add nft on sale by non owner", async () => {
        const marketplace = payload.marketplace;
        const tx = marketplace.connect(payload.signer4).sell({
            tokenId: payload.getProjectId(
                payload.projects["jsstore-example"]
            ),
            share: 0,
            price: 1000000,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 0
        });
        await expect(tx).revertedWith('require_nft_owner');
    });

    it("not approved for marketplace", async () => {

        // change default marketplace

        await payload.nft["defaultMarketPlace(address)"](payload.operator.address);

        const marketplace = payload.marketplace;
        const projectId = payload.getProjectId(
            payload.projects["jsstore-example"]
        );

        const tx = marketplace.connect(payload.signer3).sell(
            {
                tokenId: projectId,
                share: 0,
                price: 10000000000,
                paymentToken: payload.erc20Token1.address,
                sellPriority: 0
            }
        );
        await expect(tx).revertedWith('require_nft_transfer_approval');
    });

    it('change default marketplace', async () => {
        const defaultMarketPlace = payload.marketplace.address;
        const tx = await payload.nft["defaultMarketPlace(address)"](defaultMarketPlace);

        const defaultMarketPlaceValue = await payload.nft["defaultMarketPlace()"]();

        expect(defaultMarketPlaceValue).equal(defaultMarketPlace);
    });

    it("estimate gas", async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore-example"]
        );
        const price = 10000000000;
        const gas = await marketplace.connect(payload.signer3).estimateGas.sell({
            tokenId,
            share: 0,
            price,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 0
        });

        expect(gas).equal(161022);
    });


    it('not existing token', async () => {
        const marketplace = payload.marketplace;
        const projectId = payload.getProjectId(
            "ffgg"
        );

        const tx = marketplace.sell({
            tokenId: projectId,
            share: 0,
            price: 10,
            paymentToken: payload.deployer.address,
            sellPriority: 0
        });
        await expect(tx).revertedWith('ERC721: invalid token ID');
    });

    it("price zero", async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore-example"]
        );
        const tx = marketplace.connect(payload.signer3).estimateGas.sell({
            tokenId,
            share: 0,
            price: 0,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 0
        });

        await expect(tx).revertedWith('Price must be above zero');
    });


    it("non payable token", async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore-example"]
        );
        const price = 10000000000;
        const tx = marketplace.connect(payload.signer3).estimateGas.sell({
            tokenId,
            share: 0,
            price,
            paymentToken: payload.marketplace.address,
            sellPriority: 0
        });

        await expect(tx).revertedWith('invalid_payment_token');
    });


    it("add jsstore-example (percentage cut) on sale", async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore-example"]
        );
        const price = 10000000000;

        const nativeCoin = payload.nativeToken;
        const from = payload.signer3.address;
        const nativeCoinBalance = await nativeCoin.balanceOf(from);

        const tx = marketplace.connect(payload.signer3).sell({
            tokenId,
            share: 0,
            price,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 0
        });
        const sellId = payload.getSellId(tokenId, from);
        await expect(tx).emit(marketplace, 'Sale').withArgs(
            tokenId,
            from,
            sellId,
            0,
            price,
            payload.erc20Token1.address,
            0
        );

        const nftData = await marketplace.getNFTFromSale(sellId);

        expect(nftData.seller).equal(from);
        expect(nftData.paymentToken).equal(payload.erc20Token1.address);
        expect(nftData.share).equal(0);
        expect(nftData.price).equal(price);
        expect(nftData.tokenId).equal(tokenId);
        expect(nftData.sellPriority).equal(0);

        const nativeCoinBalanceAfter = await nativeCoin.balanceOf(from);
        expect(nativeCoinBalanceAfter).equal(
            nativeCoinBalance
        )
        const txhash = (await tx).hash;
        // console.log("txhash",);
        payload.transactions['sellJsStoreExamples'].push(txhash);
    });


    it("add listed item on sale again", async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore-example"]
        );
        const price = 10000000000;
        const tx = marketplace.connect(payload.signer3).sell({
            tokenId,
            share: 0,
            price,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 0
        });

        await expect(tx).revertedWith('already_on_sale');
    });


    it('add share token on sale with zero share', async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore"]
        );
        const price = 10000000000;
        const tx = marketplace.connect(payload.signer4).sell({
            tokenId,
            share: 0,
            price,
            paymentToken: payload.marketplace.address,
            sellPriority: 0
        });

        await expect(tx).revertedWith('require_input_share_above_zero');
    });

    describe('add share token on sale with share more than have', async () => {

        it('owner have zero share', async () => {
            const marketplace = payload.marketplace;
            const tokenId = payload.getProjectId(
                payload.projects["jsstore"]
            );
            const price = 10000000000;
            const shareOf = await payload.nft.connect(payload.signer4).shareOf(tokenId, payload.signer4.address);
            expect(shareOf).equal(0);
            const tx = marketplace.connect(payload.signer4).sell({
                tokenId,
                share: shareOf + 1,
                price,
                paymentToken: payload.marketplace.address,
                sellPriority: 0
            });

            await expect(tx).revertedWith('require_owner_share_above_equal_input');
        })

        it('owner have share more than zero', async () => {
            const marketplace = payload.marketplace;
            const tokenId = payload.getProjectId(
                payload.projects["mahal"]
            );
            const price = 10000000000;
            const shareOf = await payload.nft.shareOf(tokenId, payload.signer2.address);
            expect(shareOf).greaterThan(0);

            const tx = marketplace.connect(payload.signer2).sell({
                tokenId,
                share: shareOf + 1,
                price,
                paymentToken: payload.marketplace.address,
                sellPriority: 0
            });

            await expect(tx).revertedWith('require_owner_share_above_equal_input');
        })

    });

    it('add share token on sale', async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore"]
        );
        const price = 10000000000;
        const shareToSell = 100;

        const shareOf = await payload.nft.connect(payload.signer3).shareOf(tokenId, payload.signer3.address);
        expect(shareOf).greaterThan(shareToSell);

        const nativeCoin = payload.nativeToken;
        const from = payload.signer3.address;
        const nativeCoinBalance = await nativeCoin.balanceOf(from);

        const tx = marketplace.connect(payload.signer3).sell({
            tokenId,
            share: shareToSell,
            price,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 1
        });
        const sellId = payload.getSellId(tokenId, from);
        await expect(tx).emit(marketplace, 'Sale').withArgs(
            tokenId,
            from,
            sellId,
            shareToSell,
            price,
            payload.erc20Token1.address,
            1
        );

        const nftData = await marketplace.getNFTFromSale(sellId);

        expect(nftData.seller).equal(from);
        expect(nftData.paymentToken).equal(payload.erc20Token1.address);
        expect(nftData.share).equal(shareToSell);
        expect(nftData.price).equal(price);
        expect(nftData.tokenId).equal(tokenId);
        expect(nftData.sellPriority).equal(1);

        const nativeCoinBalanceAfter = await nativeCoin.balanceOf(from);
        const expectedDeduction = BigNumber.from(10).pow(15).mul(nftData.sellPriority);
        expect(nativeCoinBalanceAfter).equal(
            nativeCoinBalance.sub(expectedDeduction)
        )

        const txhash = (await tx).hash;
        // console.log("txhash",);
        payload.transactions['sellJsStore'].push(txhash);

    });

    it('add share token again on sale', async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["jsstore"]
        );
        const price = 10000000000;
        const shareToSell = 100;

        const shareOf = await payload.nft.connect(payload.signer3).shareOf(tokenId, payload.signer3.address);
        expect(shareOf).greaterThan(shareToSell);

        const tx = marketplace.connect(payload.signer3).sell({
            tokenId,
            share: shareToSell,
            price,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 0
        });
        await expect(tx).revertedWith('already_on_sale')

    });

    it("add mahal-example (percentage cut) on sale", async () => {
        const marketplace = payload.marketplace;
        const tokenId = payload.getProjectId(
            payload.projects["mahal-example"]
        );
        const price = 10000000005;
        const nativeCoin = payload.nativeToken;
        const from = payload.signer2.address;
        const nativeCoinBalance = await nativeCoin.balanceOf(from);
        const tx = marketplace.connect(payload.signer2).sell({
            tokenId,
            share: 0,
            price,
            paymentToken: payload.erc20Token1.address,
            sellPriority: 100
        });
        const sellId = payload.getSellId(tokenId, from);
        await expect(tx).emit(marketplace, 'Sale').withArgs(
            tokenId,
            from,
            sellId,
            0,
            price,
            payload.erc20Token1.address,
            100
        );

        const nftData = await marketplace.getNFTFromSale(sellId);

        expect(nftData.seller).equal(from);
        expect(nftData.paymentToken).equal(payload.erc20Token1.address);
        expect(nftData.share).equal(0);
        expect(nftData.price).equal(price);
        expect(nftData.tokenId).equal(tokenId);
        expect(nftData.sellPriority).equal(100);

        const nativeCoinBalanceAfter = await nativeCoin.balanceOf(from);
        const expectedDeduction = BigNumber.from(10).pow(15).mul(nftData.sellPriority);
        expect(nativeCoinBalanceAfter).equal(
            nativeCoinBalance.sub(expectedDeduction)
        )

        const txhash = (await tx).hash;
        // console.log("txhash",);
        payload.transactions['sellMahalExamples'].push(txhash);
    });

    describe("sell using meta sign", () => {

        it("passing different from than in sign - Invalid signature", async () => {
            const marketplace = payload.marketplace;
            const relayer = payload.relayer;
            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) + 1000;
            const signature = await signMessage(payload.signer3, tokenId, 0, price, erc20token, 0, deadline)
            const tx = relayer.sell(
                {
                    signature,
                    to: payload.signer2.address,
                    deadline: deadline
                },
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 0
                }
            );

            await expect(tx).to.revertedWith('Invalid signature');
        });

        it("Valid signature but not owner", async () => {
            const marketplace = payload.marketplace;
            const relayer = payload.relayer;
            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) + 1000;
            const signature = await signMessage(payload.signer2, tokenId, 0, price, erc20token, 0, deadline)
            const from = payload.signer2.address;
            const tx = relayer.sell(
                {
                    signature,
                    to: from,
                    deadline
                },
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 0
                }
            );

            await expect(tx).to.revertedWith('require_nft_owner');
        });

        it("valid signature valid owner but deadline is expired", async () => {
            const marketplace = payload.marketplace;
            const relayer = payload.relayer;
            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) - 1000;
            const signature = await signMessage(payload.signer3, tokenId, 0, price, erc20token, 0, deadline)
            const from = payload.signer3.address;
            const tx = relayer.sell(
                {
                    signature,
                    to: from,
                    deadline
                },
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 0
                }
            );
            await expect(tx).to.revertedWith(`Signature expired`)
        });

        it("valid signature valid owner but different deadline than signature", async () => {
            const marketplace = payload.marketplace;
            const relayer = payload.relayer;
            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) - 1000;
            const signature = await signMessage(payload.signer3, tokenId, 0, price, erc20token, 0, deadline)
            const from = payload.signer3.address;
            const tx = relayer.sell(
                {
                    signature,
                    to: from,
                    deadline: deadline + 5000
                },
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 0
                }
            );
            await expect(tx).to.revertedWith(`Invalid signature`)
        });

        it("valid signature valid owner but different sellPriority than signature", async () => {
            const marketplace = payload.marketplace;
            const relayer = payload.relayer;

            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) + 1000;
            const signature = await signMessage(payload.signer3, tokenId, 0, price, erc20token, 0, deadline)
            const from = payload.signer3.address;
            const tx = relayer.sell(
                {
                    signature,
                    to: from,
                    deadline: deadline
                },
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 10
                }
            );
            await expect(tx).to.revertedWith(`Invalid signature`)
        });

        it("Invalid relayer", async () => {
            const marketplace = payload.marketplace;
            const relayer = payload.relayer;

            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) + 1000;
            const signature = await signMessage(payload.signer3, tokenId, 0, price, erc20token, 10, deadline)
            const from = payload.signer3.address;
            const tx = marketplace.sellMeta(
                from,
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 10
                }
            );
            await expect(tx).revertedWith(`invalid_relayer`)
        });

        it("gas estimate", async () => {
            const relayer = payload.relayer;

            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) + 1000;
            const signature = await signMessage(payload.signer3, tokenId, 0, price, erc20token, 10, deadline)
            const from = payload.signer3.address;
            const gas = await relayer.estimateGas.sell(
                {
                    signature,
                    to: from,
                    deadline
                },
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 10
                }
            );

            expect(gas).to.within(234321, 234322)
        });

        it("add mahal-webpack-loader (percentage cut) on sale", async () => {
            const marketplace = payload.marketplace;
            const relayer = payload.relayer;

            const tokenId = payload.getProjectId(
                payload.projects["mahal-webpack-loader"]
            );
            const price = ethers.constants.MaxUint256.sub(1);
            const erc20token = payload.erc20Token2.address;
            const deadline = (await time.latest()) + 1000;
            const signature = await signMessage(payload.signer3, tokenId, 0, price, erc20token, 10, deadline)
            const from = payload.signer3.address;
            const tx = relayer.sell(
                {
                    signature,
                    to: from,
                    deadline
                },
                {
                    tokenId,
                    share: 0,
                    price,
                    paymentToken: erc20token,
                    sellPriority: 10
                }
            );
            const sellId = payload.getSellId(tokenId, from);
            await expect(tx).emit(marketplace, 'Sale').withArgs(
                tokenId,
                from,
                sellId,
                0,
                price,
                payload.erc20Token2.address,
                10
            );

            const nftData = await marketplace.getNFTFromSale(sellId);

            expect(nftData.seller).equal(from);
            expect(nftData.paymentToken).equal(payload.erc20Token2.address);
            expect(nftData.share).equal(0);
            expect(nftData.price).equal(price);
            expect(nftData.tokenId).equal(tokenId);
            expect(nftData.sellPriority).equal(10);

            payload.transactions['sellMahalWebpackLoader'].push(
                (await tx).hash
            )
        });
    })

}

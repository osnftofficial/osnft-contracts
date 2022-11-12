import { expect } from "chai";
import { ethers } from "hardhat";
import { IDeployedPayload } from "../interfaces";

export function testBidNFTAuction(payload: IDeployedPayload) {
    it('require valid auction id', async () => {
        const marketplace = payload.marketplace;
        const tx = marketplace.placeBid(
            payload.getSellId(
                payload.getProjectId(payload.projects["mahal"]),
                payload.signer3.address
            ),
            1000000
        );
        await expect(tx).revertedWith('No auction found');
    })

    it('bid amount less than current bid', async () => {
        const marketplace = payload.marketplace;
        const auctionId = payload.getSellId(
            payload.getProjectId(payload.projects["jsstore-example"]),
            payload.signer4.address
        );
        const bidPrice = await marketplace.getCurrentBidPrice(auctionId);
        const tx = marketplace.placeBid(
            payload.getSellId(
                payload.getProjectId(payload.projects["jsstore-example"]),
                payload.signer4.address
            ),
            bidPrice.sub(1)
        );
        await expect(tx).revertedWith('New bid price must be higher than current bid');
    })

    it('bid amount equal to current bid', async () => {
        const marketplace = payload.marketplace;
        const auctionId = payload.getSellId(
            payload.getProjectId(payload.projects["jsstore-example"]),
            payload.signer4.address
        );
        const bidPrice = await marketplace.getCurrentBidPrice(auctionId);
        const tx = marketplace.placeBid(
            auctionId,
            bidPrice
        );
        await expect(tx).revertedWith('New bid price must be higher than current bid');
    })

    it('bider should not be creator', async () => {
        const marketplace = payload.marketplace;
        const tx = marketplace.connect(payload.signer4).placeBid(
            payload.getSellId(
                payload.getProjectId(payload.projects["jsstore-example"]),
                payload.signer4.address
            ),
            1001
        );
        await expect(tx).revertedWith('Creator of auction cannot place new bid');
    })
}
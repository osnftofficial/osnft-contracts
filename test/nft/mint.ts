import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { IDeployedPayload } from "../interfaces";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { OSNFTRelayer } from "../../typechain-types";

export async function signMessageForMint(
  this: IDeployedPayload,
  user: SignerWithAddress,
  tokenId: string,
  star: number,
  fork: number,
  deadline: number
) {
  // const domainType = [
  //     { name: "name", type: "string" },
  //     { name: "version", type: "string" },
  //     { name: "chainId", type: "uint256" },
  //     { name: "verifyingContract", type: "address" },
  // ];
  const dataType = [
    { name: "tokenId", type: "uint256" },
    { name: "star", type: "uint256" },
    { name: "fork", type: "uint256" },
    { name: "validUntil", type: "uint256" },
  ];

  const domainData = {
    name: "OSNFT",
    version: "1",
    chainId: await user.getChainId(),
    verifyingContract: this.nft.address.toLowerCase(),
  };
  const message = {
    tokenId,
    star,
    fork,
    validUntil: deadline,
  };

  const signatureResult = await user._signTypedData(
    domainData,
    {
      NFTMintData: dataType,
    },
    message
  );
  // recover

  return signatureResult;
}

export async function signMessageForRelayer(
  this: IDeployedPayload,
  user: SignerWithAddress,
  req: OSNFTRelayer.ForwardRequestStruct
) {
  const dataType = [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "validUntil", type: "uint256" },
    { name: "data", type: "bytes" },
  ];

  const domainData = {
    name: "OSNFT_RELAYER",
    version: "1",
    chainId: await user.getChainId(),
    verifyingContract: this.relayer.address.toLowerCase(),
  };

  const signatureResult = await user._signTypedData(
    domainData,
    {
      ForwardRequest: dataType,
    },
    req
  );
  // recover

  return signatureResult;
}

export function testMint(payload: IDeployedPayload) {
  const signMessage = signMessageForMint.bind(payload);

  it("expired signature", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) - 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 10;
    const signature = signMessage(
      payload.deployer,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const tx = nft.mintTo(tokenId, star, fork, 10, {
      signature,
      by: payload.operator.address,
      validUntil: timestamp,
    });

    await expect(tx).revertedWithCustomError(nft, "SignatureExpired");
  });

  it("by address not minters", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 10;
    const signature = signMessage(
      payload.signer4,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const tx = nft.connect(payload.signer4).mintTo(tokenId, star, fork, 10, {
      signature,
      by: payload.signer4.address,
      validUntil: timestamp,
    });

    await expect(tx).revertedWithCustomError(nft, "RequireVerifier");
  });

  it("minting invalid token", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects["mahal-webpack-loader"];
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 10;
    const signature = signMessage(
      payload.deployer,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const tx = nft.connect(payload.deployer).mintTo(tokenId, star, fork, 10, {
      signature,
      by: payload.deployer.address,
      validUntil: timestamp,
    });

    await expect(tx)
      .revertedWithCustomError(nft, "InvalidToken")
      .withArgs(tokenId);
  });

  it("Invalid signature", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 10;
    const signature = signMessage(
      payload.deployer,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const tx = nft.connect(payload.operator).mintTo(tokenId, star, fork, 10, {
      signature,
      by: payload.operator.address,
      validUntil: timestamp,
    });

    await expect(tx).revertedWithCustomError(nft, "InvalidSignature");
  });

  it("minting to creator", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 10;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const tx = nft.connect(payload.deployer).mintTo(tokenId, star, fork, 20, {
      signature,
      by: payload.operator.address,
      validUntil: timestamp,
    });

    await expect(tx).revertedWithCustomError(nft, "AlreadyMinted");
  });

  it("mint price", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 10;

    const projectInfo = await nft.getProject(tokenId);

    // mint price

    const expectedMintPrice = payload.mintPrice(star, fork, projectInfo);
    const mintPrice = await nft.mintPrice(tokenId, star, fork);

    expect(mintPrice).to.greaterThan(0);
    expect(mintPrice).to.equal(expectedMintPrice);

    console.log("expectedMintPrice", expectedMintPrice.toString());
  });

  it("mint jsstore success to signer2", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 5;
    const to = payload.signer2.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const projectInfoBefore = await nft.getProject(tokenId);
    const balanceOfCreatorBefore = await payload.erc20Token1.balanceOf(
      projectInfoBefore.creator
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer2)
      .approve(nft.address, ethers.constants.MaxUint256);

    const allowance = await payload.erc20Token1.allowance(to, nft.address);

    const balanceOfMinterBefore = await payload.erc20Token1.balanceOf(to);

    const royaltyGiven = 20;

    const tx = nft
      .connect(payload.signer2)
      .mintTo(tokenId, star, fork, royaltyGiven, {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      });

    // check for transfer events

    await expect(tx)
      .to.emit(nft, "TransferSingle")
      .withArgs(to, ethers.constants.AddressZero, to, tokenId, 1);

    const projectInfoAfter = await nft.getProject(tokenId);

    expect(projectInfoAfter.contributors).equal(2);
    const expectedMintPrice = payload.mintPrice(star, fork, projectInfoAfter);

    const expectedMintPriceBN = ethers.BigNumber.from(expectedMintPrice);

    const contractRoyalty = payload.getPercentage(expectedMintPriceBN, 10);

    // const minCreatorRoyalty = await projectInfoAfter.minCreatorRoyalty;

    const creatorRoyaltyValue = payload.getPercentage(
      ethers.BigNumber.from(expectedMintPrice),
      royaltyGiven
    );

    const amountForTreasury = expectedMintPriceBN
      .sub(contractRoyalty)
      .sub(creatorRoyaltyValue);

    expect(projectInfoAfter.treasuryAmount).equal(amountForTreasury);
    expect(projectInfoAfter.lastMintPrice).equal(expectedMintPrice);

    // nft balance of creator

    const balanceOfCreator = await nft.balanceOf(to, tokenId);
    expect(balanceOfCreator).equal(1);

    // check tokenmint

    expect(tx)
      .to.emit(nft, "TokenMinted")
      .withArgs(tokenId, to, star, fork, expectedMintPrice);

    // check contract earnings
    const contractEarning = await nft.getContractEarning(
      projectInfoAfter.paymentToken
    );
    expect(contractEarning).equal(contractRoyalty);

    //check creator earnings
    const balanceOfCreatorAfter = await payload.erc20Token1.balanceOf(
      projectInfoBefore.creator
    );
    expect(balanceOfCreatorAfter).equal(
      creatorRoyaltyValue.add(balanceOfCreatorBefore)
    );

    // check minters deducted balance
    const balanceOfMinterAfter = await payload.erc20Token1.balanceOf(to);
    expect(balanceOfMinterAfter).equal(
      balanceOfMinterBefore.sub(expectedMintPriceBN)
    );

    payload.transactions["mintNFTJsStore"].push((await tx).hash);
  });

  it("minting to a owner by invalid relayer", async () => {
    const nft = payload.nft;

    await payload.nft.setForwarder(payload.nftMeta.address);

    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 5;
    const to = payload.signer2.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      20,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer2.address,
      data: txData.data as string,
      value: 0,
      gas: 100000,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer2,
      req
    );

    const tx = payload.relayer.execute(req, signatureForRelayer);

    await expect(tx).revertedWith("ERC20: insufficient allowance");

    await payload.nft.setForwarder(payload.relayer.address);
  });

  it("minting to a owner by relayer", async () => {
    const nft = payload.nft;

    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 5;
    const to = payload.signer2.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // let ABI = new ethers.utils.Interface("");

    // const ct = await ethers.getContractFactory('OSNFT');
    // ct.interface.encodeFunctionData()

    // ; (await nft.populateTransaction.burn()).data

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      20,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    // txData.data;

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer2.address,
      data: txData.data as string,
      value: 0,
      gas: 100000,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer2,
      req
    );

    const tx = payload.relayer.execute(req, signatureForRelayer);

    // const tx = nft.connect(payload.signer2).mintTo(tokenId, star, fork, {
    //     signature, by: payload.operator.address, validUntil: timestamp
    // });

    // await expect(tx.).

    await expect(tx).revertedWithCustomError(nft, "AlreadyMinted");
  });

  it("minting to a owner", async () => {
    const nft = payload.nft;

    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 10;
    const fork = 5;
    const to = payload.signer2.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    const tx = nft.connect(payload.signer2).mintTo(tokenId, star, fork, 20, {
      signature,
      by: payload.operator.address,
      validUntil: timestamp,
    });

    // await expect(tx.).

    await expect(tx).revertedWithCustomError(nft, "AlreadyMinted");
  });

  it("mint jsstore to signer3 using relayer with less gas", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 50;
    const fork = 10;
    const to = payload.signer3.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer3)
      .approve(nft.address, ethers.constants.MaxUint256);

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      20,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer3.address,
      data: txData.data as string,
      value: 0,
      gas: 100,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer3,
      req
    );

    const tx = payload.relayer.execute(req, signatureForRelayer);

    expect(tx).to.revertedWithCustomError(payload.relayer, "RequestFailed");
  });

  it("mint jsstore to signer3 using relayer with different from", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 50;
    const fork = 10;
    const to = payload.signer3.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer3)
      .approve(nft.address, ethers.constants.MaxUint256);

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      15,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer3.address,
      data: txData.data as string,
      value: 0,
      gas: 100,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer3,
      req
    );

    req.from = payload.operator.address;

    const tx = payload.relayer.execute(req, signatureForRelayer);

    expect(tx).to.revertedWithCustomError(
      payload.relayer,
      "SignatureNotMatchRequest"
    );
  });

  it("mint jsstore to signer3 using relayer with different to", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 50;
    const fork = 10;
    const to = payload.signer3.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer3)
      .approve(nft.address, ethers.constants.MaxUint256);

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      10,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer3.address,
      data: txData.data as string,
      value: 0,
      gas: 100,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer3,
      req
    );
    req.to = payload.operator.address;

    const tx = payload.relayer.execute(req, signatureForRelayer);

    expect(tx).to.revertedWithCustomError(
      payload.relayer,
      "SignatureNotMatchRequest"
    );
  });

  it("mint jsstore to signer3 using relayer with different deadline", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 50;
    const fork = 10;
    const to = payload.signer3.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer3)
      .approve(nft.address, ethers.constants.MaxUint256);

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      10,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer3.address,
      data: txData.data as string,
      value: 0,
      gas: 100,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer3,
      req
    );
    req.validUntil = timestamp + 1000;

    const tx = payload.relayer.execute(req, signatureForRelayer);

    expect(tx).to.revertedWithCustomError(
      payload.relayer,
      "SignatureNotMatchRequest"
    );
  });

  it("mint jsstore to signer3 using relayer with different gas", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 50;
    const fork = 10;
    const to = payload.signer3.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer3)
      .approve(nft.address, ethers.constants.MaxUint256);

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      10,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer3.address,
      data: txData.data as string,
      value: 0,
      gas: 100,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer3,
      req
    );
    req.gas = 1000000000;

    const tx = payload.relayer.execute(req, signatureForRelayer);

    expect(tx).to.revertedWithCustomError(
      payload.relayer,
      "SignatureNotMatchRequest"
    );
  });

  it("mint jsstore success to signer3 using relayer", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 50;
    const fork = 10;
    const to = payload.signer3.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer3)
      .approve(nft.address, ethers.constants.MaxUint256);

    const allowance = await payload.erc20Token1.allowance(to, nft.address);

    const projectInfoBefore = await nft.getProject(tokenId);
    const contractEarningBefore = await nft.getContractEarning(
      projectInfoBefore.paymentToken
    );
    const balanceOfCreatorBefore = await payload.erc20Token1.balanceOf(
      projectInfoBefore.creator
    );

    const txData = await nft.populateTransaction.mintTo(
      tokenId,
      star,
      fork,
      projectInfoBefore.minCreatorRoyalty,
      {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      }
    );

    const req: OSNFTRelayer.ForwardRequestStruct = {
      from: payload.signer3.address,
      data: txData.data as string,
      value: 0,
      gas: 10000000,
      to: nft.address,
      validUntil: timestamp,
    };

    const signatureForRelayer = await signMessageForRelayer.call(
      payload,
      payload.signer3,
      req
    );

    const tx = payload.relayer.execute(req, signatureForRelayer);

    // check for transfer events

    await expect(tx)
      .to.emit(nft, "TransferSingle")
      .withArgs(to, ethers.constants.AddressZero, to, tokenId, 1);

    const projectInfoAfter = await nft.getProject(tokenId);

    expect(projectInfoAfter.contributors).equal(3);
    const expectedMintPrice = payload.mintPrice(star, fork, projectInfoAfter);

    const expectedMintPriceBN = ethers.BigNumber.from(expectedMintPrice);

    const contractRoyalty = payload.getPercentage(expectedMintPriceBN, 10);

    const minCreatorRoyalty = await projectInfoAfter.minCreatorRoyalty;

    const creatorRoyaltyValue = payload.getPercentage(
      ethers.BigNumber.from(expectedMintPrice),
      minCreatorRoyalty
    );

    const amountForTreasury = expectedMintPriceBN
      .sub(contractRoyalty)
      .sub(creatorRoyaltyValue);

    expect(projectInfoAfter.treasuryAmount).equal(
      amountForTreasury.add(projectInfoBefore.treasuryAmount)
    );
    expect(projectInfoAfter.lastMintPrice).equal(expectedMintPrice);

    // balance of creator

    const balanceOfCreator = await nft.balanceOf(to, tokenId);
    expect(balanceOfCreator).equal(1);

    // check tokenmint

    expect(tx)
      .to.emit(nft, "TokenMinted")
      .withArgs(tokenId, to, star, fork, expectedMintPrice);

    // check contract earnings
    const contractEarning = await nft.getContractEarning(
      projectInfoAfter.paymentToken
    );
    expect(contractEarning).equal(contractRoyalty.add(contractEarningBefore));

    //check creator earnings
    const balanceOfCreatorAfter = await payload.erc20Token1.balanceOf(
      projectInfoBefore.creator
    );
    expect(balanceOfCreatorAfter).equal(
      creatorRoyaltyValue.add(balanceOfCreatorBefore)
    );

    payload.transactions["mintNFTJsStore"].push((await tx).hash);
  });

  it("mint jsstore success to signer4 with less PF", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects.jsstore;
    const tokenId = payload.getProjectId(projectUrl);
    const star = 45;
    const fork = 10;
    const to = payload.signer4.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token1
      .connect(payload.signer4)
      .approve(nft.address, ethers.constants.MaxUint256);

    const allowance = await payload.erc20Token1.allowance(to, nft.address);

    const projectInfoBefore = await nft.getProject(tokenId);
    const contractEarningBefore = await nft.getContractEarning(
      projectInfoBefore.paymentToken
    );
    const balanceOfCreatorBefore = await payload.erc20Token1.balanceOf(
      projectInfoBefore.creator
    );

    const tx = nft
      .connect(payload.signer4)
      .mintTo(tokenId, star, fork, projectInfoBefore.minCreatorRoyalty, {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      });

    // check for transfer events

    await expect(tx)
      .to.emit(nft, "TransferSingle")
      .withArgs(to, ethers.constants.AddressZero, to, tokenId, 1);

    const projectInfoAfter = await nft.getProject(tokenId);

    expect(projectInfoAfter.contributors).equal(4);
    let expectedMintPrice = payload.mintPrice(star, fork, projectInfoAfter);
    expectedMintPrice =
      expectedMintPrice > projectInfoBefore.lastMintPrice
        ? expectedMintPrice
        : projectInfoBefore.lastMintPrice;

    const expectedMintPriceBN = ethers.BigNumber.from(expectedMintPrice);

    const contractRoyalty = payload.getPercentage(expectedMintPriceBN, 10);

    const minCreatorRoyalty = await projectInfoAfter.minCreatorRoyalty;

    const creatorRoyaltyValue = payload.getPercentage(
      ethers.BigNumber.from(expectedMintPrice),
      minCreatorRoyalty
    );

    const amountForTreasury = expectedMintPriceBN
      .sub(contractRoyalty)
      .sub(creatorRoyaltyValue);

    expect(projectInfoAfter.treasuryAmount).equal(
      amountForTreasury.add(projectInfoBefore.treasuryAmount)
    );
    expect(projectInfoAfter.lastMintPrice).equal(expectedMintPrice);

    // balance of creator

    const balanceOfCreator = await nft.balanceOf(to, tokenId);
    expect(balanceOfCreator).equal(1);

    // check tokenmint

    expect(tx)
      .to.emit(nft, "TokenMinted")
      .withArgs(tokenId, to, star, fork, expectedMintPrice);

    // check contract earnings
    const contractEarning = await nft.getContractEarning(
      projectInfoAfter.paymentToken
    );
    expect(contractEarning).equal(contractRoyalty.add(contractEarningBefore));

    //check creator earnings
    const balanceOfCreatorAfter = await payload.erc20Token1.balanceOf(
      projectInfoBefore.creator
    );
    expect(balanceOfCreatorAfter).equal(
      creatorRoyaltyValue.add(balanceOfCreatorBefore)
    );

    payload.transactions["mintNFTJsStore"].push((await tx).hash);
  });

  it("should revert if royalty paid is less than minRoyalty for the project", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects["jsstore-example"];
    const tokenId = payload.getProjectId(projectUrl);
    const star = 45;
    const fork = 10;
    const to = payload.signer4.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token2
      .connect(payload.signer4)
      .approve(nft.address, ethers.constants.MaxUint256);

    const projectInfoBefore = await nft.getProject(tokenId);
    const contractEarningBefore = await nft.getContractEarning(
      projectInfoBefore.paymentToken
    );
    const balanceOfCreatorBefore = await payload.erc20Token2.balanceOf(
      projectInfoBefore.creator
    );

    const tx = nft
      .connect(payload.signer4)
      .mintTo(tokenId, star, fork, projectInfoBefore.minCreatorRoyalty - 1, {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      });

    await expect(tx).to.be.revertedWithCustomError(nft, "InadequateRoyalty");
  });

  it("mint jsstore example success to signer4", async () => {
    const nft = payload.nft;
    const timestamp = (await time.latest()) + 1000;

    const projectUrl = payload.projects["jsstore-example"];
    const tokenId = payload.getProjectId(projectUrl);
    const star = 45;
    const fork = 10;
    const to = payload.signer4.address;
    const signature = signMessage(
      payload.operator,
      tokenId.toString(),
      star,
      fork,
      timestamp
    );

    // allow payment token
    await payload.erc20Token2
      .connect(payload.signer4)
      .approve(nft.address, ethers.constants.MaxUint256);

    const allowance = await payload.erc20Token2.allowance(to, nft.address);

    const projectInfoBefore = await nft.getProject(tokenId);
    const contractEarningBefore = await nft.getContractEarning(
      projectInfoBefore.paymentToken
    );
    const balanceOfCreatorBefore = await payload.erc20Token2.balanceOf(
      projectInfoBefore.creator
    );

    const tx = nft
      .connect(payload.signer4)
      .mintTo(tokenId, star, fork, projectInfoBefore.minCreatorRoyalty, {
        signature,
        by: payload.operator.address,
        validUntil: timestamp,
      });

    // check for transfer events

    await expect(tx)
      .to.emit(nft, "TransferSingle")
      .withArgs(to, ethers.constants.AddressZero, to, tokenId, 1);

    const projectInfoAfter = await nft.getProject(tokenId);

    expect(projectInfoAfter.contributors).equal(2);
    let expectedMintPrice = payload.mintPrice(star, fork, projectInfoAfter);
    expectedMintPrice =
      expectedMintPrice > projectInfoBefore.lastMintPrice
        ? expectedMintPrice
        : projectInfoBefore.lastMintPrice;

    const expectedMintPriceBN = ethers.BigNumber.from(expectedMintPrice);

    const contractRoyalty = payload.getPercentage(expectedMintPriceBN, 10);

    const minCreatorRoyalty = await projectInfoAfter.minCreatorRoyalty;

    const creatorRoyaltyValue = payload.getPercentage(
      ethers.BigNumber.from(expectedMintPrice),
      minCreatorRoyalty
    );

    const amountForTreasury = expectedMintPriceBN
      .sub(contractRoyalty)
      .sub(creatorRoyaltyValue);

    expect(projectInfoAfter.treasuryAmount).equal(
      amountForTreasury.add(projectInfoBefore.treasuryAmount)
    );
    expect(projectInfoAfter.lastMintPrice).equal(expectedMintPrice);

    // balance of creator
    const balanceOfCreator = await nft.balanceOf(to, tokenId);
    expect(balanceOfCreator).equal(1);

    // check token mint
    expect(tx)
      .to.emit(nft, "TokenMinted")
      .withArgs(tokenId, to, star, fork, expectedMintPrice);

    // check contract earnings
    const contractEarning = await nft.getContractEarning(
      projectInfoAfter.paymentToken
    );
    expect(contractEarning).equal(contractRoyalty.add(contractEarningBefore));

    //check creator earnings
    const balanceOfCreatorAfter = await payload.erc20Token2.balanceOf(
      projectInfoBefore.creator
    );
    expect(balanceOfCreatorAfter).equal(
      creatorRoyaltyValue.add(balanceOfCreatorBefore)
    );
  });
}

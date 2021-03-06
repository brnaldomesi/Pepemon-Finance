import {Deck, DeckFactory} from "../typechain";
import PepemonFactoryAbi from "../contracts/abi/PepemonFactory.json"
import {BigNumber} from "ethers";

const hre = require("hardhat");

async function main() {
    let cardOwnerAddress = "0x66a12b0086e0320f2e6e26c6ff93157c0c365cfb";

    const {ethers, network} = hre;

    const deckFactory = await ethers.getContractFactory("Deck") as DeckFactory;
    const deck = await deckFactory.deploy()

    await deck.setActionCardAddress("0xcb6768a968440187157cfe13b67cac82ef6cc5a4")
    await deck.setBattleCardAddress("0xcb6768a968440187157cfe13b67cac82ef6cc5a4")

    await network.provider.request({
        method: 'hardhat_impersonateAccount',
        params: [cardOwnerAddress],
    });

    let cardOwner = await ethers.provider.getSigner(cardOwnerAddress);

    const pepemonFactory = await ethers.getContractAt(
        PepemonFactoryAbi,
        "0xcb6768a968440187157cfe13b67cac82ef6cc5a4",
        cardOwner
    );

    await pepemonFactory.setApprovalForAll(deck.address, true)

    const cardOwnerAttachedDeck = deck.connect(cardOwner)

    await cardOwnerAttachedDeck.createDeck();

    console.log("-------------------------------------")
    console.log("            BATTLE CARDS")
    console.log("-------------------------------------")

    await pepemonFactory.balanceOf(cardOwnerAddress, 47).then((balance: BigNumber) => {
        console.log("Card owner has " + balance.toString() + " card(s) with ID 47");
    })

    console.log("Adding battle card with ID 47")
    await cardOwnerAttachedDeck.addBattleCard(1, 47)

    await cardOwnerAttachedDeck.getBattleCardForDeck(1).then((balance: BigNumber) => {
        console.log("Using battle card with id " + balance.toString());
    })

    await pepemonFactory.balanceOf(deck.address, 47).then((amount: BigNumber) => {
        console.log("Deck has " + amount.toString() + " card(s) with ID 47");
    })

    await pepemonFactory.balanceOf(cardOwnerAddress, 47).then((balance: BigNumber) => {
        console.log("Card owner has " + balance.toString() + " card(s) with ID 47");
    })

    console.log("-------------------------------------")
    console.log("            ACTION CARDS")
    console.log("-------------------------------------")

    await pepemonFactory.balanceOf(cardOwnerAddress, 29).then((balance: BigNumber) => {
        console.log("Card owner has " + balance.toString() + " card(s) with ID 29");
    })

    console.log("Adding action card(s) with ID 29")
    await cardOwnerAttachedDeck.addActionCards(1, [
        {actionCardTypeId: 29, amount: 1}
    ])

    await cardOwnerAttachedDeck.getCardTypesInDeck(1).then(cards => {
        console.log("Card types in deck", cards[0].toString())
    })

    await cardOwnerAttachedDeck.getCountOfCardTypeInDeck(1, 29).then((amount: BigNumber) => {
        console.log("Deck has " + amount.toString() + " card(s) with ID 29");
    })

    await pepemonFactory.balanceOf(cardOwnerAddress, 29).then((balance: BigNumber) => {
        console.log("Card owner has " + balance.toString() + " card(s) with ID 29");
    })

    console.log("Removing action card(s) with ID 29")
    await cardOwnerAttachedDeck.removeActionCards(1, [
        {actionCardTypeId: 29, amount: 1}
    ])


    await cardOwnerAttachedDeck.getCountOfCardTypeInDeck(1, 29).then((amount: BigNumber) => {
        console.log("Deck has " + amount.toString() + " card(s) with ID 29");
    })

    await pepemonFactory.balanceOf(cardOwnerAddress, 29).then((balance: BigNumber) => {
        console.log("Card owner has " + balance.toString() + " card(s) with ID 29");
    })
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
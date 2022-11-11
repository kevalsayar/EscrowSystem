const { contract } = require("./../config/blockchain.config");
const { DealTable } = require("./deal.queries");

contract.on("Funded", function (dealId, buyer_wallet_address, amount, deal_status) {
    DealTable.updateDealToFunded({
        id: dealId,
        buyer_wallet_address,
        amount,
        deal_status
    });
});

contract.on("Accepted", function (dealId, buyer_wallet_address, seller_wallet_address, deal_status) {
    DealTable.updateDealToAccepted({
        id: dealId,
        seller_wallet_address,
        deal_status
    });
});

contract.on("ReleaseFund", function (dealId, buyer_wallet_address, seller_wallet_address, deal_status, amount) {
    DealTable.updateDealToClosed({
        id: dealId,
        deal_status
    });
});
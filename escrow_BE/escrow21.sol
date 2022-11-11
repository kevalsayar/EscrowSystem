// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
contract EscrowV21 {
    address immutable OWNER;
    uint256 private minimumEscrowAmount = 1000000000000000;
    uint256 private commission = 2;
    enum DealStatus { INIT, FUNDED, ACCEPTED, RELEASED}
    struct DealInfo {
        bytes32 passcode;
        address payable buyer_address;
        address payable seller_address;
        uint256 amount;
        DealStatus status; 
    }
    mapping(string => DealInfo) Deals;
    // DealInfo [] Deals;
    constructor () {
        OWNER = msg.sender;
    }
    event Funded (string dealId, address indexed buyer, uint256 amount, DealStatus status);
    event Accepted (string _deal_id,address buyer_address, address seller_address, DealStatus status);
    event ReleaseFund (string _deal_id, address buyer_address, address seller_address, DealStatus status, uint256 amnount_released);
    modifier onlyOwner() {
        require(OWNER == msg.sender, "Only contract owner can call this method!");
        _;
    }
    modifier checkMsgSender (string memory _deal_id, address _seller_address) {
        require(_seller_address != Deals[_deal_id].buyer_address, "You can not accept deal created by you!");
        _;
    }
    modifier minimumAmount () {
        require(msg.value >= minimumEscrowAmount, "Very less escrow amount to fund the deal!");
        _;
    }
    modifier mustBeFunded (string memory _dealId) {
        require(Deals[_dealId].status == DealStatus.FUNDED, "Deal is not funded!");
        _;
    }
    modifier validatePasscode (string memory _deal_id, string memory passCode) {
        require(keccak256(abi.encodePacked(passCode)) == Deals[_deal_id].passcode, "Invalid deal passcode!");
        _;
    }
    /*
     * add fund for your deal.
     */
    function fundDeal (string memory _deal_id, address payable _buyer_address, string memory _passcode) 
    public payable minimumAmount() 
    {
        Deals[_deal_id] = DealInfo(
            keccak256(abi.encodePacked(_passcode)), 
            _buyer_address,
            payable(address(0)),
            msg.value,
            DealStatus.FUNDED
        );
        emit Funded(_deal_id, msg.sender, msg.value, DealStatus.FUNDED);
    }
    /*
     * accept deal by providing deal passcode
     */
    function acceptDeal (address payable _seller_address, string memory _deal_id, string memory pass_code) 
    public 
    checkMsgSender(_deal_id, _seller_address) 
    mustBeFunded(_deal_id) 
    validatePasscode(_deal_id, pass_code) 
    {
        Deals[_deal_id].seller_address = payable(msg.sender);
        Deals[_deal_id].status = DealStatus.ACCEPTED;
        emit Accepted(_deal_id, Deals[_deal_id].buyer_address, msg.sender, DealStatus.ACCEPTED);
    }
    function getMyDealById (string memory _dealId) 
    public view returns(DealInfo memory) {
        return Deals[_dealId];
    }
    function releaseFund (string memory _deal_id, string memory pass_code) public validatePasscode(_deal_id, pass_code)  {
        DealInfo memory myDeal = Deals[_deal_id];
        uint256 amount_to_transfer = myDeal.amount - ((myDeal.amount * commission) / 100);
        if(msg.sender == myDeal.buyer_address) {
            // if msg sender is buyer, transfer escrow amount to seller address
            myDeal.seller_address.transfer(amount_to_transfer);
        } else if (msg.sender == myDeal.seller_address) {            
            // if msg sender is seller, transfer escrow amount to buyer address
            myDeal.buyer_address.transfer(amount_to_transfer);
        }
        Deals[_deal_id].status = DealStatus.RELEASED;
        emit ReleaseFund (_deal_id, myDeal.buyer_address, myDeal.seller_address ,DealStatus.RELEASED, amount_to_transfer);
    }
    function setMinimumEscrowAmount (uint256 _amount) 
    public 
    onlyOwner {
        minimumEscrowAmount = _amount;
    }
    function validateUserForDeal (string memory deal_id, string memory passcode) public view returns(bool){
        if(Deals[deal_id].passcode == keccak256(abi.encodePacked(passcode))) {
            return true;
        }
        return false;
    }
}
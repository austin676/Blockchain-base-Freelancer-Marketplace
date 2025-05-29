// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Freelancer {
    address public owner;
    uint256 public nextPackageId = 1;

    struct Package {
        uint256 id;
        address freelancer;
        string title;
        string category;
        string image;
        uint256 cost;
    }

    struct Escrow {
        uint256 amount;
        bool exists;
    }

    mapping(uint256 => Package) public packages;
    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => address) public clients;

    event PackageHired(uint256 packageId, address client, uint256 amount);
    event PaymentApproved(uint256 packageId, address freelancer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;

        packages[1] = Package(
            1,
            0x04B56F34B5c55a7A3B37B7a4672BbAeD787657eb,
            "Web Development 2",
            "web-dev",
            "https://tinyurl.com/bdhky9fc", 
            1 ether
        );

        packages[2] = Package(
            2,
            0x17819B9a9144A9F4f19e706a4BA97f8032338D74,
            "Web Development-1",
            "web-dev",
            "https://tinyurl.com/bdhky9fc",
            0.5 ether
        );

        packages[3] = Package(
            3,
            0xA9905AA74AA0a3518b0De3DF52dc87cD9B58Ef5E,
            "Web Development",
            "web-dev",
            "https://tinyurl.com/bdhky9fc", 
            0.3 ether
        );

        nextPackageId = 4;
    }

    function hire(uint256 _id) public payable {
        Package memory package = packages[_id];
        require(package.freelancer != address(0), "Package does not exist");
        require(msg.value == package.cost, "Send the exact package cost");
        require(!escrows[_id].exists, "Package already hired");

        escrows[_id] = Escrow(msg.value, true);
        clients[_id] = msg.sender;

        emit PackageHired(_id, msg.sender, msg.value);
    }

    function approvePayment(uint256 _id) public {
        require(escrows[_id].exists, "No escrow exists for this package");
        require(msg.sender == clients[_id], "Only the client who hired this package can approve payment");

        Package memory package = packages[_id];
        uint256 amount = escrows[_id].amount;

        escrows[_id] = Escrow(0, false);
        payable(package.freelancer).transfer(amount);

        emit PaymentApproved(_id, package.freelancer, amount);
    }

    function getEscrowAmount(uint256 _id) public view returns (uint256) {
        return escrows[_id].amount;
    }
}
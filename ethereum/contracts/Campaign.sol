// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
    uint approvalCount;
    mapping(address => bool) approvals;
}

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign campaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(campaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager, "Action restricted to the manager!");
        _;
    }

    constructor(uint _minimumContribution, address _manager) {
        manager = _manager;
        minimumContribution = _minimumContribution;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution, "Value must be greater than or equal to minimum contribution.");
        require(!approvers[msg.sender], "You already contributed to this campaign.");
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string calldata description, uint value, address recipient) public restricted {
        Request storage request = requests.push();
        request.description = description;
        request.value = value;
        request.recipient = recipient;
    }

    function approveRequesg(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender], "Action restricted to approvers!");
        require(!request.approvals[msg.sender], "You already approved this request.");
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2), "Request didn't receive minimum approvals yet!");
        require(!request.complete, "Request is already complete!");
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}

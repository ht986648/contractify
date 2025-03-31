// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IPFSStorage {
    // Mapping from address to array of IPFS CIDs
    mapping(address => string[]) private userCids;
    
    // Event emitted when a new CID is added
    event CidAdded(address indexed user, string cid);
    
    // Function to add a new CID for the caller
    function addCid(string memory _cid) public {
        userCids[msg.sender].push(_cid);
        emit CidAdded(msg.sender, _cid);
    }
    
    // Function to get all CIDs for a specific user
    function getUserCids(address _user) public view returns (string[] memory) {
        return userCids[_user];
    }
    
    // Function to get the number of CIDs for a specific user
    function getUserCidCount(address _user) public view returns (uint256) {
        return userCids[_user].length;
    }
    
    // Function to get a specific CID by index for a user
    function getUserCidByIndex(address _user, uint256 _index) public view returns (string memory) {
        require(_index < userCids[_user].length, "Index out of bounds");
        return userCids[_user][_index];
    }
}
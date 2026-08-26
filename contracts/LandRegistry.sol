// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    struct LandParcel {
        uint256 id;
        string location;
        string geolocation; // PostGIS compatible representation or simple string
        address owner;
        bool isRegistered;
        uint256 timestamp;
    }

    mapping(uint256 => LandParcel) public parcels;
    uint256 public nextParcelId;

    event LandRegistered(uint256 indexed parcelId, address indexed owner, string location);
    event LandTransferred(uint256 indexed parcelId, address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner(uint256 _parcelId) {
        require(parcels[_parcelId].owner == msg.sender, "Not the owner");
        _;
    }

    function registerLand(string memory _location, string memory _geolocation) public {
        uint256 parcelId = nextParcelId++;
        parcels[parcelId] = LandParcel({
            id: parcelId,
            location: _location,
            geolocation: _geolocation,
            owner: msg.sender,
            isRegistered: true,
            timestamp: block.timestamp
        });

        emit LandRegistered(parcelId, msg.sender, _location);
    }

    function transferOwnership(uint256 _parcelId, address _newOwner) public onlyOwner(_parcelId) {
        address oldOwner = parcels[_parcelId].owner;
        parcels[_parcelId].owner = _newOwner;
        parcels[_parcelId].timestamp = block.timestamp;

        emit LandTransferred(_parcelId, oldOwner, _newOwner);
    }

    function getParcel(uint256 _parcelId) public view returns (LandParcel memory) {
        require(parcels[_parcelId].isRegistered, "Parcel not registered");
        return parcels[_parcelId];
    }
}

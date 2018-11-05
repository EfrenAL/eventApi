var _ = require('underscore');

exports.getVehicles = function (req, res) {

    console.log('\n******** Get All Vehicles ********');
    var list = [
        { id: 439670, latitude: 53.46036882190762, longitude: 9.909716434648558, fleetType: "SCOOTER", battery: 5 },
        { id: 739330, latitude: 53.668806556867445, longitude: 10.019908942943804, fleetType: "SCOOTER", battery: 98 },
        { id: 145228, latitude: 53.58500747958201, longitude: 9.807045083858156, fleetType: "SCOOTER", battery: 100 },

    ];
    res.json({vehicleList: list})
}
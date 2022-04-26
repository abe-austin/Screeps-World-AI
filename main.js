var SoldierManager = require('manager.soldier');
var WorkerManager = require('manager.worker');
var SpawnerManager = require('manager.spawner');
var RoomManager = require('manager.room');

module.exports.loop = function () 
{
    var rooms = RoomManager.Process();//check whether it works to just pass down RoomManager.owned_rooms
    SpawnerManager.Process(rooms);
    WorkerManager.Process(); 
    SoldierManager.Process();
}
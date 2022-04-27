var SoldierManager = require('manager.soldier');
var WorkerDirector = require('director.worker');
var SpawnerManager = require('manager.spawner');
var WorkerManager = require('manager.worker');
var RoomManager = require('manager.room');

module.exports.loop = function () 
{
    RoomManager.Process();

    RoomManager.PrintRooms(RoomManager.owned_rooms);

    WorkerManager.Process(); 
    SpawnerManager.Process();
    WorkerDirector.Process();
    SoldierManager.Process();
}
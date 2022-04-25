var SoldierManager = require('manager.soldier');
var WorkerManager = require('manager.worker');
var SpawnerManager = require('manager.spawner');
var RoomManager = require('manager.room');

module.exports.loop = function () 
{
    RoomManager.Process();
    SpawnerManager.Process();
    WorkerManager.Process(); 
    SoldierManager.Process();
}
var SoldierManager = require('manager.soldier');
var WorkerDirector = require('director.worker');
var SpawnerManager = require('manager.spawner');
var WorkerManager = require('manager.worker');
var RoomManager = require('manager.room');

module.exports.loop = function () 
{
    RoomManager.Process();
    //RoomManager.PrintRooms();

    WorkerManager.Process(); 
    //WorkerManager.PrintWorkerPool();
    
    SpawnerManager.Process();
    WorkerDirector.Process();
    SoldierManager.Process();
}

//TO RESET SERVER, RUN THIS IN CLI: system.resetAllData()
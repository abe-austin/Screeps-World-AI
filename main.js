var SoldierManager = require('manager.soldier');
var SpawnerManager = require('manager.spawner');
var WorkerManager = require('manager.worker');
var RoomManager = require('manager.room');

module.exports.loop = function () 
{
    //RoomManager.PrintRooms(); 
    //WorkerManager.PrintWorkerPool();
    
    //Room creates the room setup
    //Worker looks at the setup and creates working areas. For now just a harvester area, with quota defined by 
        //resource limits. From that quota it creates a number of entries for the spawner queue
        //each of those comes with a priority level. They also come with which area they are intended for. 
        //This queue is given to Spawn
    //Spawn takes the list from worker and distributes it across its current spawns, same as it does now
    //Worker then takes the generated creeps and reads what area they are for. In the case of our harvesting
        //each source has a delivery limit and each target has a drawing limit. It assigns them to the first 
        //source until the limit is reached, then sends new workers to the next. It assigns them in rotation to
        //the target limits, skipping over any that have already reached their limit.

    //When new facilities are created, when old workers die, and when predetermined levels are reached the Worker
    //Manager needs to re-evaluate, opening up new areas, creating new worker quotas, and improving old units.
    //Once a certain level is reached we would stop having predetermined levels and focus more on measuring key
    //indicators which tell us when one area of development is outstripping another and re-allocating resources
    //accordingly

    RoomManager.Process();
    WorkerManager.Process();
    SpawnerManager.Process();
    SoldierManager.Process();
}

//TO RESET SERVER, RUN THIS IN CLI: system.resetAllData()
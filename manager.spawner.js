var RoomManager = require('manager.room');
var WorkerManager = require('manager.worker');

var room_spawns = [];
var workerCounter = 0;

var SpawnerManager = 
{
    Process: function() 
    {
        var rooms = RoomManager.GetRooms();
        for(var i = 0; i < rooms.length; i++)
        {
            if(!room_spawns.find(roomSpawn => roomSpawn.room == rooms[i].name))
            {
                this.ParseRoomSpawns(rooms[i]);
            }
        }
        
        //this.PrintRoomSpawns();
            
        this.UpdateSpawnPool();
        this.ExecuteSpawnPool();
        //Get all of your spawners by room. Load from manager.room your resources
            //I assume I can programmatically create a new spawner? Or am I limited to just one? 
    },
    
    ParseRoomSpawns: function(roomData)
    {
        var room = Game.rooms[roomData.name];
        var roomSpawnGroup = { "room": room.name, "spawns": [], "spawn_queue": [] };
        var spawns = room.find(FIND_MY_SPAWNS);
        
        for(var i = 0; i < spawns.length; i++)
        {
            roomSpawnGroup.spawns.push(spawns[i].name);
        }
        
        roomSpawnGroup.spawn_queue = this.RetrieveSpawnQuota(roomData.name);
            
        room_spawns.push(roomSpawnGroup);
    },
    
    UpdateSpawnPool: function()
    {
        for(var i = 0; i < room_spawns.length; i++)
        {
            room_spawns[i].spawn_queue = this.RetrieveSpawnQuota(room_spawns[i].room);

            //Sort
            room_spawns[i].spawn_queue.sort((a, b) => { return b.priority - a.priority; });;
        }
    },

    RetrieveSpawnQuota: function(roomName)
    {
        var roomWorkerArea = WorkerManager.GetRoomWorkerAreas().find(x => x.room == roomName);
        return roomWorkerArea.spawn_quota;    
    },
    
    ExecuteSpawnPool: function()
    {
        //for each room...
        //next thing in the pool, check if any of the spawns can perform it. if so do it
        //the spawned item gets handed over to the worker or soldier director for orders
        for(var i = 0; i < room_spawns.length; i++)
        {
            if(room_spawns[i].spawn_queue.length > 0)
            {                
                for(var j = 0; j < room_spawns[i].spawns.length; j++)
                {
                    var spawner = room_spawns[i].spawns[j];
                    var spawner = Game.spawns[room_spawns[i].spawns[j]];
                    var nextSpawnItem = room_spawns[i].spawn_queue[0];
                    var spawnCost = this.CalculateCost(nextSpawnItem.configuration);

                    if(spawner.store.getUsedCapacity(RESOURCE_ENERGY) >= spawnCost)
                    {
                        var response = spawner.spawnCreep(nextSpawnItem.configuration, "Worker" + workerCounter, { memory: {"area": nextSpawnItem.area, assigned: false} });
                        workerCounter++;
                        if(response == OK)
                        {
                            room_spawns[i].spawn_queue.shift();//Will this also remove it from the workermanager's list? Test
                        }
                    }
                }
            }
            //else suicide an old worker so we can make a replacement?
        }
    },
    
    CalculateCost: function(components)
    {
        var cost = 0;
        for(var i = 0; i < components.length; i++)
        {
            if(components[i] == WORK)
            {
                cost += 100;
            }
            if(components[i] == MOVE)
            {
                cost += 50;
            }
            if(components[i] == CARRY)
            {
                cost += 50;
            }
            //and all the others...
        }
        return cost;
    }
};

module.exports = SpawnerManager;
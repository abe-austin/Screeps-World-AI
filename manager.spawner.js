var RoomManager = require('manager.room');
var WorkerManager = require('manager.worker');

var room_spawns = [];

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
            roomSpawnGroup.spawns.push(spawns[i]);
        }
        
        var roomQuota = WorkerManager.GetQuotas().filter(function(x) { return x.room == roomData.name; })[0];
        for(var i = 0; i < roomQuota.harvester_requirement.quota - roomQuota.harvester_requirement.count; i++)
        {
            roomSpawnGroup.spawn_queue.push({
                                                "type": "harvester", 
                                                "configuration": roomQuota.harvester_requirement.configuration, 
                                                "priority": roomQuota.harvester_requirement.priority
                                            });
        }
        
        room_spawns.push(roomSpawnGroup);
    },
    
    UpdateSpawnPool: function()
    {
        for(var i = 0; i < room_spawns.length; i++)
        {
            //Detect changes
            
            //Sort
            room_spawns[i].spawn_queue.sort((a, b) => { return b.priority - a.priority; });;
        }
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
                    var nextSpawnItem = room_spawns[i].spawn_queue[0];
                    var spawnCost = this.CalculateCost(nextSpawnItem.configuration);
                    if(spawner.store.getUsedCapacity(RESOURCE_ENERGY) >= spawnCost)
                    {
                        spawner.spawnCreep(nextSpawnItem.configuration, 'Harvester', { memory: {assigned: false, retrieveFrom: null, depositTo: null} });//make name
                        room_spawns[i].spawn_queue.shift();
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
    },
    
    PrintRoomSpawns: function()
    {
        for(var i = 0; i < room_spawns.length; i++)
        {
            console.log(room_spawns[i].room);
            console.log("   Spawns- " +  room_spawns[i].spawns.length);
            console.log("   Queue- ");
            for(var j = 0; j < room_spawns[i].spawn_queue.length; j++)
            {
                var spawn_queue_entry = room_spawns[i].spawn_queue[j];
                console.log("      Type- " + spawn_queue_entry.type);
                console.log("      Configuration- " + spawn_queue_entry.configuration);
                console.log("      Priority- " + spawn_queue_entry.priority);
            }
            console.log();
        }
        console.log(":::::::::::::::::::::::::::::::::::::::::");
    }
};

module.exports = SpawnerManager;
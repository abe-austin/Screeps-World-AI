var RoomManager = require('manager.room');

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
        
        this.UpdateSpawnPool();
        this.ExecuteSpawnPool();
        //Get all of your spawners by room. Load from manager.room your resources
            //I assume I can programmatically create a new spawner? Or am I limited to just one? 
    },
    
    ParseRoomSpawns: function(roomData)
    {
        var room = Game.rooms[roomData.name];
        var roomSpawnsStructure = { "room": room.name, "spawns": [] };
        var spawns = room.find(FIND_MY_SPAWNS);
        
        for(var i = 0; i < spawns.length; i++)
        {
            roomSpawnsStructure.spawns.push(spawns[i]);
        }
        
        room_spawns.push(roomSpawnsStructure);
    },
    
    UpdateSpawnPool: function()
    {
        //for each room...
        //re-evaluate worker and soldier quoras (taken from worker and soldier managers, updates over time)
        //if it has changed, compare to current state
        //add items to spawn pool to make up the difference
    },
    
    ExecuteSpawnPool: function()
    {
        //for each room...
        //next thing in the pool, check if any of the spawns can perform it. if so do it
        //the spawned item gets handed over to the worker or soldier director for orders
    }
};

module.exports = SpawnerManager;
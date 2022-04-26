var RoomManager = require('manager.room');

var room_spawns = [];

var SpawnerManager = 
{
    Process: function() 
    {
        RoomManager.PrintRooms(RoomManager.owned_rooms);
        
        var rooms = RoomManager.GetRooms();
        for(var i = 0; i < rooms.length; i++)
        {
            if(!room_spawns.find(roomSpawn => roomSpawn.room ==rooms[i].name))
            {
                this.ParseRoomSpawn(rooms[i]);
            }
        }
        
        
        //Get all of your spawners by room. Load from manager.room your resources
            //I assume I can programmatically create a new spawner? Or am I limited to just one? 
        //Update job pool
        //Execute next item on pool
    },
    
    ParseRoomSpawn: function()
    {
        
        //look at the number of mineable resources
        //add the spawns from the room
    }
};

module.exports = SpawnerManager;
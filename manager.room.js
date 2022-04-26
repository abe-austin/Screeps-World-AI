var owned_rooms = [];

var RoomManager = 
{
    Process: function() 
    {
        for(var i in Game.rooms)
        {
            if(Game.rooms[i].controller && Game.rooms[i].controller.my)//Possibly we still want to count it...perhaps there is no Controller object, but we still are managing it
            {
                if(!owned_rooms.find(room => room.name == Game.rooms[i].name))
                {
                    this.ParseRoom(Game.rooms[i].name);
                }
            }
        }
        return owned_rooms;
        //WE MAINTAIN A LIST OF ALL MANAGED ROOMS
        //EACH ROOM DETERMINES A QUOTA OF RESOURCE-MINERS AND DEFENDERS
        //THAT GETS PASSED ON TO THE SPAWNER INSIDE THE ROOM, SO IT CAN DETERMINE WHEN AND WHAT TO GENERATE
    },
    
    ParseRoom: function(roomName)
    {
        var room = Game.rooms[roomName];
        var roomStructure = { "name": roomName };
        roomStructure.resources = this.ParseRoomElements(room, FIND_SOURCES);
        roomStructure.minerals = this.ParseRoomElements(room, FIND_MINERALS);
        roomStructure.room_controller = this.ParseRoomElements(room, FIND_CONTROLLER);//check the actual room controller constant name
        //FUTURE ROOM ELEMENTS TO ADD
        owned_rooms.push(roomStructure);
    },
    
    ParseRoomElements: function(room, elementType)
    {
        var that = this;
        var resourceList = [];
        room.find(elementType)
            .forEach(function(source)
            {
                var accessiblePositionsNum = that.NumberOfAccessiblePositions(room, source.pos);
                resourceList.push({
                    "x": source.pos.x, 
                    "y": source.pos.y, 
                    "accessible_points": accessiblePositionsNum,
                    "dedicated_units": []
                });
            });
        return resourceList;
    },
    
    NumberOfAccessiblePositions: function(room, pos)
    {
        var count = 0;
        var terrain = room.getTerrain();
        for(var xShift = -1; xShift <= 1; xShift++)
        {
            for(var yShift = -1; yShift <= 1; yShift++)
            {
                if(xShift != 0 || yShift != 0)
                {
                    if(terrain.get(pos.x + xShift, pos.y + yShift) != TERRAIN_MASK_WALL)
                    {
                        count++;
                    }
                }
            }
        }
        return count;
    }
};

module.exports = RoomManager;
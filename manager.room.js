var owned_rooms = [];

var RoomManager = 
{
    GetRooms: function()
    {
        return owned_rooms;
    },
    
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
        //WE MAINTAIN A LIST OF ALL MANAGED ROOMS
        //EACH ROOM DETERMINES A QUOTA OF RESOURCE-MINERS AND DEFENDERS
        //THAT GETS PASSED ON TO THE SPAWNER INSIDE THE ROOM, SO IT CAN DETERMINE WHEN AND WHAT TO GENERATE
    },
    
    ParseRoom: function(roomName)
    {
        var room = Game.rooms[roomName];
        var roomStructure = { "name": roomName };
        roomStructure.resources = this.ParseRoomElements(room, FIND_SOURCES);
        //roomStructure.minerals = this.ParseRoomElements(room, FIND_MINERALS);//Worry about this later
        roomStructure.spawns = this.ParseRoomElements(room, FIND_MY_SPAWNS);
        roomStructure.room_controller = room.controller;
        //FUTURE ROOM ELEMENTS TO ADD
        
        owned_rooms.push(roomStructure);
    },
    
    ParseRoomElements: function(room, elementType)
    {
        var that = this;
        var resourceList = [];
        room.find(elementType)
            .forEach(function(element)
            {
                var accessiblePositionsNum = that.NumberOfAccessiblePositions(room, element.pos);
                resourceList.push({
                    "element": element,
                    "x": element.pos.x, 
                    "y": element.pos.y, 
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
    },
    
    PrintRooms: function()
    {
        for(var i = 0; i < owned_rooms.length; i++)
        {
            console.log(owned_rooms[i].name);
            console.log("RESOURCES");
            for(var j = 0; j < owned_rooms[i].resources.length; j++)
            {
                console.log("   " + owned_rooms[i].resources[j].x + "," + owned_rooms[i].resources[j].y + "    " + owned_rooms[i].resources[j].accessible_points);
            }
            
            // console.log("MINERALS");
            // for(var j = 0; j < owned_rooms[i].minerals.length; j++)
            // {
            //     console.log("   " + owned_rooms[i].minerals[j].x + "," + owned_rooms[i].minerals[j].y + "    " + owned_rooms[i].minerals[j].accessible_points);
            // }
            
            console.log("SPAWNS");
            for(var j = 0; j < owned_rooms[i].spawns.length; j++)
            {
                console.log("   " + owned_rooms[i].spawns[j].x + "," + owned_rooms[i].spawns[j].y + "    " + owned_rooms[i].spawns[j].accessible_points);
            }
            
            console.log("CONTROLLER");
            console.log("   " + owned_rooms[i].room_controller.pos.x + "," + owned_rooms[i].room_controller.pos.y)
            
            console.log();
        }
        console.log(":::::::::::::::::::::::::::::::::::::::::");
    }
    
};

module.exports = RoomManager;
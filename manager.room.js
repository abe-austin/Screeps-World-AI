var owned_rooms = 
    [
        {
            "name":"W7N2",
            "resources":
            [
                {
                    "x":25,
                    "y":14,
                    "type":"ENERGY",
                    "accessible_points":4
                }
            ]
        }
    ];

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
        
        //WE MAINTAIN A LIST OF ALL MANAGED ROOMS
        //EACH ROOM DETERMINES A QUOTA OF RESOURCE-MINERS AND DEFENDERS
        //THAT GETS PASSED ON TO THE SPAWNER INSIDE THE ROOM, SO IT CAN DETERMINE WHEN AND WHAT TO GENERATE
    },
    
    ParseRoom: function(name)
    {
        var room = Game.rooms[name];
        var roomStructure = {};
        var sources = room.find(FIND_SOURCES);
        var that = this;
        room.find(FIND_SOURCES)
            .forEach(function(source)
            {
                var accessiblePositionsNum = that.NumberOfAccessiblePositions(room, source.pos);
                console.log(source.pos.x + "," + source.pos.y + ":" + accessiblePositionsNum);
                //SET roomStructure AND ADD TO LIST OF ROOMS
                //ALSO RETRIEVE MINERALS ALONG WITH SOURCES
                //SEEMS LIKE MINERALS WILL COME INTO PLAY LATER, WHEN I HAVE A FEW TO COMBINE
                //SO FOR NOW PUT THEM IN THEIR OWN CATEGORY, ALONG WITH NUM OF ACCESSIBLE POSITIONS
                //BUT DON'T HAVE THEM AS PART OF THE QUOTA UNTIL LATER
            });
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
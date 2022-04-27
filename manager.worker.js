var RoomManager = require('manager.room');

var room_workers = [];

var WorkerManager = 
{ 
    Process: function() 
    {       
        var rooms = RoomManager.GetRooms();
        for(var i = 0; i < rooms.length; i++)
        {
            if(!room_workers.find(worker => worker.room == rooms[i].name))
            {
                this.ParseRoomWorkers(rooms[i]);
            }
        }
        
        this.UpdateWorkerQuotas();
    },

    ParseRoomWorkers: function()
    {
        //look at the room's elements comparative to level of development
            //for level 0, only checking for sources, spawners, and controllers
        //choose a number of workers to manage each element, add them to the quota
        //also track the current state of workers (initially none), and update it whenever the spawner hands someone over
        //turn that new worker over to the worker director for orders
    },

    UpdateWorkerQuotas()
    {

    }
};

module.exports = WorkerManager;

/*

	    if(creep.store.getFreeCapacity() > 0) 
	    {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else 
        {
            var targets = creep.room.find(FIND_STRUCTURES, 
            {
                    filter: (structure) => 
                    {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) 
            {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
*/
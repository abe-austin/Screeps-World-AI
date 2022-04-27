var RoomManager = require('manager.room');

var worker_pool = 
[
    //The spawner is pulling from this pool AND the soldier one. It is having to determine the correct priority of each, and update that priorityQueue as the situation changes
    //And I don't really want to be deciding right here where each worker goes. It is implied, but all I really want is to create a number of workers needed, and what type
    //Then it is up to director.worker to actually tell them where they are going.
    //So I don't want structure here to divide the pool across different sources
    //I just want...I need five miners and three builders of the following configurations
    
    //For every source and mineral I want X+1 miners, where X is the number of accessible points
    //Later on I'll want builders as well, who are not tied to a set number of structures, but who we gradually want more and more of to handle just whatever new jobs come up. But I'll worry about that when I get to it
    
    //As for the destination of each miner (spawner or controller) I don't need to worry about that here. That's the director's job
];

var worker_levels = 
{
    "0" : 
    {
        "testVal": "hi",
        "harvester_configuration": {"move": 1, "work": 1, "carry": 1}
    },
    "1" : 
    { 
        "harvester_configuration": {"move": 1, "work": 1, "carry": 1}
    },
};

var current_worker_level = "0";

var WorkerManager = 
{ 
    Process: function() 
    {       
        var rooms = RoomManager.GetRooms();
        for(var i = 0; i < rooms.length; i++)
        {
            if(!worker_pool.find(pool => pool.room == rooms[i].name))
            {
                this.ParseRoomWorkers(rooms[i]);
            }
        }
        
        this.UpdateWorkerQuotas();
    },

    ParseRoomWorkers: function(room)
    {
        var harvesterQuota = 0;
        for(var i = 0; i < room.resources.length; i++)
        {
            harvesterQuota += room.resources[i].accessible_points;
        }
        for(var i = 0; i < room.minerals.length; i++)
        {
            harvesterQuota += room.minerals[i].accessible_points;
        }
        worker_pool.push({
                            "room": room.name, 
                            "harvester_requirement": 
                            { 
                                "count": harvesterQuota,
                                "configuration": worker_levels[current_worker_level].harvester_configuration
                            }
        });
        
        //look at the room's elements comparative to level of development
            //for level 0, only checking for sources, spawners, and controllers
        //choose a number of workers to manage each element, add them to the quota
        //also track the current state of workers (initially none), and update it whenever the spawner hands someone over
        //turn that new worker over to the worker director for orders
    },

    UpdateWorkerQuotas(sources)
    {

    },
    
    PrintWorkerPool: function()
    {
        console.log("??????????????????" + worker_levels["0"].testVal);
        for(var i = 0; i < worker_pool.length; i++)
        {
            console.log(worker_pool[0].room);
            console.log("HARVESTER REQUIREMENT");
            console.log("   Count- " +  worker_pool[i].harvester_requirement.count);
            console.log("   Configuration- " +  worker_levels[current_worker_level].configuration);
            console.log();
        }
        console.log(":::::::::::::::::::::::::::::::::::::::::");
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
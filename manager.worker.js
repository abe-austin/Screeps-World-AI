var RoomManager = require('manager.room');

var worker_quota = 
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
        "harvester_configuration": [WORK, MOVE, CARRY]
    },
    "1" : 
    { 
        "harvester_configuration":  [WORK, MOVE, CARRY]
    },
};

var current_worker_level = "0";

var WorkerManager = 
{ 
    GetQuotas: function()
    {
        return worker_quota;
    },
    
    Process: function() 
    {       
        var rooms = RoomManager.GetRooms();
        for(var i = 0; i < rooms.length; i++)
        {
            if(!worker_quota.find(pool => pool.room == rooms[i].name))
            {
                this.ParseRoomWorkers(rooms[i]);
            }
        }
        
        //Update existing quotas;
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
        
        worker_quota.push({
                            "room": room.name, 
                            "harvester_requirement": 
                            { 
                                "count": 0,
                                "quota": harvesterQuota,
                                "configuration": worker_levels[current_worker_level].harvester_configuration,
                                "priority": 5//Some logic to actually evaluate what this should be
                            }
                        });
        
        //look at the room's elements comparative to level of development
            //for level 0, only checking for sources, spawners, and controllers
        //choose a number of workers to manage each element, add them to the quota
        //also track the current state of workers (initially none), and update it whenever the spawner hands someone over
        //turn that new worker over to the worker director for orders
    },
    
    PrintWorkerPool: function()
    {
        for(var i = 0; i < worker_quota.length; i++)
        {
            console.log(worker_quota[0].room);
            console.log("HARVESTER REQUIREMENT");
            console.log("   Count- " +  worker_quota[i].harvester_requirement.count);
            console.log("   Quota- " +  worker_quota[i].harvester_requirement.quota);
            console.log("   Configuration- " +  worker_quota[i].harvester_requirement.configuration);
            console.log("   Priority- " +  worker_quota[i].harvester_requirement.priority);
            console.log();
        }
        console.log(":::::::::::::::::::::::::::::::::::::::::");
    }
};

module.exports = WorkerManager;
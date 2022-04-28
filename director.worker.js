var RoomManager = require('manager.room');

var room_jobs = [];

var WorkerDirector = 
{
    Process: function() 
    {
        var rooms = RoomManager.GetRooms();
        for(var i = 0; i < rooms.length; i++)
        {
            if(!room_jobs.find(roomJobs => roomJobs.room == rooms[i].name))
            {
                this.ParseRoomJobs(rooms[i]);
            }
        }
        //per room, build out a list of jobs for workers to do.
    },

    ParseRoomJobs(room)
    {
        var roomJobs = {"room" : room.name, job_pool: []};
        this.ParseRoomSources(room.resources, roomJobs.job_pool);
        this.ParseRoomSources(room.minerals, roomJobs.job_pool, -1);//-1 because want energy before minerals
        //Technically, though, don't want to harvest minerals until a builder has been created and made a place to drop off the mined resources
        //So maybe a job pool has priority, but also is divided into a list of Can-Do-Now jobs and Dependent-On-Prerequisite jobs. On each cycle see if the
        //prerequisites are now met, in which case pull it over the Can-Do-Now list

        this.ParseRoomTargets(room.spawns, room.room_controller, roomJobs.job_pool.filter(job => job.retrieveFrom.energyCapacity > 0));//to ensure it is an energy pool...not entirely sure if this works

        //We will have sources of energy/minerals and destinations for those to go to
        //We will also need jobs for building

        //room.spawns
        //room.room_controller
    },

    ParseRoomSources(sources, job_pool, priorityShift)
    {
        for(var i = 0; i < sources.length; i++)
        {
            var harvesterCount = sources[i].accessible_points + 1;
            for(var j = 0; j < harvesterCount; j++)
            {
                var jobEntry = {"type": "harvester", "priority": 5 + priorityShift, "retrieveFrom": sources[i].element, depositTo: null};
                job_pool.push(jobEntry);
            }
        }
    },

    ParseRoomTargets(spawns, controller, job_pool)
    {
        //spawn1
        //controller
        //spawn2

        //7 workers

        //3 to spawn1
        //3 to spawn2
        //1 to controller

        //spawn1
        //controller
        //spawn2
        //spawn1
        //spawn2
        //spawn1
        //spawn2
        
        //ALL THE BELOW IS MESSY AND YOU CAN GET RID OF WHATEVER YOU NEED. JUST GET IT TO DO THE PATTERN SHOWN ABOVE. ALTERNATE BETWEEN ALL THE SPAWNERS, BUT INTERRUPT AFTER THE FIRST SPAWNER TO DO THE CONTROLLER
        //THOUGH HONESTLY...NOT THAT IMPORTANT. THE SPAWNER WILL REGENERATE ENERGY FASTER THAN THESE INITIAL WORKERS WILL MAKE A DIFFERENCE PROBABLY. COULD JUST DO THE CONTROLLER FIRST THEN ALTERNATE THE RESET BETWEEN THE SPAWNS

        //So rather than creating a new job, we want to look at the currently existing jobs that are harvesting from energy and don't yet have a depositTo. Fill out those jobs as now pointing to these items
        var targets = [];
        if(spawns.length > 0)
        {
            targets.push(spawns[0]);
        }
        if(controller != null)
        {
            targets.push(controller);
        }
        //prioritize one spawn being taken care of, then one controller, then the rest go to the spawn
        if(spawns.length > 1)
        {
            for(var i = 1; i < spawns.length; i++)
            {
                targets.push(spawns[i]);
            }
        }

        var targetIndex = 0;
        for(var i = 0; i < job_pool.length; i++)
        {
            job_pool[i].depositTo = targets[targetIndex];//this will put them in spawn1, controller, spawn1, controller, spawn1, controller
            targetIndex = (targetIndex + 1) % targets.length;
        }
    }


    //Process the list of 
};

module.exports = WorkerDirector;
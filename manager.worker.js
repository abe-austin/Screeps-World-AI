var RoomManager = require('manager.room');

var room_worker_areas = 
[
    //Later on I'll want builders as well, who are not tied to a set number of structures, 
    //but who we gradually want more and more of to handle just whatever new jobs come up.
    //But I'll worry about that when I get to it
];

var area_id = 0;

var worker_levels = 
{
    "0" : 
    {
        "harvester_configuration": [WORK, MOVE, CARRY]//Eventually want these to be configured by spawner budget, and programmatically building the best unit affordable
    },
    "1" : 
    { 
        "harvester_configuration":  [WORK, MOVE, CARRY]
    },
};

var current_worker_level = "0";

var WorkerManager = 
{ 
    GetRoomWorkerAreas: function()
    {
        return room_worker_areas;
    },
    
    Process: function() 
    {       
        var rooms = RoomManager.GetRooms();
        for(var i = 0; i < rooms.length; i++)
        {
            var room_worker_area = room_worker_areas.find(workerArea => workerArea.room == rooms[i].name); 
            if(!room_worker_area)
            {
                room_worker_area = this.ParseRoomWorkAreas(rooms[i]);
            }
            this.UpdateSpawnQuotas(room_worker_area);
            this.DetectNewWorkers(rooms[i]);
            this.ExecuteWorkerActions(rooms[i]);
        }
    },

    ParseRoomWorkAreas: function(room)
    {
        var roomWorkerAreaCollection = { "room": room.name, "areas": [], "spawn_quotas": [], "harvesters": [] };
        var harvestingArea = this.ParseHarvestingQuota(room);
        roomWorkerAreaCollection.areas.push(harvestingArea);
        room_worker_areas.push(roomWorkerAreaCollection);
        return roomWorkerAreaCollection;
        //Build out other areas
    },

    ParseHarvestingQuota: function(room)
    {
        var area = {"id": area_id};
        area.sources = this.ParseHarvestSources(room);
        area.targets = this.ParseHarvestTargets(room);
        area.next_target = 0;

        area_id++;
        var quota = 0;
        for(var i = 0; i < room.resources.length; i++)
        {
            quota += room.resources[i].accessible_points;
        }
        //Add minerals later

        area.role = "harvesting";
        area.quota = quota;
        area.priority = 5;//Set this in a clever way later
        area.current_workers = 0;
        area.configuration = worker_levels[current_worker_level].harvester_configuration;
        return area;
    },

    ParseHarvestSources: function(room)
    {
        var sources = [];
        for(var i = 0; i < room.resources.length; i++)
        {
            var resource = room.resources[i];
            var source = {
                            "type": "energy", 
                            "element": resource.element, 
                            "limit": resource.accessible_points,
                            "active": 0
                        };
            sources.push(source);
        }
        //do the same for minerals later
        return sources;
    },

    ParseHarvestTargets: function(room)
    {
        var targets = [];
        for(var i = 0; i < room.spawns.length; i++)
        {
            var target = {
                            "type": "spawner", 
                            "element": room.spawns[i].element, 
                            "limit": -1,
                            "active": 0
                        };
            targets.push(target);
        }
        targets.push({
                        "type": "controller", 
                        "element": room.controller, 
                        "limit": 1,
                        "active": 0
                    });
        return targets;
    },

    UpdateSpawnQuotas: function(roomWorkerArea)
    {       
        for(var i = 0; i < roomWorkerArea.areas.length; i++)
        {
            var area = roomWorkerArea.areas[i];
            var existingAreaQuota = roomWorkerArea.spawn_quotas.filter(x => x.area = area.id);
            for(var j = 0; j < area.quota - existingAreaQuota.length; j++)
            {
                roomWorkerArea.spawn_quotas.push({
                                                    "area": area.id, 
                                                    "configuration": area.configuration, 
                                                    "priorty": area.priority
                                                });
            }
        }
    },

    DetectNewWorkers: function(room)
    {
        var roomWorkerAreas = room_worker_areas.find(workerArea => workerArea.room == room.name);
        var areaIds = roomWorkerAreas.areas.map(x => x.id);
        var room = Game.rooms[room.name];
        var newWorkers = room.find(FIND_MY_SPAWNS).filter(x => areaIds.includes(x.memory.area) && !x.memory.assigned);
        if(newWorkers && newWorkers.length > 0)
        {
            this.AssignWorkers(newWorkers, roomWorkerAreas);
        }
    },

    AssignWorkers: function(workers, areas)
    {
        for(var i = 0; i < workers.length; i++)
        {
            var worker = workers[i];
            var area = areas.find(x => x.id == worker.memory.area);
            if(area.role == "harvesting")
            {         
                var source = area.sources.find(x => x.active < x.limit);
                var target = area.targets[area.next_target];
                if(source != undefined && target != undefined)
                {
                    worker.memory.source = source.element;
                    worker.memory.target = target.element;
                    source.active++;
                    worker.memory.assigned = true;
                    this.SetNextAvailableTarget();
                }
                //else something went really wrong
                
                //add it to a list of active harvesters who will execute their logic each tick
                areas.harvesters.push(worker);
            }
            area.current_workers++;
        }
    },

    SetNextAvailableTarget: function(area)
    {
        var targetFound = false;
        while(!targetFound)
        {
            area.next_target = (area.next_target + 1) % area.targets.length;
            var target = area.targets[area.next_target];
            if(target.active < target.limit || target.limit == -1)
            {
                targetFound = true;
            }
        }
    },

    ExecuteWorkerActions: function(room)
    {
        var roomWorkerAreas = roomWorkerAreas.find(workerArea => workerArea.room == room.name);
        for(var i = 0; i < roomWorkerAreas.harvesters.length; i++)
        {
            this.ExecuteHarvesterAction(roomWorkerAreas.harvesters[i]);
        }
    },

    ExecuteHarvesterAction: function(harvester)
    {
        
    },
    
    PrintWorkerPool: function()
    {
    }
};

module.exports = WorkerManager;
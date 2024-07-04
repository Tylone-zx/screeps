import { ROLE_UPGRADER } from "creepfather";
import { taskHarvest } from "task.harvest";
import { updateSourceIdx } from "helper";
import { ROLE_HAVESTER } from "creepfather";
import { taskWithdraw } from "task.withdraw";

export const taskUpgrade = {
  name: "upgrade",
  run: function (creep: Creep): boolean {
    if (creep.room.find(FIND_FLAGS).length > 0) {
      let fs = creep.room.find(FIND_FLAGS);
      let targetFlag = fs.filter(f => f.name.startsWith(ROLE_UPGRADER))[0];
      creep.moveTo(targetFlag);
      return true;
    }

    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading) {
      creep.upgradeController(creep.room.controller as StructureController);
      creep.moveTo(creep.room.controller as StructureController, { visualizePathStyle: { stroke: "#ffffff" } });
    } else {
      return taskWithdraw.run(creep);
    }
    return true;
  },

  doHarvest: function (creep: Creep): boolean {
    let sources = creep.room.find(FIND_SOURCES);

    if (sources.length == 0) {
      return false;
    }

    let avaliableSources = sources.filter(s => {
      return s.energy > 0;
    });

    let sourceIdx = creep.memory.sourceIdx;
    if (creep.store.getFreeCapacity() > 0) {
      if (avaliableSources.length == 0) {
        return false;
      }

      const code = creep.harvest(sources[sourceIdx]);
      if (code == OK) {
        return true;
      }
      if (code == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[sourceIdx], { visualizePathStyle: { stroke: "#ffaa00" } });
        updateSourceIdx(creep, sources);
        return true;
      }
      updateSourceIdx(creep, sources);
    }
    return false;
  }
};

export const taskTransfer = {
  name: "transfer",
  run: function (creep: Creep): boolean {
    let resourceType = RESOURCE_ENERGY;

    let p0target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
          structure.store.getFreeCapacity(resourceType) > 0
        );
      }
    });

    let p1target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        return structure.structureType == STRUCTURE_STORAGE && structure.store.getFreeCapacity(resourceType) > 0;
      }
    });

    let sourceTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(resourceType) > 150;
      }
    });

    if (p1target && !p0target && !sourceTarget) {
      return false;
    }

    let aroundTarget = creep.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: structure => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
          structure.store.getFreeCapacity(resourceType) > 0
        );
      }
    });

    let target = p0target ? p0target : p1target;
    if (!target) {
      return false;
    }

    if (creep.store.getUsedCapacity() == 0) {
      creep.memory.transfering = false;
    }

    if (creep.memory.transfering) {
      let code = creep.transfer(target, resourceType);
      for (let i of aroundTarget) {
        creep.transfer(i, resourceType);
      }
      if (code == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        return true;
      }
      if (code == OK) {
        return true;
      }
      return false;
    }

    if (p0target) {
      sourceTarget = sourceTarget ? sourceTarget : p1target;
      if (sourceTarget && p1target) {
        let dis1 = creep.pos.getRangeTo(sourceTarget.pos.x, sourceTarget.pos.y);
        let dis2 = creep.pos.getRangeTo(p1target.pos.x, p1target.pos.y);
        if (dis2 < dis1) {
          sourceTarget = p1target;
        }
      }
    }

    if (sourceTarget && creep.withdraw(sourceTarget, resourceType) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sourceTarget, { visualizePathStyle: { stroke: "#ffffff" } });
      return true;
    }

    if (creep.store.getFreeCapacity() == 0 || (creep.store.getUsedCapacity() > 0 && !sourceTarget)) {
      creep.memory.transfering = true;
      return true;
    }

    return false;
  }
};

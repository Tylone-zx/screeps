export const tower = {
  run: function (structure: StructureTower): boolean {
    if (structure.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      return false;
    }
    let enemies = structure.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
      filter: creep => {
        return creep.owner.username != structure.owner.username;
      }
    });
    if (!enemies) {
      return false;
    }
    console.log(`attack ${enemies} enemies`);
    structure.attack(enemies);
    return true;
  }
};

export const towersRun = function () {
  for (const twrIdx in Object.values(Game.structures)) {
    let stc = Object.values(Game.structures)[twrIdx];
    if (stc.structureType == STRUCTURE_TOWER) {
      let twr = stc as StructureTower;
      console.log(`tower[${twr.pos.x},${twr.pos.y}] run, energy: ${twr.store.getUsedCapacity(RESOURCE_ENERGY)}`);
      tower.run(twr);
    }
  }
};

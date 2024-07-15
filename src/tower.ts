export const tower = {
  run: function (tower: StructureTower): boolean {
    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      return false;
    }
    let enemies = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
      filter: creep => {
        return creep.owner.username != tower.owner.username;
      }
    });
    if (!enemies) {
      let walls = tower.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: wall => {
          return wall.structureType == STRUCTURE_WALL &&
          wall.room.name == tower.room.name &&
          wall.hits < Math.ceil(wall.hitsMax / 2);
        }
      });
      if (walls){
        console.log(`repair ${walls} walls`);
        tower.repair(walls);
      }
      return true;
    }
    console.log(`attack ${enemies} enemies`);
    tower.attack(enemies);
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

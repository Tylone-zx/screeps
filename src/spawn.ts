import {
  creepFather,
  CreepRoleType,
  ROLE_ATTACKER,
  ROLE_BUILDER,
  ROLE_HAVESTER,
  ROLE_MISCER,
  ROLE_MOVER,
  ROLE_UPGRADER,
  RoleBodyParts
} from "creepfather";
import { getTypeOfCreeps } from "helper";

type CreepSchedule = {
  role: CreepRoleType;
  limit: number;
  condition?: (spawnName: string) => boolean;
  bodyGenerator: () => BodyPartConstant[];
};

const bornCreepSchedule: CreepSchedule[] = [
  {
    role: ROLE_ATTACKER,
    limit: 2,
    bodyGenerator: () => {
      if (getTypeOfCreeps(ROLE_ATTACKER).length == 0) {
        return [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
      }
      return RoleBodyParts[ROLE_ATTACKER];
    },
    condition: (spawnName: string): boolean => {
      return Game.spawns[spawnName].room.find(FIND_HOSTILE_CREEPS).length > 0;
    }
  },
  { role: ROLE_HAVESTER, limit: 2, bodyGenerator: () => RoleBodyParts[ROLE_HAVESTER] },
  { role: ROLE_UPGRADER, limit: 1, bodyGenerator: () => RoleBodyParts[ROLE_UPGRADER] },
  { role: ROLE_MISCER, limit: 3, bodyGenerator: () => RoleBodyParts[ROLE_MISCER] },
  { role: ROLE_BUILDER, limit: 2, bodyGenerator: () => RoleBodyParts[ROLE_BUILDER] },
  { role: ROLE_MOVER, limit: 2, bodyGenerator: () => RoleBodyParts[ROLE_MOVER] }
];

const buildEnergyLimit = 300;

export const spawner = {
  run: (name: string) => {
    if (Game.spawns[name].spawning != null) {
      const spawningCreep = Game.creeps[(Game.spawns[name].spawning as Spawning).name];
      Game.spawns[name].room.visual.text(
        "🛠️" + spawningCreep.memory.role,
        Game.spawns[name].pos.x + 1,
        Game.spawns[name].pos.y,
        { align: "left", opacity: 0.8 }
      );
      return;
    } else if (Game.spawns[name].room.energyAvailable < buildEnergyLimit) {
      console.log(
        `Not enough energy to spawn new creep, now: ${Game.spawns[name].room.energyAvailable} need: ${buildEnergyLimit}`
      );
      return;
    } else {
      console.log(`can Spawning new creep, now: ${Game.spawns[name].room.energyAvailable} need: ${buildEnergyLimit}`);
    }

    bornCreepScheduler(name);
  }
};

const bornCreepLimit = function (
  spawnName: string,
  creepLimit: number,
  role: string,
  bodyParts: BodyPartConstant[]
): boolean {
  let numOfCreepType = Object.keys(Game.creeps).filter(name => name.startsWith(role)).length;
  if (numOfCreepType < creepLimit) {
    creepFather.born(Game.spawns[spawnName], role, bodyParts);
    return true;
  }
  return false;
};

const bornCreepScheduler = function (spawnName: string) {
  for (const item of bornCreepSchedule) {
    if (item.condition && !item.condition(spawnName)) {
      continue;
    }
    if (bornCreepLimit(spawnName, item.limit, item.role, item.bodyGenerator())) {
      return;
    }
  }
};

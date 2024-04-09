const mineflayer = require("mineflayer");
const say = require("say");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
const playSound = require("play-sound")();
const inventoryViewer = require("mineflayer-web-inventory");
const options = require("./options");
const { autototem } = require("mineflayer-auto-totem");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const GoalBlock = goals.GoalBlock;
const pvp = require('mineflayer-pvp').plugin
const armorManager = require('mineflayer-armor-manager') 
const {friends} = require("./friends") 



const DIVERS4NT = mineflayer.createBot(options);


DIVERS4NT.loadPlugin(autototem);
DIVERS4NT.loadPlugin(pathfinder);
DIVERS4NT.loadPlugin(pvp);
DIVERS4NT.loadPlugin(armorManager);

DIVERS4NT.once("login", async () => {
  mineflayerViewer(DIVERS4NT, {
    port: 3001,
    firstPerson: true,
    viewDistance: "20",
  });
  //inventoryViewer(DIVERS4NT);
  console.log("DIVERS4NT успешно проник на сервер.");
  await DIVERS4NT.chat(`/l ${options.password}`);
  console.log("DIVERS4NT успешно наебал сервер.");
  await DIVERS4NT.activateItem();
});

let counter = 0;
const bed = null;

DIVERS4NT.on("windowOpen", async () => {
  try {
    switch (counter) {
      //ОТКРЫТО МЕНЮ ВЫБОРА ЛОББИ
      case 0:
        console.log(1);
        await DIVERS4NT.clickWindow(8, 0, 0);
        counter++;
        break;
      //ОТКРЫТО МЕНЮ ВЫБОРА МИНИИГР
      case 1:
        async function runTimeouts() {
          console.log(2);

          await new Promise((resolve) =>
            setTimeout(async () => {
              await DIVERS4NT.clickWindow(11, 0, 0);
              resolve();
            }, 1000)
          );

          await new Promise((resolve) =>
            setTimeout(async () => {
              await DIVERS4NT.setQuickBarSlot(2);
              resolve();
            }, 1000)
          );

          await new Promise((resolve) =>
            setTimeout(async () => {
              await DIVERS4NT.activateItem();
              counter++;
              resolve();
            }, 1000)
          );
        }
        runTimeouts();
        break;
      //ОТКРЫТО МЕНЮ ВЫБОРА РЕЖИМА BedWars
      case 2:
        console.log(3);
        await new Promise((resolve) =>
          setTimeout(async () => {
            await DIVERS4NT.clickWindow(13, 0, 0);
            counter++;
            resolve();
          }, 1000)
        );
        break;
      //ОТКРЫТО МЕНЮ ВЫБОРА АРЕНЫ BedWars
      case 3:
        playSound.play("./sounds/Divers4nt_came.wav");
        await new Promise((resolve) =>
          setTimeout(async () => {
            await DIVERS4NT.clickWindow(13, 0, 0);
            await new Promise((resolve) =>
              setTimeout(async () => {
                await DIVERS4NT.setQuickBarSlot(0);
                resolve();
              }, 2000)
            );

            await new Promise((resolve) =>
              setTimeout(async () => {
                await DIVERS4NT.activateItem();
                resolve();
              }, 2000)
            );

            counter++;
            resolve();
          }, 1000)
        );
        break;
      //ОТКРЫТО МЕНЮ ВЫБОРА КОМАНДЫ
      case 4:
  console.log(4);
  await new Promise((resolve) =>
    setTimeout(async () => {
      await DIVERS4NT.clickWindow(13, 0, 0);
      await DIVERS4NT.setQuickBarSlot(6);
      await DIVERS4NT.activateItem();
      resolve();
    }, 3000)
  );
  counter++;
  break;
//ВЫБОР РЕЖИМА РЕСУРСОВ
  case 5:
    console.log(5);
    await new Promise((resolve) =>
      setTimeout(async () => {
        await DIVERS4NT.clickWindow(12, 0, 0);
        resolve();
      }, 1000)
    );
    await DIVERS4NT.setQuickBarSlot(0);
    counter++;
    break;
    }
  } catch (error) {
    console.error("Error in windowOpen event handler:", error);
  }
});



async function clickAndProceed(slot) {
  await DIVERS4NT.clickWindow(slot, 0, 0);
}

async function clickAndWait(slot, delay) {
  await DIVERS4NT.clickWindow(slot, 0, 0);
  await delayPromise(delay);
}

async function setSlotAndWait(slot, delay) {
  await DIVERS4NT.setQuickBarSlot(slot);
  await delayPromise(delay);
}

async function activateItemAndWait(delay) {
  await DIVERS4NT.activateItem();
  await delayPromise(delay);
}

async function sequenceOfActions(actions) {
  for (const action of actions) {
    await action();
  }
}

function delayPromise(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}


Bed = null;

DIVERS4NT.on("chat", async (username, message) => {
  if (friends.includes(username)) {
    await DIVERS4NT.chat(`!${username}, ХОРОШ!`);
  } else if (username !== "BedWars") {
    await DIVERS4NT.chat(`!${username}, ЗАВАЛИ ЕБАЛО, ОЛУХ!`);
  }

  console.log(`[${username}] ${message}`);

  if (
    message === "До начала игры осталось 1 секунда!" &&
    username === "BedWars"
  ) {
    setTimeout(async () => {
      await DIVERS4NT.chat(
        "!МЕНЯ ЗОВУТ DIVERS4NT. Я РАЗРАБОТАН УМНЕЙШИМ БЭКЕНДЕРОМ ZEVSOID`OM137, ЧТОБЫ  РУИНИТЬ ИГРУ ТИММЕЙТАМ. МОЖЕТЕ МЕНЯ ЗАСТРОИТЬ, НО СКОРО Я НАУЧУСЬ РАСКАПЫВАТЬ БЛОКИ ВОКРУГ КРОВАТИ."
      );
      let teams = Object.values(DIVERS4NT.teams);
      teams = teams.filter((team) => team.members.includes('DIVERS4NT'))
      await findBed();
      setTimeout(() => {

        setInterval(() => killAura(teams), 500)

      },3000);
    }, 4000);
  }
});

DIVERS4NT.on("end", async () => {
  await playSound.play("./sounds/uebki_found.wav");
});

//AUTOTOTEM
DIVERS4NT.on("physicsTick", async () => {
  DIVERS4NT.autototem.equip();
});


async function findBed() {
  const mcData = require("minecraft-data")(DIVERS4NT.version);
  const movements = new Movements(DIVERS4NT, mcData);
  movements.scafoldingBlocks = [];

  DIVERS4NT.pathfinder.setMovements(movements);

  Bed = await DIVERS4NT.findBlock({
    matching: 26,
    maxDistance: 50,
  });

  const x = Bed.position.x;
  const y = Bed.position.y + 1;
  const z = Bed.position.z;
  const goal = new GoalBlock(x, y, z);
  DIVERS4NT.pathfinder.setGoal(goal);
}

function killAura(teams) {
  const player = DIVERS4NT.nearestEntity(entity => !friends.includes(entity.username) && entity.username && (!teams.includes(entity.username)) && entity.type === 'player' && JSON.stringify(Object.values(entity.effects)) !== JSON.stringify(Object.values({
    "5": { "id": 5, "amplifier": 1, "duration": 109 },
    "14": { "id": 14, "amplifier": 1, "duration": 32767 }
  })));

  if (player) {
    const pos = player.position.offset(0, player.height, 0);
    //DIVERS4NT.lookAt(pos, true, () => {              
    DIVERS4NT.attack(player);
    //});
  }
}

//!friends.includes(entity.username) &&

//SCUM_Bloodlust_

//sh0ketsu
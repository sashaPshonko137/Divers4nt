function holdForward(time) {
    return new Promise((resolve, reject) => {
        DIVERS4NT.setControlState('forward', true);
        setTimeout(() => {
            DIVERS4NT.setControlState('forward', false);
            resolve();
        }, time);
    });
}

module.exports = holdForward;

function holdLeft(time) {
    return new Promise((resolve, reject) => {
        DIVERS4NT.setControlState('left', true);
        setTimeout(() => {
            DIVERS4NT.setControlState('left', false);
            resolve();
        }, time);
    });
}

module.exports = holdLeft;

function holdRight(time) {
    return new Promise((resolve, reject) => {
        DIVERS4NT.setControlState('right', true);
        setTimeout(() => {
            DIVERS4NT.setControlState('right', false);
            resolve();
        }, time);
    });
}

module.exports = holdRight;

function holdBack(time) {
    return new Promise((resolve, reject) => {
        DIVERS4NT.setControlState('back', true);
        setTimeout(() => {
            DIVERS4NT.setControlState('back', false);
            resolve();
        }, time);
    });
}

module.exports = holdBack;




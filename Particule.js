var Particule = function(
    ttl,
    annimation,
    origin = {},
    target = {}
) {
    var particule;

    var annimation = annimation;
    var ttl = ttl;
    var timeOfDeath = getTimestamp() + ttl;
    var timeOfSpawn = getTimestamp();
    var origin = origin;
    var target = target;
    var properties = {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        alpha: 1,
        angle: 0,
    };

    for (property in properties) {
        if (origin[property] !== undefined) {
            properties[property] = origin[property];
        }
    }

    var update = function() {
        var currentTimestamp = getTimestamp();

        for (property in target) {
           if (origin[property] === undefined) { continue }

            var progress = (currentTimestamp - timeOfSpawn) / ttl;
            properties[property] = origin[property] + (target[property] - origin[property]) * progress;
        }
    };

    var draw = function() {
        sprite = annimation.getCurrentSprite();

        for (property in properties) {
            sprite[property] = properties[property];
        }

        sprite.draw();
    };

    particule = {
        draw: draw,
        update: update,
        properties: properties,
        timeOfDeath: timeOfDeath,
    };

    return particule;
};

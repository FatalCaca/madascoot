var ParticuleSpawner = function(
    container,
    particuleManager,
    ttl,
    spawnPeriod,
    annimation,
    position = {x: 0, y: 0},
    origin = {},
    target = {}
) {
    var particuleSpawner;

    var nextSpawnTimestamp = 0;
    var container = container;
    var spawnPeriod;
    var position = position;
    var annimation = annimation;
    var particuleManager = particuleManager;
    var ttl = ttl;
    var origin = origin;
    var target = target;
    var particuleProperties = particuleProperties;

    var update = function() {
        var currentTimestamp = getTimestamp();

        if (nextSpawnTimestamp < currentTimestamp) {
            nextSpawnTimestamp = currentTimestamp + spawnPeriod;

            var particuleOrigin = Object.assign({}, origin);
            var particuleTarget = Object.assign({}, target);

            particuleOrigin.x += container.x + position.x;
            particuleOrigin.y += container.y + position.y;
            particuleTarget.x += container.x + position.x;
            particuleTarget.y += container.y + position.y;

            var particule = Particule(
                ttl,
                annimation,
                particuleOrigin,
                particuleTarget
            );

            particuleManager.addParticule(particule);
        }
    };

    particuleSpawner = {
        update: update,
        spawnPeriod: spawnPeriod,
        origin: origin,
    };

    return particuleSpawner;
};

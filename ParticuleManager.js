var ParticuleManager = function() {
    var particuleManager;

    var particules = [];

    var update = function() {
        var currentTimestamp = getTimestamp();

        for (var i = 0; i < particules.length; ++i) {
            particules[i].update();

            if (particules[i].timeOfDeath < currentTimestamp) {
                particules.splice(i, 1);
            }
        }
    }

    var draw = function() {
        for (var i = 0; i < particules.length; ++i) {
            particules[i].draw();
        }
    };

    var addParticule = function(particule) {
        particules.push(particule);
    };

    var particuleManager = {
        update: update,
        draw: draw,
        addParticule: addParticule,
    };

    return particuleManager;
};

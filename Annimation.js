var buildAnnimation = function(options) {
    var annimation;
    var sprites = options.sprites;

    var getCurrentSprite = function() {
        var currentTimestamp = getTimestamp();
        var elapsed = currentTimestamp - annimation.creationTimestamp;
        var elapsedPeriods = elapsed / annimation.delay;
        var index = elapsedPeriods % annimation.sprites.length;
        index = Math.floor(index);

        return annimation.sprites[index];
    };

    annimation = {
        getCurrentSprite: getCurrentSprite,
        creationTimestamp: getTimestamp(),
        sprites: sprites,
        delay: options.delay
    };

    return annimation;
}

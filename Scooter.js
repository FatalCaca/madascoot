buildScooter = function() {
    var scooter;

    var getCurrentSprite = function() {
        if (scooter.angle <= -10) {
            return scooter.annimations.left.getCurrentSprite();
        }
        if (scooter.angle >= 10) {
            return scooter.annimations.right.getCurrentSprite();
        }

        return scooter.annimations.normal.getCurrentSprite();
    };

    var leanLeft = function() {
        scooter.leaningState = scooter.LEANING.LEFT;
        scooter.driver.leanLeft();
    };

    var leanRight = function() {
        scooter.leaningState = scooter.LEANING.RIGHT;
        scooter.driver.leanRight();
    };

    var stopLeaning = function() {
        scooter.leaningState = scooter.LEANING.NONE;
        scooter.driver.stopLeaning();
    };

    var update = function() {
        var currentTimestamp = getTimestamp();
        var elapsedSinceLastUpdate = currentTimestamp - scooter.lastUpdateAt;
        var leaningProgress = elapsedSinceLastUpdate / CONFIG.MAX_LEANING_TIME;

        if (scooter.leaningState === scooter.LEANING.LEFT) {
            scooter.angle -= CONFIG.MAX_LEANING_ANGLE * leaningProgress;

            if (scooter.angle < -CONFIG.MAX_LEANING_ANGLE) {
                scooter.angle = -CONFIG.MAX_LEANING_ANGLE
            }
        }

        if (scooter.leaningState === scooter.LEANING.RIGHT) {
            scooter.angle += CONFIG.MAX_LEANING_ANGLE * leaningProgress;

            if (scooter.angle > CONFIG.MAX_LEANING_ANGLE) {
                scooter.angle = CONFIG.MAX_LEANING_ANGLE
            }
        }

        if (scooter.leaningState === scooter.LEANING.NONE) {
            if (scooter.angle > 0) {
                scooter.angle -= CONFIG.MAX_LEANING_ANGLE * leaningProgress;
            }
            else {
                scooter.angle += CONFIG.MAX_LEANING_ANGLE * leaningProgress;
            }

            if (Math.abs(scooter.angle) <= 5) {
                scooter.angle = 0;
            }
        }

        scooter.x += Math.sin(scooter.getDegreeAngle()) * CONFIG.LATERAL_MAX_SPEED;

        showText(scooter.angle);

        scooter.lastUpdateAt = getTimestamp();
    };

    var getDegreeAngle = function() {
        return scooter.angle * (Math.PI / 180);
    }

    var draw = function() {
        var sprite = getCurrentSprite();
        sprite.x = scooter.x;
        sprite.y = scooter.y;
        sprite.draw();

        if (scooter.driver) {
            scooter.driver.x = scooter.x;
            scooter.driver.y = scooter.y;
            scooter.driver.draw();
        }
    };

    scooter = {
        LEANING: {
            LEFT: "left",
            RIGHT: "right",
            NONE: "none",
        },
        leanLeft: leanLeft,
        leanRight: leanRight,
        stopLeaning: stopLeaning,
        getDegreeAngle: getDegreeAngle,
        startedLeaningAt: 0,
        draw: draw,
        lastUpdateAt: getTimestamp(),
        update: update,
        getCurrentSprite: getCurrentSprite,
        x: 200,
        y: 700,
        angle: 0,
        annimations: {
            normal: buildAnnimation({
                delay: 500,
                sprites: [
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/scooter_normal_1.png"
                    }),
                ]
            }),
            left: buildAnnimation({
                delay: 300,
                sprites: [
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/scooter_penche_gauche.png"
                    }),
                ]
            }),
            right: buildAnnimation({
                delay: 300,
                sprites: [
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/scooter_penche_droite.png"
                    }),
                ]
            })
        }
    };

    return scooter;
};

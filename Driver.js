var buildDriver = function() {
    var driver;

    var getCurrentSprite = function() {
        return driver.currentAnnimation.getCurrentSprite();
    };

    var leanLeft = function() {
        driver.currentAnnimation = driver.annimations.left;
    };

    var leanRight = function() {
        driver.currentAnnimation = driver.annimations.right;
    };

    var stopLeaning = function() {
        driver.currentAnnimation = driver.annimations.normal;
    };

    var draw = function() {
        var sprite = getCurrentSprite();
        sprite.x = driver.x;
        sprite.y = driver.y;
        sprite.draw();
    };

    driver = {
        draw: draw,
        leanRight: leanRight,
        leanLeft: leanLeft,
        stopLeaning: stopLeaning,
        getCurrentSprite: getCurrentSprite,
        x: 0,
        y: 0,
        annimations: {
            left: buildAnnimation({
                delay: 300,
                sprites: [
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/driver_penche_gauche_1.png"
                    }),
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/driver_penche_gauche_2.png"
                    })
                ]
            }),
            right: buildAnnimation({
                delay: 150,
                sprites: [
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/driver_penche_droite_1.png"
                    }),
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/driver_penche_droite_2.png"
                    })
                ]
            }),
            normal: buildAnnimation({
                delay: 150,
                sprites: [
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/driver_normal_1.png"
                    }),
                    jaws.Sprite({
                        x: 0, y: 0, scale: 3,
                        image: "img/driver_normal_2.png"
                    })
                ]
            })
        }
    };

    driver.currentAnnimation = driver.annimations.normal;

    return driver;

};

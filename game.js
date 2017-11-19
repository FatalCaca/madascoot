function PlayState() {
    var scooter;
    var road;
    var viewport;

    this.setup = function() {
        viewport = new jaws.Viewport({max_x: 512, max_y: 1600});

        particuleManager = ParticuleManager();

        var driver = buildDriver();
        scooter = buildScooter();
        scooter.driver = driver;
        road = Road();

        jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
    }

    this.update = function() {
        var leftPressed = jaws.pressed("left");
        var rightPressed = jaws.pressed("right");

        if(jaws.pressed("space enter")) {
        }
        if(leftPressed) {
            scooter.leanLeft();
        }
        if(rightPressed) {
            scooter.leanRight();
        }
        if (!rightPressed && !leftPressed) {
            scooter.stopLeaning();
        }
        if(jaws.pressed("up")) {
            scooter.y -= 4;
        }
        if(jaws.pressed("down")) {
            scooter.y += 4;
        }

        road.update();
        scooter.update();
        particuleManager.update();
    }

    this.draw = function() {
        viewport.centerAround(scooter);
        viewport.apply(function() {
            jaws.clear()
            road.draw();
            scooter.draw();
            drawDebugText();
            particuleManager.draw();
        });
    }

    function isOutsideCanvas(item) {
        return (item.x < 0 || item.y < 0 || item.x > jaws.width || item.y > jaws.height)
    }
    function forceInsideCanvas(item) {
        if(item.x < 0)                  { item.x = 0  }
        if(item.x + item.width > jaws.width)     { item.x = jaws.width - item.width }
        if(item.y < 0)                  { item.y = 0 }
        if(item.y + item.height  > jaws.height)  { item.y = jaws.height - item.height }
    }
}

function MenuState() {
    var index = 0
    var items = ["Start", "Settings", "Highscore"]

    this.setup = function() {
        index = 0
        jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } )
        jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } )
        jaws.on_keydown(["enter","space"],  function()  { if(items[index]=="Start") {jaws.switchGameState(PlayState) } } )
    }

    this.draw = function() {
        jaws.context.clearRect(0,0,jaws.width,jaws.height)
        for(var i=0; items[i]; i++) {
            // jaws.context.translate(0.5, 0.5)
            jaws.context.font = "bold 50pt terminal";
            jaws.context.lineWidth = 10
            jaws.context.fillStyle =  (i == index) ? "Red" : "Black"
            jaws.context.strokeStyle =  "rgba(200,200,200,0.0)"
            jaws.context.fillText(items[i], 30, 100 + i * 60)
        }
    }
}

/*
 *
 * Our script-entry point
 *
 */
window.onload = function() {
    jaws.assets.add("img/teub.png")
    jaws.assets.add("img/goutte.png")
    jaws.assets.add("img/pixel.png")
    jaws.assets.add("img/scooter_normal_1.png")
    jaws.assets.add("img/scooter_penche_droite.png")
    jaws.assets.add("img/scooter_penche_gauche.png")
    jaws.assets.add("img/driver_penche_gauche_1.png")
    jaws.assets.add("img/driver_penche_gauche_2.png")
    jaws.assets.add("img/driver_penche_droite_1.png")
    jaws.assets.add("img/driver_penche_droite_2.png")
    jaws.assets.add("img/driver_normal_1.png")
    jaws.assets.add("img/driver_normal_2.png")
    jaws.start(MenuState)
}

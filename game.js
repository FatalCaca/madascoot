/*
 *
 * PlayState is the actual game play. We switch to it once user choses "Start game"
 *
 */
var fps = document.getElementById("fps");

var getTimestamp = function() {
    return Math.round((new Date()).getTime());
};

function PlayState() {
    var CONFIG = {
        MAX_LEANING_TIME: 750,
        MAX_LEANING_ANGLE: 90,
        LEANING_FALL_THRESHOLD: 80,
        LATERAL_MAX_SPEED: 10
    };

    var debugText = "";
    var VIEWPORT = { height: 800, width: 512 };
    var PIXEL_SIZE = 8;
    var GRID = { height: VIEWPORT.height / PIXEL_SIZE, width: VIEWPORT.width / PIXEL_SIZE };
    var COLOR = {
        road: "#BBB",
        pavement: "red",
    };

    var scooter;
    var pixel;
    var roadPixel;
    var pavementPixel;
    var bullets = new jaws.SpriteList();
    var roads = [[1], [61]];
    var roadsThresholds = [[0, 10], [54, 63]];
    var roadUpdateDelay = 8;
    var roadUpdateCountdown = roadUpdateDelay;

    var showText = function(text) {
        debugText = text;
    };

    var drawDebugText = function() {
        jaws.context.font = "bold 20pt terminal";
        jaws.context.lineWidth = 10
        jaws.context.fillStyle = "red"
        jaws.context.strokeStyle =  "rgba(200,200,200,0.0)"
        jaws.context.fillText(debugText, 30, 100)

    }

    var updateRoads = function () {
        if (roads[0].length >= GRID.height) {
            roads[0].shift()
            roads[1].shift()
        }

        var leftRoad = roads[0][roads[0].length - 1];
        var rightRoad = roads[1][roads[1].length - 1];

        roadUpdateCountdown--;

        if (roadUpdateCountdown <= 0) {
            roadUpdateCountdown = roadUpdateDelay;

            leftRoad += parseInt(Math.random() * 3) - 1;
            rightRoad += parseInt(Math.random() * 3) - 1;

            if (leftRoad <= roadsThresholds[0][0]) { leftRoad = roadsThresholds[0][0]; }
            if (leftRoad >= roadsThresholds[0][1]) { leftRoad = roadsThresholds[0][1]; }
            if (rightRoad <= roadsThresholds[1][0]) { rightRoad = roadsThresholds[1][0]; }
            if (rightRoad >= roadsThresholds[1][1]) { rightRoad = roadsThresholds[1][1]; }
        }

        roads[0].push(leftRoad);
        roads[1].push(rightRoad);
    };

    var drawRoads = function() {
        for (var i = roads[0].length; i >= 0; i--) {
            roadPixel.setSize(
                (roads[1][i] - roads[0][i]) * PIXEL_SIZE,
                PIXEL_SIZE
            );
            roadPixel.drawAt(
                roads[0][i] * PIXEL_SIZE,
                PIXEL_SIZE * (GRID.height - i)
            );

            pavementPixel.setSize(8, 8);
            pavementPixel.drawAt(
                roads[0][i] * PIXEL_SIZE,
                PIXEL_SIZE * (GRID.height - i)
            );
            pavementPixel.drawAt(
                roads[1][i] * PIXEL_SIZE,
                PIXEL_SIZE * (GRID.height - i)
            );
        }
    };

    this.setup = function() {
        console.log('pute ?');
        var driver = buildDriver();
        scooter = buildScooter();
        scooter.driver = driver;

        pixel = new jaws.Sprite({
            x: 10, y:100, scale: PIXEL_SIZE,
            color: "red"
        });

        roadPixel = new jaws.Sprite({
            x: 10, y:100, scale: PIXEL_SIZE,
            color: COLOR.road
        });

        pavementPixel = new jaws.Sprite({
            x: 10, y:100, scale: PIXEL_SIZE,
            color: COLOR.pavement
        });

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

        updateRoads();
        scooter.update();

        bullets.removeIf(isOutsideCanvas);
    }

    this.draw = function() {
        jaws.clear()
        drawRoads();
        scooter.draw();
        drawDebugText();
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

    function Bullet(x, y) {
        this.x = x
        this.y = y
        this.draw = function() {
            this.x += 4
            jaws.context.drawImage(jaws.assets.get("img/goutte.png"), this.x, this.y)
        }
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

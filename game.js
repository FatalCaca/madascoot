/*
 *
 * PlayState is the actual game play. We switch to it once user choses "Start game"
 *
 */
var fps = document.getElementById("fps");

function PlayState() {
    var VIEWPORT = { height: 800, width: 512 };
    var PIXEL_SIZE = 8;
    var GRID = { height: VIEWPORT.height / PIXEL_SIZE, width: VIEWPORT.width / PIXEL_SIZE };

    var player;
    var pixel;
    var bullets = new jaws.SpriteList();
    var roads = [[1], [61]];
    var roadsThresholds = [[0, 10], [54, 63]];

    var updateRoads = function () {
        if (roads[0].length >= GRID.height) {
            roads[0].shift();
            roads[1].shift();
        }

        leftRoad = roads[0][roads[0].length - 1];
        rightRoad = roads[1][roads[1].length - 1];
        leftRoad += parseInt(Math.random() * 3) - 1;
        rightRoad += parseInt(Math.random() * 3) - 1;

        roads[0].push(leftRoad);
        roads[1].push(rightRoad);
    };

    var drawRoads = function() {
        for (var i = roads[0].length; i >= 0; i--) {
            pixel.drawAt(roads[0][i] * PIXEL_SIZE, PIXEL_SIZE * i);
            pixel.drawAt(roads[1][i] * PIXEL_SIZE, PIXEL_SIZE * i);
        }
    };

    this.setup = function() {
        player = new jaws.Sprite({image: "img/teub.png", x: 10, y:100, scale: 1})
        player.can_fire = true
        pixel = new jaws.Sprite({
            image: "img/pixel.png",
            x: 10, y:100, scale: PIXEL_SIZE
        });

        pixel.drawAt = function(x, y) {
            pixel.moveTo(x, y);
            pixel.draw();
        };


        jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
    }

    this.update = function() {
        if(jaws.pressed("left a"))  { player.x -= 2 }
        if(jaws.pressed("right d")) { player.x += 2 }
        if(jaws.pressed("up w"))    { player.y -= 2 }
        if(jaws.pressed("down s"))  { player.y += 2 }
        if(jaws.pressed("space enter")) {
            if(player.can_fire) {
                bullets.push( new Bullet(player.rect().right, player.y) )
                player.can_fire = false
                setTimeout(function() { player.can_fire = true }, 100)
            }
        }

        updateRoads();

        forceInsideCanvas(player);
        bullets.removeIf(isOutsideCanvas);
    }

    this.draw = function() {
        jaws.clear()
        player.draw()
        bullets.draw()  // will call draw() on all items in the list
        drawRoads();
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
    jaws.start(MenuState)
}

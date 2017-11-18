var CONFIG = {
    MAX_LEANING_TIME: 750,
    MAX_LEANING_ANGLE: 90,
    LEANING_FALL_THRESHOLD: 80,
    LATERAL_MAX_SPEED: 10
};

var VIEWPORT = { height: 800, width: 512 };
var PIXEL_SIZE = 8;
var GRID = { height: VIEWPORT.height / PIXEL_SIZE, width: VIEWPORT.width / PIXEL_SIZE };
var COLOR = {
    road: "#BBB",
    pavement: "red",
};


var debugText = "";

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

var getTimestamp = function() {
    return Math.round((new Date()).getTime());
};


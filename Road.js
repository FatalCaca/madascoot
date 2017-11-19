var Road = function() {
    var road;

    var C = {
        ELEMENT_SIZE: 16,
        WIDTH: VIEWPORT.width / 16,
        HEIGHT: VIEWPORT.height / 16 * 2,
    };

    var roadColors = [
        "#9f8374",
        "#c6a893",
        "#9e8575",
        "#a48974",
    ];

    var newRowDelay= 20;
    var newRowTimestamp = 0;
    var content = [];
    var borderThresholds = [[0, 10], [25, 31]];
    var roadUpdateDelay = 8;
    var roadUpdateCountdown = roadUpdateDelay;
    var borders = [2, 30];
    var roadFillingSprites = [];
    var pavementPixel = new jaws.Sprite({
        x: 10, y:100, scale: C.ELEMENT_SIZE,
        color: "blacj"
    })

    var createRoadFillingSprites = function() {
        for (var i = 0; i < 3; ++i) {
            var color = roadColors[Math.floor(Math.random() * roadColors.length)];

            roadFillingSprites.push(new jaws.Sprite({
                    x: 10, y:100, scale: C.ELEMENT_SIZE,
                    color: color
                })
            )
        }
    };

    createRoadFillingSprites();

    var draw = function() {
        for (var i = 0; i < content.length; ++i) {
            var row = content[i];

            for (var j = 0; j < row.length; ++j) {
                if (row[j]) {
                    row[j].drawAt(
                        j * C.ELEMENT_SIZE,
                        i * C.ELEMENT_SIZE
                    );
                }
            }
        }
    };

    var pushNewRow = function() {
        var newRow = [];
        var leftBorder = borders[0];
        var rightBorder = borders[1];

        roadUpdateCountdown--;

        if (roadUpdateCountdown <= 0) {
            roadUpdateCountdown = roadUpdateDelay;

            leftBorder += parseInt(Math.random() * 3) - 1;
            rightBorder += parseInt(Math.random() * 3) - 1;

            if (leftBorder <= borderThresholds[0][0]) { leftBorder = borderThresholds[0][0]; }
            if (leftBorder >= borderThresholds[0][1]) { leftBorder = borderThresholds[0][1]; }
            if (rightBorder <= borderThresholds[1][0]) { rightBorder = borderThresholds[1][0]; }
            if (rightBorder >= borderThresholds[1][1]) { rightBorder = borderThresholds[1][1]; }

            borders = [leftBorder, rightBorder];
        }

        for (var i = leftBorder + 1; i < rightBorder; ++i) {
            var sprite = roadFillingSprites[Math.floor(Math.random() * roadFillingSprites.length)];
            newRow[i] = sprite;
        }

        for (var i = 0; i < leftBorder; ++i) {
            newRow[i] = pavementPixel;
        }

        for (var i = rightBorder; i < C.WIDTH; ++i) {
            newRow[i] = pavementPixel;
        }

        if (content.length > C.HEIGHT) {
            content.pop();
        }

        content.unshift(newRow);
    }

    var update = function() {
        var currentTimestamp = getTimestamp();

        if (currentTimestamp > newRowTimestamp) {
            pushNewRow();
            newRowTimestamp = currentTimestamp + newRowDelay;
        }
    };

    road = {
        C: C,
        update: update,
        draw: draw,
        content: content,
        borderThresholds: borderThresholds,
        roadUpdateDelay: roadUpdateDelay,
        roadUpdateCountdown: roadUpdateCountdown,
        borders: borders,
        roadFillingSprites: roadFillingSprites,
    };

    return road;
};

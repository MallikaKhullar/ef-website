function getCategory() {
    return document.getElementById("year").options[document.getElementById("year").selectedIndex].value;
}

function getImpactNum(category) {
    var num = $('.rangeslider__handle__value')[0].textContent;

    switch (category) {
        case "food":
            return (num * 4.12);
        case "tree":
            return (num * 3.12);
        case "book":
            return (num * 7.02);
    }
}

function applyImage(imgsrc, row) {
    var rowDiv = $('#impact-grid').children().eq(0).children()[row];
    $('td', rowDiv).each(function() {
        $(this)[0].lastChild.src = imgsrc;
    });
};

function applyImageAll(imgsrc) {
    applyImage(imgsrc, 0);
    applyImage(imgsrc, 1);
    applyImage(imgsrc, 2);
    applyImage(imgsrc, 3);
}

function applyImageRows(imgsrc, row, colStart, colEnd) {
    var count = 0;
    var rowDiv = $('#impact-grid').children().eq(0).children()[row];
    $('td', rowDiv).each(function() {
        count++;
        if (count >= colStart && count <= colEnd) {
            $(this)[0].lastChild.src = imgsrc;
        }
    });
}


function getIntAndDecimal(n) {
    return [Math.floor(n), n - Math.floor(n)];
}

function changeImpactGrid() {
    var category = getCategory();
    var count = getImpactNum(category);

    var activity = "";
    switch (category) {
        case "food":
            activity = "feed " + Math.floor(count) + " children";
            break;
        case "tree":
            activity = "plant " + Math.floor(count) + " trees";
            break;
        case "book":
            activity = "educate a child for " + Math.floor(count) + " days";
            break;
    }

    $("#impact-stmt").text("Each month, you can raise funds to " + activity + ", just by spending time online!");

    var imgsrc = "/image/" + category + "_";

    if (count > 48) {
        console.log("Bigger than 48");
        imgsrc += "big.png";
        applyImageAll(imgsrc);
        return;
    }

    if (count > 36) {
        applyImage(imgsrc + "big.png", 0);
        applyImage(imgsrc + "big.png", 1);
        applyImage(imgsrc + "big.png", 2);
        //calc for 2nd row

        var num = getIntAndDecimal(count)[0] - 36;
        var dec = getIntAndDecimal(count)[1];
        applyImageRows(imgsrc + "big.png", 3, 0, num);
        if (dec > 0) applyImageRows(imgsrc + "small.png", 3, num + 1, num + 2);
        applyImageRows(imgsrc + "empty.png", 3, num + 2, 48);
        return;

        return;
    }

    if (count > 24) {
        applyImage(imgsrc + "big.png", 0);
        applyImage(imgsrc + "big.png", 1);
        applyImage(imgsrc + "empty.png", 3);
        //calc for 2nd row

        var num = getIntAndDecimal(count)[0] - 24;
        var dec = getIntAndDecimal(count)[1];
        applyImageRows(imgsrc + "big.png", 2, 0, num);
        if (dec > 0) applyImageRows(imgsrc + "small.png", 2, num + 1, num + 2);
        applyImageRows(imgsrc + "empty.png", 2, num + 2, 48);
        return;
    }

    if (count > 12) {
        applyImage(imgsrc + "big.png", 0);
        applyImage(imgsrc + "empty.png", 2);
        applyImage(imgsrc + "empty.png", 3);

        var num = getIntAndDecimal(count)[0] - 12;
        var dec = getIntAndDecimal(count)[1];
        applyImageRows(imgsrc + "big.png", 1, 0, num);
        if (dec > 0) applyImageRows(imgsrc + "small.png", 1, num + 1, num + 2);
        applyImageRows(imgsrc + "empty.png", 1, num + 2, 48);
        return;
    }

    if (count == 0) {
        applyImageAll(imgsrc + "empty.png");
        return;
    }

    //calc for 0th row
    var num = getIntAndDecimal(count)[0];
    var dec = getIntAndDecimal(count)[1];
    applyImageRows(imgsrc + "big.png", 0, 0, num);
    if (dec > 0) applyImageRows(imgsrc + "small.png", 0, num + 1, num + 2);
    applyImageRows(imgsrc + "empty.png", 0, num + 2, 48);
    applyImage(imgsrc + "empty.png", 1);
    applyImage(imgsrc + "empty.png", 2);
    applyImage(imgsrc + "empty.png", 3);


}
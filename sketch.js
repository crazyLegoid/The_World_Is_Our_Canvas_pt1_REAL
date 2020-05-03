var database;
var paint = [];
var currentPath = [];
var isDrawing = false;
var sWeight = 10;
var inputName = 'Default'

function setup() {

    canvas = createCanvas(400, 400);
    inputName = createInput("Enter Name");


    //var x = (windowWidth - width) / 2;
    //var y = (windowHeight - height) / 2;
    //canvas.position(x, y);

    //canvas.style = "position:absolute; left: 50%; width: 400px; margin-left: -200px;";
    database = firebase.database();
    canvas.mousePressed(startPath);
    canvas.parent('canvasContainer');

    var saveButton = select('#save');    
    var clearButton = select('#clear');    
    saveButton.mousePressed(saveDrawing);
    clearButton.mousePressed(clearDrawing);
    canvas.mouseReleased(endPath);

    inputName.position(100, 100);

    var ref = database.ref('gallary');
    ref.on("value", getDataFromDb, sendDataFromDb)

}

function draw() {

    background(0);
    if (isDrawing) {

        var point = {

            x: mouseX,
            y: mouseY

        }
        currentPath.push(point);

    }

    stroke(255);
    strokeWeight(sWeight);
    noFill();
    for (var i = 0; i < paint.length; i++) {
        var path = paint[i];

        if(path && path.length) {
            beginShape();
            for (var j = 0; j < path.length; j++) {
                vertex(path[j].x, path[j].y);
            }
            endShape();
        }
    }



}

function startPath() {

    currentPath = [];
    paint.push(currentPath);
    isDrawing = true

}

function endPath() {

    isDrawing = false;

}

function saveDrawing() {

    var ref = database.ref('gallary');

    var data = {

        name: inputName.value(),
        strokeWeight: sWeight,
        paint: paint

    }

    var result = ref.push(data, dataSent);
    console.log(result.key)

    function dataSent(err, status) {

        console.log(status);

    }
}

function getDataFromDb(data) {

    var drawings = data.val();
    var keys = Object.keys(drawings);
    var elts = selectAll('.listing');
    for(var i = 0; i < elts.length; i++){

        elts[i].remove();

    }
    var name = 'Default';
    for (i = 0; i < keys.length; i++) {

        var key = keys[i];
        var dbName = database.ref('gallary/' + key + '/name');

        dbName.on('value', function(data) {
            name = data.val();
            console.log("*****"+name)
          });

          
        //console.log(key);
        var liItems = createElement('li', '');
        liItems.class('listing');
        var ahref = createA('#', key+"~"+name);
        ahref.mousePressed(displayD);
        ahref.parent(liItems);
        liItems.parent('drawingList');
    }

}

function sendDataFromDb(err) {

    console.log(err);

}

function displayD(){

    var key = this.html();
    var ref = database.ref('gallary/' + key.split('~')[0]);
    ref.on('value', thisDrawing, sendDataFromDb);
    //console.log(this.html());
    function thisDrawing(data){

        var retrievedD = data.val();
        paint = retrievedD.paint;
        inputName = createInput(retrievedD.name);
        inputName.position(100, 100);

    }

}

function clearDrawing(){

    paint = [];

}
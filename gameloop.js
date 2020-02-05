
function gameloop(circle, shader, gl){
    if (Math.floor(Math.random() * 100) == 5){
        var temp = circle[0].getRandomPoint();    
        if (circle.length < 12)
            return (new Circle(parseFloat(temp[0]), parseFloat(temp[1]), 0.05, shader, gl));
    }
    return null;
}

function scale(circles, gl, speed){
    if (circles.length == 1)
        return circles;
    origin = circles.shift(1);
    circles.map(x => {
        if (x.getRadius() < 0.35) {
            vertices = x.getVertices()
            for (var i = 0; i < vertices.length; i+=3) {
                vertices[i] = ((vertices[i] - x.getx()) * speed) + x.getx();
                vertices[i + 1] = ((vertices[i + 1] - x.gety()) * speed) + x.gety();
            }
            x.setVertices(vertices);
            x.setRadius(x.getRadius() * speed)
            x.genBuffers(gl)}
        else {
            x.setComplete(true);
        }});
    circles.unshift(origin)
    return circles;
}

function endGame(circles) {
    var count = 0;
    for (var i = 0; i < circles.length; i++) {  
        if (circles[i].getComplete() == true)
            count += 1;
    }
    if (count > 1)
        console.log("gameover");
        //gameOver()
}

function drawScore(score, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.font = "32px Verdana";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score.toFixed(2), 8, 30);
  }
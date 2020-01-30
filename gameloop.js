
function gameloop(circle, shader, gl){
    temp = circle.getRandomPoint();
    console.log("X: " + temp[0] + " Y: " + temp[1]);
    return (new Circle(temp[0], temp[1], 0.9, shader, gl));
}
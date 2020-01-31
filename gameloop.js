
function gameloop(circle, shader, gl){
    if (Math.floor(Math.random() * 100) == 5){
        //var temp = [];
        var temp = circle.getRandomPoint();
        return (new Circle(parseFloat(temp[0]), parseFloat(temp[1]), 0.15, shader, gl));
    }
    return null;
}
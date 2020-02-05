function main() {
    console.log("hi")
    const canvas = document.querySelector("#glCanvas");
    const scoreCanvas = document.getElementById("score");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");
    const ctx = scoreCanvas.getContext("2d");
    //Initialise vertex shader
    var vs = 
    'attribute vec3 vposition;'
    +'void main(){'
    +'  gl_Position = vec4(vposition, 1.0);'
    +'}';
    //initialise fragment shader
    var fs =
    'precision mediump float;'+
    'uniform vec4 fColor;'+
   ' void main(){'+
   ''+
   ' gl_FragColor = fColor;'
    +'}'
    //Compile and attach shader to GL context
    var vshader = createShader(gl, vs, gl.VERTEX_SHADER);
    var fshader = createShader(gl, fs, gl.FRAGMENT_SHADER);
    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    
    //Create Circles
    var circles = [new Circle(0, 0, 0.65, program, gl)];
    
    circles[0].setPetri();

    var score = 0;
    drawScore(score, ctx)

    //Function to detect mouse clicks
    var mouseClick = function(e) {
        const rect = canvas.getBoundingClientRect()
        var x = event.clientX - rect.left
        var y = event.clientY - rect.top
        x = (x/rect.right) * 2;
        y = (y/rect.bottom) * 2;
        x = x - 1;
        y = (y - 1) * -1;
        for (var i = 0; i < circles.length; i++){
            if (circles[i] != null && circles[i].collision(x, y)) {
              score = score + ((0.35 - circles[i].getRadius()) * 10)
              circles[i] = null;
            }
        }
        circles = circles.filter(x => x != null);
     };
    canvas.addEventListener("click", mouseClick, false);
    //Game Loop (Needed so window only draws circles 60 times per second)
    var c;
    var found = false;
    //circles[circles.length] = gameloop(circles[0], program, gl);
    window.requestAnimationFrame(animate);

    function animate (time) {
      c = gameloop(circles, program, gl);
      if (c != null) {
        circles[circles.length] = c;
      }
      circles = scale(circles, gl, 1.003)
      //Draw loop
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      for (var i = 0; i < circles.length; i++){
        circles[i].draw(canvas);
      }
      drawScore(score, ctx)
      endGame(circles);
  	  window.requestAnimationFrame(animate);
    }
  }

  //Function to create a shader from input text
  function createShader (gl, sourceCode, type) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var shader = gl.createShader( type );
    gl.shaderSource( shader, sourceCode );
    gl.compileShader( shader );
  
    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
      var info = gl.getShaderInfoLog( shader );
      throw 'Could not compile WebGL program. shader \n\n' + info;
    }
    console.log("shader compiled succesfully!");
    return shader;
  }
  
  window.onload = main;

  
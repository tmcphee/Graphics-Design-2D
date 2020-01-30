

function main() {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");
    //Initialise vertex shader
    var vs = 
    'attribute vec3 vposition;'
    +'void main(){'
    +'  gl_Position = vec4(vposition, 1.0);'
    +'}';
    //initialise fragment shader
    var fs =
   ' void main(){'+
   ' gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);'
    +'}'
    //Compile and attach shader to GL context
    var vshader = createShader(gl, vs, gl.VERTEX_SHADER);
    var fshader = createShader(gl, fs, gl.FRAGMENT_SHADER);
    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    
    //Create Circles
    var circles = [new Circle(0, 0, 1, program, gl)];
    
    circles[0].setPetri();
    circles[circles.length] = new Circle(0, 0, 0.1, program, gl);
    circles[circles.length] = new Circle(-0.4, -0.6, 0.1, program, gl);
    circles[circles.length] = new Circle(0.4, 0.6, 0.03, program, gl);

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
            if (circles[i] != null)
                if (circles[i].collision(x, y))
                    circles[i] = null;
        }
     };
    canvas.addEventListener("click", mouseClick, false);

    //Game Loop (Needed so window only draws circles 60 times per second)
    window.requestAnimationFrame(animate);
    function animate (time) {
    	//Draw loop
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (var i = 0; i < circles.length; i++){
            if (circles[i] != null)
                circles[i].draw(canvas);
        }
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
    console.log("shader compiled succesfully");
    return shader;
  }
  
  window.onload = main;

  //Circle Class, Could also be called Bacteria
  class Circle {
    constructor(x, y, radius, shader, gl) {
      //Initalise Variables such as X position Y position, GL context, radius, pointer to shader program, Vertex Buffer, Index Buffer, vertices, indices, and the number of Indices
      this.x = x;
      this.y = y;
      this.gl = gl;
      this.Radius = radius;
      this.shaderProgram = shader;
      this.vbo;
      this.petri = false;
      this.indexbuffer;
      this.vertices = [x, y, 0];
      this.indices = [0];
      this.numIndices = 0;
      //Generate points of the circle
      this.generate();

      //Generate vertex buffer and index buffer
      this.genBuffers(gl);
    }

    generate(){
        /** Generates the Points around the circle **/
        var tempX;
        var tempY;
        var found = 0;
        //Loop through for all 360 degrees of a circle
        for(var i = 0; i < 360; i += 0.3){
            //Get the X and Y coord of next point
            tempX = [this.x + Math.cos(i)*this.Radius];
            tempY = [this.y + Math.sin(i)*this.Radius];
            
            //Loop through list of vertices, If this X and Y already exist, use that index
            for (var j = 0; j < this.vertices.length; j += 3){
                if (this.vertices[j] == tempX && this.vertices[j + 1] == tempY){
                   this.indices[this.indices.length] = [j];
                   found = 1;
                   break;
                }
            }
        //If Point is unique, add point to vertices[] and create new index
        if (found == 0){
            this.vertices[this.vertices.length] = tempX;
            this.vertices[this.vertices.length] = tempY;
            this.vertices[this.vertices.length] = 0;
            this.indices[this.indices.length] = this.indices.length;
            this.numIndices++;
        }
        
        }
        this.indices[this.indices.length] = this.indices[this.indices.length - 1];
    }

    printVertices(){
        //Print points to screen
        for(var j = 0; j < this.vertices.length; j++){
          console.log("Vertex " + j +  ": " + this.vertices[j]);
        }
    }

    collision(X, Y){
        //If circle is the background
        if (this.petri == true)
            return false;
        //Get the difference in x and y coords
        var dx = X - this.x;
        var dy = Y - this.y;
        //equation for finding how far click was from center of circle
        var d = Math.sqrt( (dx * dx) + (dy * dy));
        //If the point clicked is inside the radius of the circle, return true, otherwise return false
        if(d <= (this.Radius)){
            console.log("Hit");
            return true;
        }
        return false;
    }

    printIndices(){
        //Print points to screen
        for(var j = 0; j < this.indices.length; j++){
          console.log("Inices " + j +  ": " + this.indices[j]);
        }
        console.log("Num Indices:" + this.numIndices);
    }

    setx(x){
        this.x = x;
    }
    sety(y){
        this.y = y;
    }
    setRadius(radius){
        this.Radius = radius;
    }
    setShader(shader){
        this.Shader = shader;
    }
    setNumSlices(NumSlices){
        this.NumSlices = NumSlices;
    }

    setPetri(){
        this.petri = true;
    }
    
    getx(){
        return this.x;
    }
    gety(){
        return this.y;
    }
    getRadius(){
        return this.Radius;
    }
    getShader(){
        return this.Shader;
    }
    getNumSlices(){
        return this.NumSlices;
    }
    getVertices(){
        return this.vertices;
    }

    genBuffers(gl){
        //Generate a vertex buffer and give it our vertices
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        //Generate a new index buffer and give it our indices
        this.indexbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    draw(canvas){
        //define local "gl" variable so it's easier to call, same for shader
        var gl = this.gl;
        var shaderProgram = this.shaderProgram;
        //Bind programs
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        //Set position
        var vpos = gl.getAttribLocation(shaderProgram, "vposition");
        gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vpos);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);

        // Set the view port
        gl.viewport(0,0,canvas.width,canvas.height);

        //Draw the triangle
        gl.drawElements(gl.TRIANGLE_FAN, this.numIndices + 1, gl.UNSIGNED_SHORT, 0);
    }
  }
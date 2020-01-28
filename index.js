function main() {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");
    var vs = 
    'attribute vec3 vposition;'
    +'void main(){'
    +'  gl_Position = vec4(vposition, 1.0);'
    +'}';
    var fs =
   ' void main(){'+
   ' gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);'
    +'}'
    var vshader = createShader(gl, vs, gl.VERTEX_SHADER);
    var fshader = createShader(gl, fs, gl.FRAGMENT_SHADER);

    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    const c = new Circle(-0.4, -0.3, 0.3, 12, 0, gl);
    const c2 = new Circle(0.6, 0, 0.4, 12, 0, gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    c.draw(gl, program, canvas);
    c2.draw(gl, program, canvas);
   // c.printVertices();
  }

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

  class Circle {
    constructor(x, y, radius, shader, NumSlices, gl) {
      this.x = x;
      this.y = y;
      this.Radius = radius;
      this.Shader = shader;
      this.NumSlices = NumSlices;
      this.vbo;
      this.vao;
      //this.vertices = [x, y];
      //this.generate();
      this.vertices = [x, y, 0];
      this.generate();
      this.genBuffers(gl);
    }

    generate(){
        /** Generates the Points around the circle **/
        var k = 3;
        for(var i = 0; i < 360; i += 1){
            this.vertices[k] = [this.x + Math.cos(i)*this.Radius];
            this.vertices[k + 1] = [this.y + Math.sin(i)*this.Radius];
            this.vertices[k + 2] = 0;
            k += 3;
        }
    }

    printVertices(){
        //Print points to screen
        for(var j = 0; j < this.vertices.length; j++){
          //  document.write(this.vertices[j] + "<br>");
          console.log("Vertex " + j +  ": " + this.vertices[j]);
        }
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
      this.vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    draw(gl, shaderProgram, canvas){
      gl.useProgram(shaderProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      var vpos = gl.getAttribLocation(shaderProgram, "vposition");
      gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vpos);
       // Clear the canvas
       

       // Enable the depth test
       gl.enable(gl.DEPTH_TEST);

       // Clear the color and depth buffer
       

       // Set the view port
       gl.viewport(0,0,canvas.width,canvas.height);

       // Draw the triangle
       gl.drawArrays(gl.TRIANGLE_FAN, 0, 360);
    }
  }
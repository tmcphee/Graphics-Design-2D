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
    const c = new Circle(-0.4, -0.3, 0.3, program, gl);
    const c2 = new Circle(0.6,  0.3, 0.3, program, gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    c.draw(canvas);
    c2.draw(canvas);
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
    constructor(x, y, radius, shader, gl) {
      this.x = x;
      this.y = y;
      this.gl = gl;
      this.Radius = radius;
      this.shaderProgram = shader;
      this.vbo;
      this.indexbuffer;
      this.vertices = [x, y, 0];
      this.indices = [0];
      this.numIndices = 0;
      this.generate();
      this.genBuffers(gl);
    }

    generate(){
        /** Generates the Points around the circle **/
        var tempX;
        var tempY;
        var found = 0;
       // var k = 3;
        for(var i = 0; i < 360; i += 6){
            tempX = [this.x + Math.cos(i)*this.Radius];
            tempY = [this.y + Math.sin(i)*this.Radius*1.3];
            
            for (var j = 0; j < this.vertices.length; j += 3){
                if (this.vertices[j] == tempX && this.vertices[j + 1] == tempY){
                   this.indices[this.indices.length] = [j];
                   found = 1;
                   break;
                }
            }
        
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

      this.indexbuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    draw(canvas){
      var gl = this.gl;
      var shaderProgram = this.shaderProgram;
      gl.useProgram(shaderProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      var vpos = gl.getAttribLocation(shaderProgram, "vposition");
      gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vpos);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
       // Clear the canvas
       

       // Enable the depth test
       gl.enable(gl.DEPTH_TEST);

       // Clear the color and depth buffer
       

       // Set the view port
       gl.viewport(0,0,canvas.width,canvas.height);

       // Draw the triangle
       gl.drawElements(gl.TRIANGLE_FAN, this.numIndices + 1, gl.UNSIGNED_SHORT, 0);
    }
  }
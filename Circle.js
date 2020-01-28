class Circle {
    constructor(x, y, radius, shader, NumSlices, gl) {
      this.x = x;
      this.y = y;
      this.Radius = radius;
      this.Shader = shader;
      this.NumSlices = NumSlices;
      this.vbo;
      this.vao;
      this.vertices = [x, y];
      this.generate();
      this.genBuffers(gl);
    }

    generate(){
        /** Generates the Points around the circle **/
        var k = 2;
        for(var i = 0; i < 360; i += 10){
            this.vertices[k] = [this.x + Math.cos(i)*this.Radius];
            this.vertices[k + 1] = [this.y + Math.sin(i)*this.Radius];
            k += 2;
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
      gl.vertexAttribPointer(vpos, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vpos);
       // Clear the canvas
       

       // Enable the depth test
       gl.enable(gl.DEPTH_TEST);

       // Clear the color and depth buffer
       

       // Set the view port
       gl.viewport(0,0,canvas.width,canvas.height);

       // Draw the triangle
       gl.drawArrays(gl.TRIANGLE_FAN, 0, 37);
    }
  }
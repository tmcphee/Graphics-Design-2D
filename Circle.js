//Circle Class, Could also be called Bacteria
class Circle {
    constructor(x, y, radius, shader, gl) {
      /*Initalise Variables such as X position Y position, GL context, radius, pointer 
      to shader program, Vertex Buffer, Index Buffer, vertices, indices, and the number 
      of Indices*/
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
      this.colour = [x, y, 0.5, 1];
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

    getRandomPoint(){
        var rand = Math.floor(Math.random()*(this.vertices.length));
        // return this.vertices[Math.floor(Math.random()*(this.vertices.length))];
        if (rand == 0)
            rand+= 3
        if (rand == 1)
            rand+=2;
        if (rand == 2)
            rand++;
        if (rand % 3 != 0)
            while ((rand % 3) != 0){
                rand--;
            }
        return [this.vertices[rand], this.vertices[rand+1]];
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
        var fColorLocation = gl.getUniformLocation(shaderProgram, "fColor");
        gl.uniform4f(fColorLocation, this.colour[0], this.colour[1], this.colour[2], this.colour[3]);
        
        // Set the view port
        gl.viewport(0,0,canvas.width,canvas.height);

        //Draw the triangle
        gl.drawElements(gl.TRIANGLE_FAN, this.numIndices + 1, gl.UNSIGNED_SHORT, 0);
    }
  }
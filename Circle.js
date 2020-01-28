class Circle {
    constructor(x, y, radius, shader, NumSlices) {
      this.x = x;
      this.y = y;
      this.Radius = radius;
      this.Shader = shader;
      this.NumSlices = NumSlices;
      this.vbo = 0;
      this. vao = 0;
      this.vertices = [];
      this.generate();
    }

    generate(){
        /** Generates the Points around the circle **/
        var k = 0;
        for(var i = 0; i < 360; i += 10){
            this.vertices[k] = [this.x + Math.cos(i)*this.Radius, this.y + Math.sin(i)*this.Radius];
            k++;
        }
        
    }

    printVertices(){
        //Print points to screen
        for(var j = 0; j < this.vertices.length; j++){
            document.write(this.vertices[j] + "<br>");
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

    draw(gl){
        gl.glEnableClientState(GL_VERTEX_ARRAY);
        gl.glVertexPointer(3, GL_FLOAT, 0, this.vertices);
        gl.glDrawArrays(GL_TRIANGLE_FAN, 0, 360);
        gl.glDisableClientState(GL_VERTEX_ARRAY);
    }
    
  }
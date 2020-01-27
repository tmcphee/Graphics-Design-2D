

class Circle {
    vbo;
    vao;

    constructor(x, y, radius, shader, NumSlices) {
      this.x = x;
      this.y = y;
      this.Radius = radius;
      this.Shader = shader;
      this.NumSlices = NumSlices;
      this.generate();
    }

    generate(){
        /** Generates the Points around the circle **/
        var vertices = [];
        var k = 0;
        for(var i = 0; i < 360; i += 10){
            vertices[k] = [Math.cos(i)*this.Radius, Math.sin(i)*this.Radius];
            k++;
        }
        /********************************************/
        /*
        //Print points to screen
        for(var j = 0; j < k; j++){
            document.write(vertices[j] + "<br>");
        }*/
        
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
    
  }
/*
  function main() {
    const c = new Circle(50, 50, 50, 0);
  }

  window.onload = main;*/
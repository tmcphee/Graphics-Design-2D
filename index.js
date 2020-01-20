function main() {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");
    var vSource = "
    attrib vec3 vposition;
    void main(){
      gl_position = vposition;
    }
    ";
    var fs = ;
    /*var vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
       0.5,-0.5,0.0, 
    ];*/
    var vertices =[0.0, 0.5, 0, -0.5, 0.0];

    var incidces = [0, 1, 2];
    // Only continue if WebGL is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
    var bid = gl.createBuffer();
    // Set clear color to black, fully opaque
    gl.bindBuffer(gl.ARRAY_BUFFER, bid);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.bufferData(gl.ARRAY_BUFFER, 5 * gl.GLfloat, vertices, gl.STATIC_DRAW)
    gl.drawArrays(gl.GL_TRIANGLE_FAN, 0, 5);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  
  window.onload = main;
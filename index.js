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
   ' gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);'
    +'}'
    var vshader = createShader(gl, vs, gl.VERTEX_SHADER);
    var fshader = createShader(gl, fs, gl.FRAGMENT_SHADER);

    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);

    
    var vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
       0.5,-0.5,0.0, 
    ];
    //var vertices =[0.0, 0.5, 0.0, -0.5, 0.0, 0.5];

    var incidces = [0, 1, 2];
    // Only continue if WebGL is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
    var bid = gl.createBuffer();
    // Set clear color to black, fully opaque
    gl.bindBuffer(gl.ARRAY_BUFFER, bid);
    gl.bufferData(gl.ARRAY_BUFFER, 3*3, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 3, 0, vertices, 0);

    var vpos = gl.getAttribLocation(program, "vposition");
    gl.enableVertexAttribArray(vpos);
    gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 0, 0)
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

   // gl.drawArrays(gl.GL_TRIANGLE_FAN, 0, 5);
    gl.drawArrays(gl.GL_TRIANGLES, 0, 9);
    // Clear the color buffer with specified clear color
    
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
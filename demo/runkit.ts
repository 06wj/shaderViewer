const shaderCompilerLib = require('shader-compiler');

const options = {
    constants: {}
};

function test(code: string) {
    shaderCompilerLib.compiler.preprocess(code, function(error: string | null, result: string | null) {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log(result);
        }
    }, options);
}

test(`
#define HILO_MAX_PRECISION highp
#define HILO_MAX_VERTEX_PRECISION highp
#define HILO_MAX_FRAGMENT_PRECISION highp
#define HILO_LIGHT_TYPE_NONE 1
#define HILO_SIDE 1028
#define HILO_RECEIVE_SHADOWS 1
#define HILO_CAST_SHADOWS 1
#define HILO_DIFFUSE_MAP 0
#define HILO_HAS_TEXCOORD0 1

#ifdef GL_ES
    precision HILO_MAX_VERTEX_PRECISION float;
#endif

attribute vec3 a_position;
uniform mat4 u_modelViewProjectionMatrix;

void main(void) {
    vec4 pos = vec4(a_position, 1.0);
    gl_Position = u_modelViewProjectionMatrix * pos;
}
`);

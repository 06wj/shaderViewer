(function () {
  const _shaderViewerExtensionsGlobal = window._shaderViewerExtensionsGlobal = {
    programs: {}
  };
  const _shaderViewerOriginGL = window._shaderViewerOriginGL = {};

  const programs = _shaderViewerExtensionsGlobal.programs;
  let uid = 0;

  const SHADER_TYPES = {
    35633: 'VERTEX',
    35632: 'FRAGMENT'
  };

  function getOriginGL(gl) {
    if (gl instanceof WebGLRenderingContext) {
      return _shaderViewerOriginGL.WebGLRenderingContext;
    } else {
      return _shaderViewerOriginGL.WebGL2RenderingContext;
    }
  }

  const injectLinkProgram = function (program) {
    const gl = this;
    const originGL = getOriginGL(gl);
    const programInfo = {};
    let shaderName = 'program';
    try {
      const shaders = originGL.getAttachedShaders.call(gl, program);
      for (let i = 0; i < shaders.length; i++) {
        const shader = shaders[i];
        const source = originGL.getShaderSource.call(gl, shader);
        const type = SHADER_TYPES[originGL.getShaderParameter.call(gl, shader, gl.SHADER_TYPE)];
        programInfo[type] = source;

        let matchRes = source.match(/#define SHADER_NAME\\s+([\\w]+)/);
        if (matchRes && matchRes[1]) {
          shaderName = matchRes[1];
        }
      }

      uid++;
      programs[shaderName + '_' + uid] = programInfo;
    }
    catch (e) {
      console.warn('injectLinkProgramError', e);
    }
  };

  function injectGLFunction(contextName) {
    const WebGLRenderingContext = window[contextName];
    const gl = _shaderViewerOriginGL[contextName] = {};
    if (typeof WebGLRenderingContext === 'function') {
      ["linkProgram", "getShaderSource", "getAttachedShaders", "getShaderParameter"].forEach(function (funcName) {
        gl[funcName] = WebGLRenderingContext.prototype[funcName];
      });

      WebGLRenderingContext.prototype.linkProgram = function (program) {
        injectLinkProgram.call(this, program);
        return gl.linkProgram.call(this, program);
      };
    }
  }

  injectGLFunction('WebGLRenderingContext');
  injectGLFunction('WebGL2RenderingContext');
})();
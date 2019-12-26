// console.log('ShaderViewer init');

function insertTextScript(text) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.text = text;
    insertHeaderNode(script);
    return script;
};

function insertHeaderNode(node) {
    var targets = [document.body, document.head, document.documentElement];
    for (var n = 0; n < targets.length; n++) {
        var target = targets[n];
        if (target) {
            if (target.firstElementChild) {
                target.insertBefore(node, target.firstElementChild);
            } else {
                target.appendChild(node);
            }
            break;
        }
    }
};

function insertScript(url) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send('');
    script.text = xhr.responseText;

    insertHeaderNode(script);
    return script;
};

const code = `
const _shaderViewerExtensionsGlobal = {
    programs:{}
};
const _shaderViewerOriginGL = {};
(function(){
    const programs = _shaderViewerExtensionsGlobal.programs;
    let uid = 0;
    
    const SHADER_TYPES = {
        35633:'VERTEX',
        35632:'FRAGMENT'
    };

    function getOriginGL(gl) {
        if (gl instanceof WebGLRenderingContext) {
            return _shaderViewerOriginGL.WebGLRenderingContext;
        } else {
            return _shaderViewerOriginGL.WebGL2RenderingContext;
        }
    }

    const injectLinkProgram = function(program){
        const gl = this;
        const originGL = getOriginGL(gl);
        const programInfo = {};
        let shaderName = 'program';
        try{
            const shaders = originGL.getAttachedShaders.call(gl, program);
            for(let i = 0;i < shaders.length;i ++){
                const shader = shaders[i];
                const source = originGL.getShaderSource.call(gl, shader);
                const type = SHADER_TYPES[originGL.getShaderParameter.call(gl, shader, gl.SHADER_TYPE)];
                programInfo[type] = source;

                let matchRes = source.match(/#define SHADER_NAME\\s+([\\w]+)/);
                if(matchRes && matchRes[1]){
                    shaderName = matchRes[1];
                }
            }
            
            uid ++;
            programs[shaderName + '_' + uid] = programInfo;
        }
        catch(e){
            console.warn('injectLinkProgramError', e);
        }
    };

    function injectGLFunction(contextName){
        const WebGLRenderingContext = window[contextName];
        const gl = _shaderViewerOriginGL[contextName] = {};
        if(typeof WebGLRenderingContext === 'function'){            
            ["linkProgram", "getShaderSource", "getAttachedShaders", "getShaderParameter"].forEach(function(funcName){
                gl[funcName] = WebGLRenderingContext.prototype[funcName];
            });

            WebGLRenderingContext.prototype.linkProgram = function(program){
                injectLinkProgram.call(this, program);
                return gl.linkProgram.call(this, program);
            };
        }
    }
    
    injectGLFunction('WebGLRenderingContext');
    injectGLFunction('WebGL2RenderingContext');
})();
`;

insertTextScript(code);


window.addEventListener("message", function(e) {
    const data = e.data;
    if (data.type === 'SHADER_VIEWER') {
        chrome.runtime.sendMessage(data, function(response) {

        });
    }
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'SHADER_VIEWER') {
        const data = request.data;
        switch(data.type){
            case 'GET_SHADER':
                insertTextScript(`
                    window.postMessage({
                        type: 'SHADER_VIEWER',
                        data:{
                            type:'OPEN_VIEWER',
                            data:_shaderViewerExtensionsGlobal
                        }
                    }, '*');
                `);
                break;
            case 'LOG_LOG':
                console.log(data.data);
                break;
            case 'LOG_WARN':
                console.warn(data.data);
                break;
        }
    }
});
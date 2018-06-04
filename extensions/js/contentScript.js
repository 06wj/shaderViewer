console.log('ShaderViewer init');
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
const _shaderViewerExtensionsGlobal = {};
(function(){
    const shaders = _shaderViewerExtensionsGlobal.shaders = {};
    let num = 0;

    const injectShaderSource = function(shader, code){
        shaders[num ++] = code;
    };

    if(typeof HTMLCanvasElement === 'function'){
        if(typeof WebGLRenderingContext === 'function'){
            const originShaderSource = WebGLRenderingContext.prototype.shaderSource;
            WebGLRenderingContext.prototype.shaderSource = function(shader, code){
                injectShaderSource.call(this, shader, code);
                return originShaderSource.call(this, shader, code);
            };
        }

        if(typeof WebGL2RenderingContext === 'function'){
            const originShaderSource = WebGL2RenderingContext.prototype.shaderSource;
            WebGL2RenderingContext.prototype.shaderSource = function(shader, code){
                injectShaderSource.call(this, shader, code);
                return originShaderSource.call(this, shader, code);
            };
        }
    }
})();
`;

insertTextScript(code);

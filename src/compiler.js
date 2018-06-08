import jsbeautifier from 'js-beautify';
import glsl from 'glsl-man';
import Prism from '../lib/prism.js';
import {
    Compiler
} from '../lib/compiler';


/**
 * options
 * options.removeUnused
 * options.ignoreConstantError
 */
const compiler = {
    preprocess(code, callback, options = {}) {
        const compiler = new Compiler(Object.assign({
            constants: {
                GL_ES: '1'
            }
        }, options));

        compiler.once('error', function(msg) {
            callback && callback(msg, null);
        });

        compiler.once('success', function(result) {
            callback && callback(null, result);
        });

        compiler.compile(code);
    },
    beautify(code){
        code = code.replace(/#([\w]+)\s/g, '$$$1$$ ').replace(/^\s+/g, '');
        code = jsbeautifier(code).replace(/\$([\w]+)\$/g, '#$1').replace(/\n\n+/g, '\n');
        return code;
    },
    removeUnused(code){
        const ast = glsl.parse(code);

        const funcInfoDict = {};
        const calledFunc = {
            main: true
        };
        const function_declaration = glsl.query.all(ast, glsl.query.selector('function_declaration'));

        function_declaration.forEach(node => {
            const name = node.name;
            const funcInfo = funcInfoDict[name] = funcInfoDict[name] || {
                nodes: [],
                called: []
            };
            funcInfo.nodes.push(node);

            const called = funcInfo.called;
            glsl.query.all(node, glsl.query.selector('function_call')).forEach(calledNode => {
                called.push(calledNode.function_name);
            });
        });

        funcInfoDict.main.called.forEach(name => {
            calledFunc[name] = true;
            const funcInfo = funcInfoDict[name];
            if (funcInfo) {
                funcInfo.called.forEach(name => {
                    calledFunc[name] = true;
                });
            }
        });

        for (name in funcInfoDict) {
            const info = funcInfoDict[name];
            if (info && !calledFunc[name]) {
                info.nodes.forEach(node => {
                    glsl.mod.remove(node);
                });
            }
        }

        return glsl.string(ast);
    },
    hightlight(code){
        code = '\n' + code;

        return Prism.highlight(code, Prism.languages.glsl, 'glsl');
    },
    parse(preCode, callback, options = {}){
        if(preCode){
            this.preprocess(preCode, (error, code) => {
                if(error){
                    code = `//${error}\n` + preCode; 
                }
                else{
                    if(options.removeUnused){
                        code = this.removeUnused(code);
                        console.log(code)
                    }
                    else{
                        code = this.beautify(code);
                    }
                }
                callback(error, code);                
            }, options);
        }
        else{
            callback(null, '');
        }
    },
    parseHighlight(preCode, callback, options){
        this.parse(preCode, (error, code) => {
            const hightlightCode = this.hightlight(code);
            callback(error, hightlightCode);
        }, options);
    }
};

export default compiler;
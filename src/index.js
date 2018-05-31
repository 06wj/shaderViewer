import jsbeautifier from 'js-beautify';
var Prism = require('prismjs');
var loadLanguages = require('prismjs/components/index.js');
loadLanguages(['glsl']);

import {
    Compiler
} from '../lib/compiler';

const app = {
    compiler(code, callback, options = {}) {
        const compiler = new Compiler(Object.assign({
            constants: {
                GL_SL: '1'
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
        return jsbeautifier(code);
    },
    show(){
        const preCode = this.codeElem.value;
        if(preCode){
            this.compiler(preCode, (error, code) => {
                if(error){
                    code = `//${error}\n` + preCode; 
                }
                else{
                    code = this.beautify(code);
                }
                code = '\n' + code;
                const html = Prism.highlight(code, Prism.languages.glsl, 'glsl');
                this.viewElem.innerHTML = html;
            });
        }
        else{
            this.viewElem.innerHTML = '';
        }
    },
    init(){
        const codeElem = this.codeElem = document.getElementById('code');
        const viewElem = this.viewElem = document.getElementById('codeView');
        
        this.bindEvent();
        this.show();
    },
    bindEvent(){
        this.codeElem.oninput = () => {
            this.show();
        };
    }
};

app.init();
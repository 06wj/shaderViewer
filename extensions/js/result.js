import jsbeautifier from 'js-beautify';
var Prism = require('../../lib/prism.js');

import {
    Compiler
} from '../../lib/compiler';

var Parser = require('@nbxx/nb-expr-eval').Parser;
var parser = new Parser({
  operators: {
    // These default to true, but are included to be explicit
    add: true,
    concatenate: true,
    conditional: true,
    divide: true,
    factorial: true,
    multiply: true,
    power: true,
    remainder: true,
    subtract: true,

    // Disable and, or, not, <, ==, !=, etc.
    logical: true,
    comparison: true,

    // The in operator is disabled by default in the current version
    'in': true
  }
});

window.eval = function(str){
    str = str.replace(/\|\|/g, ' or ');
    str = str.replace(/\&\&/g, ' and ');
    console.log(str)
    return parser.evaluate(str);
};

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
        code = code.replace(/#([\w]+)\s/g, '$$$1$$ ');
        code = jsbeautifier(code).replace(/\$([\w]+)\$/g, '#$1').replace(/\n\n+/g, '\n');
        return code;
    },
    show(preCode){
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
        const viewElem = this.viewElem = document.getElementById('codeView');        
        const programs = JSON.parse(decodeURIComponent(location.href.split('?data=')[1]));
        const keys = Object.keys(programs);
        this.show(programs[keys[0]].VERTEX);
    }
};

app.init();
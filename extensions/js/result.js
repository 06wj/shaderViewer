import compiler from '../../src/compiler';
import exprEval from '@nbxx/nb-expr-eval';

const app = {
    show(preCode){
        compiler.parseHighlight(preCode, (error, code) => {
            this.viewElem.innerHTML = code;
        });
    },
    init(){
        this._injectEval();
        const viewElem = this.viewElem = document.getElementById('codeView');        
        const programs = JSON.parse(decodeURIComponent(location.href.split('?data=')[1]));
        const keys = Object.keys(programs);
        this.show(programs[keys[0]].VERTEX);
    },
    _injectEval(){
        const Parser = exprEval.Parser;
        const parser = new Parser({
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
            const result = parser.evaluate(str)
            console.log(str, result);
            return result;
        };
    }
};

app.init();
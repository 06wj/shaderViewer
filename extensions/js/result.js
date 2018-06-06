import compiler from '../../src/compiler';
import exprEval from '@nbxx/nb-expr-eval';

const app = {
    show(elem){
        if(this.currentElem !== elem){
            if(this.currentElem){
                this.currentElem.className = '';
            }

            const name = elem.getAttribute('data-name');
            const program = programs[name];

            compiler.parseHighlight(program.VERTEX, (error, code) => {
                this.viewElemVert.innerHTML = code;
            });

            compiler.parseHighlight(program.FRAGMENT, (error, code) => {
                this.viewElemFrag.innerHTML = code;
            });

            this.currentElem = elem;
            this.currentElem.className = 'active';
        }
    },
    init(){
        this._injectEval();
        const viewElemVert = this.viewElemVert = document.getElementById('codeViewVert');        
        const viewElemFrag = this.viewElemFrag = document.getElementById('codeViewFrag');       
        const programs = window.programs = JSON.parse(decodeURIComponent(location.href.split('?data=')[1]));
        const names = this.names = Object.keys(programs);
        console.log('programs:', programs);
        this.initMenu();
    },
    initMenu(){
        const menuElem = document.getElementById('menu');
        const names = this.names;
        const elems = this.elems = [];
        names.forEach(name => {
            const elem = document.createElement('li');
            elem.innerHTML = name;
            elem.setAttribute('data-name', name);
            elem.addEventListener('click', () => {
                this.show(elem);
            });
            elems.push(elem);
            menuElem.appendChild(elem);
        });

        this.show(elems[0]);
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
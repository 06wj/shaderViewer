import compiler from '../../src/compiler';

const app = {
    show(elem) {
        if (this.currentElem !== elem) {
            if (this.currentElem) {
                this.currentElem.className = '';
            }

            const name = elem.getAttribute('data-name');
            const program = this.programs[name];
            const options = {
                ignoreConstantError: true,
                removeUnused: true
            };
            compiler.parseHighlight(program.VERTEX, (error, code) => {
                this.viewElemVert.innerHTML = code;
            }, options);

            compiler.parseHighlight(program.FRAGMENT, (error, code) => {
                this.viewElemFrag.innerHTML = code;
            }, options);

            this.currentElem = elem;
            this.currentElem.className = 'active';
        }
    },
    init() {
        this.viewElemVert = document.getElementById('codeViewVert');
        this.viewElemFrag = document.getElementById('codeViewFrag');
        const programs = this.programs = JSON.parse(decodeURIComponent(location.href.split('?data=')[1]));
        this.names = Object.keys(programs);
        console.log('programs:', programs);
        this.initMenu();

        window.programs = programs;
    },
    initMenu() {
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
    }
};

app.init();
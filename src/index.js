import compiler from './compiler';

const app = {
    show() {
        const preCode = this.codeElem.value;
        const options = {
            ignoreConstantError:false,
            removeUnused:true
        };

        compiler.parseHighlight(preCode, (error, code) => {
            this.viewElem.innerHTML = code;
        }, options);
    },
    init() {
        const codeElem = this.codeElem = document.getElementById('code');
        const viewElem = this.viewElem = document.getElementById('codeView');

        this.bindEvent();
        this.show();
    },
    bindEvent() {
        this.codeElem.oninput = () => {
            this.show();
        };
    }
};

app.init();
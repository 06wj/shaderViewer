import compiler from './compiler';

const app = {
    show() {
        const preCode = this.codeElem.value;
        const options = {
            ignoreConstantError: false,
            removeUnused: true
        };

        compiler.parseHighlight(preCode, (error, code) => {
            this.viewElem.innerHTML = code;
        }, options);
    },
    init() {
        this.codeElem = document.getElementById('code');
        this.viewElem = document.getElementById('codeView');

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
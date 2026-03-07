import compiler from '../src/compiler';

declare const Prism: any;
declare const formatGLSL: (code: string) => string;

interface App {
    codeElem: HTMLTextAreaElement;
    viewElem: HTMLElement;
    show(): void;
    init(): void;
    bindEvent(): void;
}

const app: App = {
    codeElem: null as any,
    viewElem: null as any,
    
    show() {
        const preCode = this.codeElem.value;
        const options = {
            constants: {}
        };

        compiler.preprocess(preCode, (error: string | null, code: string | null) => {
            if (error) {
                this.viewElem.textContent = `Error: ${error}`;
            } else {
                this.viewElem.textContent = formatGLSL(code || '');
            }
            Prism.highlightElement(this.viewElem);
        }, options);
    },
    
    init() {
        this.codeElem = document.getElementById('code') as HTMLTextAreaElement;
        this.viewElem = document.getElementById('codeView') as HTMLElement;

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

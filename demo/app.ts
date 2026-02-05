// Import the compiler from the built bundle
declare const shaderCompiler: any;

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

        shaderCompiler.compiler.preprocess(preCode, (error: string | null, code: string | null) => {
            if (error) {
                this.viewElem.textContent = `Error: ${error}`;
            } else {
                this.viewElem.textContent = code || '';
            }
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

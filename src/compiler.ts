import jsbeautifier from 'js-beautify';
import Prism from '../lib/prism';
import preprocess from '@shaderfrog/glsl-parser/preprocessor';
import shake from './shake';

interface PreprocessOptions {
    removeUnused?: boolean;
    ignoreConstantError?: boolean;
    constants?: { [key: string]: string };
    [key: string]: any;
}

interface ShakeResult {
    code: string;
    error: any;
    errorText: string;
}

/**
 * options
 * options.removeUnused
 * options.ignoreConstantError
 */
const compiler = {
    preprocess(
        code: string,
        callback: (error: string | null, result: string | null) => void,
        options: PreprocessOptions = {}
    ): void {
        try {
            // Prepare defines for @shaderfrog/glsl-parser
            const defines: { [key: string]: string } = {
                GL_ES: '1',
                ...(options.constants || {})
            };

            // Use @shaderfrog/glsl-parser preprocessor
            const result = preprocess(code, {
                defines,
                // Preserve comments if needed
                preserveComments: false
            });

            callback(null, result);
        } catch (error: any) {
            const errorMessage = error.message || String(error);
            callback(errorMessage, null);
        }
    },
    beautify(code: string): string {
        code = code.replace(/#([\w]+)\s/g, '$$$1$$ ').replace(/^\s+/g, '');
        code = jsbeautifier(code).replace(/\$([\w]+)\$/g, '#$1').replace(/\n\n+/g, '\n');
        return code;
    },
    removeUnused(code: string): ShakeResult {
        const options = {
            function: true,
            struct: true
        };

        return shake.shake(code, options);
    },
    highlight(code: string): string {
        code = '\n' + code;

        return Prism.highlight(code, Prism.languages.glsl, 'glsl');
    },
    parse(
        preCode: string,
        callback: (error: string | null, code: string) => void,
        options: PreprocessOptions = {}
    ): void {
        if (preCode) {
            this.preprocess(preCode, (error, code) => {
                if (error) {
                    code = `//${error}\n` + preCode;
                } else {
                    let needFormat = true;
                    if (options.removeUnused && code) {
                        const shakeRes = this.removeUnused(code);
                        if (shakeRes.error) {
                            code = shakeRes.errorText + code;
                        } else {
                            code = shakeRes.code;
                            needFormat = false;
                        }
                    }

                    if (needFormat && code) {
                        code = this.beautify(code);
                    }
                }

                callback(error, code || '');
            }, options);
        } else {
            callback(null, '');
        }
    },
    parseHighlight(
        preCode: string,
        callback: (error: string | null, code: string) => void,
        options?: PreprocessOptions
    ): void {
        this.parse(preCode, (error, code) => {
            const highlightCode = this.highlight(code);
            callback(error, highlightCode);
        }, options);
    }
};

export default compiler;

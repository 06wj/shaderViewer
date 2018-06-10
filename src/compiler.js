import jsbeautifier from 'js-beautify';
import Prism from '../lib/prism';
import {
    Compiler
} from '../lib/compiler';
import shake from './shake';


/**
 * options
 * options.removeUnused
 * options.ignoreConstantError
 */
const compiler = {
    preprocess(code, callback, options = {}) {
        const compiler = new Compiler(Object.assign({
            constants: {
                GL_ES: '1'
            }
        }, options));

        compiler.once('error', (msg) => {
            callback(msg, null);
        });

        compiler.once('success', (result) => {
            callback(null, result);
        });

        compiler.compile(code);
    },
    beautify(code) {
        code = code.replace(/#([\w]+)\s/g, '$$$1$$ ').replace(/^\s+/g, '');
        code = jsbeautifier(code).replace(/\$([\w]+)\$/g, '#$1').replace(/\n\n+/g, '\n');
        return code;
    },
    removeUnused(code) {
        const options = {
            function: true,
            struct: true
        };

        return shake.shake(code, options);
    },
    hightlight(code) {
        code = '\n' + code;

        return Prism.highlight(code, Prism.languages.glsl, 'glsl');
    },
    parse(preCode, callback, options = {}) {
        if (preCode) {
            this.preprocess(preCode, (error, code) => {
                if (error) {
                    code = `//${error}\n` + preCode;
                } else {
                    let needFormat = true;
                    if (options.removeUnused) {
                        const shakeRes = this.removeUnused(code);
                        if (shakeRes.error) {
                            code = shakeRes.errorText + code;
                        } else {
                            code = shakeRes.code;
                            needFormat = false;
                        }
                    }

                    if (needFormat) {
                        code = this.beautify(code);
                    }
                }

                callback(error, code);
            }, options);
        } else {
            callback(null, '');
        }
    },
    parseHighlight(preCode, callback, options) {
        this.parse(preCode, (error, code) => {
            const hightlightCode = this.hightlight(code);
            callback(error, hightlightCode);
        }, options);
    }
};

export default compiler;
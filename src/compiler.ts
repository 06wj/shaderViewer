import preprocess from '@shaderfrog/glsl-parser/preprocessor';

interface PreprocessOptions {
    constants?: { [key: string]: string };
    [key: string]: any;
}

/**
 * GLSL Shader Preprocessor
 * Only provides preprocessing functionality using @shaderfrog/glsl-parser
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
    }
};

export default compiler;

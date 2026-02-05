interface PreprocessOptions {
    removeUnused?: boolean;
    ignoreConstantError?: boolean;
    constants?: {
        [key: string]: string;
    };
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
declare const compiler: {
    preprocess(code: string, callback: (error: string | null, result: string | null) => void, options?: PreprocessOptions): void;
    beautify(code: string): string;
    removeUnused(code: string): ShakeResult;
    hightlight(code: string): string;
    parse(preCode: string, callback: (error: string | null, code: string) => void, options?: PreprocessOptions): void;
    parseHighlight(preCode: string, callback: (error: string | null, code: string) => void, options?: PreprocessOptions): void;
};
export default compiler;

interface ShakeOption {
    function?: boolean;
    struct?: boolean;
}
interface ShakeResult {
    code: string;
    error: any;
    errorText: string;
}
interface StructInfo {
    node: any;
    members: {
        [key: string]: boolean;
    };
    name: string;
}
declare const shake: {
    /**
     * shake
     * @param  {String} code
     * @param  {Object} option
     * @param  {Boolean} option.function
     * @param  {Boolean} option.struct
     * @return {Object}  { code, error, errorText }
     */
    shake(code: string, option?: ShakeOption): ShakeResult;
    _shakeFunction(ast: any): void;
    _shakeStruct(ast: any): void;
    _getMembers(structInfoDict: {
        [key: string]: StructInfo;
    }, name: string): {
        [key: string]: boolean;
    };
};
export default shake;

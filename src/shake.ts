import glsl from 'glsl-man';

interface ShakeOption {
    function?: boolean;
    struct?: boolean;
}

interface ShakeResult {
    code: string;
    error: any;
    errorText: string;
}

interface FuncInfo {
    nodes: any[];
    called: string[];
    name: string;
}

interface StructInfo {
    node: any;
    members: { [key: string]: boolean };
    name: string;
}

const shake = {
    /**
     * shake
     * @param  {String} code 
     * @param  {Object} option
     * @param  {Boolean} option.function
     * @param  {Boolean} option.struct
     * @return {Object}  { code, error, errorText }
     */
    shake(code: string, option: ShakeOption = {}): ShakeResult {
        try {
            const ast = glsl.parse(code);
            if (option.function) {
                this._shakeFunction(ast);
            }

            if (option.struct) {
                this._shakeStruct(ast);
            }

            return {
                code: glsl.string(ast),
                error: null,
                errorText: ''
            };
        } catch (e: any) {
            console.warn('shakeError:', e);
            let location = '';
            if (e.location) {
                location = `@line:${e.location.start.line},column:${e.location.start.column}`;
            }

            return {
                code,
                error: e,
                errorText: `// ShakeError-${e.name}: ${location}\n// ${e.message}\n`
            };
        }
    },
    _shakeFunction(ast: any): void {
        const funcInfoDict: { [key: string]: FuncInfo } = {};
        const calledFunc: { [key: string]: boolean } = {};

        glsl.query.all(ast, glsl.query.selector('function_declaration')).forEach((functionDefNode: any) => {
            const name = functionDefNode.name;
            const funcInfo = funcInfoDict[name] = funcInfoDict[name] || {
                nodes: [],
                called: [],
                name
            };
            funcInfo.nodes.push(functionDefNode);

            const called = funcInfo.called;
            glsl.query.all(functionDefNode, glsl.query.selector('function_call')).forEach((functionCallNode: any) => {
                called.push(functionCallNode.function_name);
            });
        });


        function markCalled(name: string): void {
            const funcInfo = funcInfoDict[name];
            if (funcInfo) {
                const isCalled = calledFunc[name];
                if (!isCalled) {
                    calledFunc[name] = true;
                    funcInfo.called.forEach(markCalled);
                }
            }
        }


        const mainFuncInfo = funcInfoDict.main;
        if (mainFuncInfo) {
            markCalled('main');

            for (let name in funcInfoDict) {
                const info = funcInfoDict[name];
                if (info && !calledFunc[name]) {
                    info.nodes.forEach((node: any) => {
                        glsl.mod.remove(node);
                    });
                }
            }
        }
    },
    _shakeStruct(ast: any): void {
        const structInfoDict: { [key: string]: StructInfo } = {};
        glsl.query.all(ast, glsl.query.selector('struct_definition')).forEach((structDefNode: any) => {
            const name = structDefNode.name;

            const structInfo = structInfoDict[name] = {
                node: structDefNode,
                members: {},
                name
            };

            const members = structInfo.members;

            glsl.query.all(structDefNode, glsl.query.selector('declarator')).forEach((declaratorNode: any) => {
                const typeAttribute = declaratorNode.typeAttribute;
                if (typeAttribute) {
                    members[typeAttribute.name] = true;
                }
            });
        });

        const usedTypeDict: { [key: string]: boolean } = {};

        const globalDeclaratorResult = glsl.query.all(ast, glsl.query.selector('root > declarator[typeAttribute]'));
        const functionDeclaratorResult = glsl.query.all(ast, glsl.query.selector('function_declaration declarator[typeAttribute]'));
        const parameterResult = glsl.query.all(ast, glsl.query.selector('function_declaration > parameter'));

        globalDeclaratorResult.concat(functionDeclaratorResult).forEach((declaratorNode: any) => {
            const typeAttribute = declaratorNode.typeAttribute;
            const name = typeAttribute.name;
            usedTypeDict[name] = true;
            const members = this._getMembers(structInfoDict, name);
            for (let name in members) {
                usedTypeDict[name] = true;
            }
        });

        parameterResult.forEach((parameterNode: any) => {
            const typeName = parameterNode.type_name;
            usedTypeDict[typeName] = true;
            const members = this._getMembers(structInfoDict, typeName);
            for (let name in members) {
                usedTypeDict[name] = true;
            }
        });

        for (let name in structInfoDict) {
            const structInfo = structInfoDict[name];
            if (structInfo && !usedTypeDict[name]) {
                glsl.mod.remove(structInfo.node);
            }
        }
    },
    _getMembers(structInfoDict: { [key: string]: StructInfo }, name: string): { [key: string]: boolean } {
        const structInfo = structInfoDict[name];
        if (structInfo) {
            const members = structInfo.members;
            for (let name in members) {
                Object.assign(members, this._getMembers(structInfoDict, name));
            }
            return members;
        }

        return {};
    }
};

export default shake;
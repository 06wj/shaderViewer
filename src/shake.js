import glsl from 'glsl-man';

const shake = {
    /**
     * shake
     * @param  {String} code 
     * @param  {Object} option
     * @param  {Boolean} option.function
     * @param  {Boolean} option.struct
     * @return {Object}  { code, error, errorText }
     */
    shake(code, option = {}) {
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
        } catch (e) {
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
    _shakeFunction(ast) {
        const funcInfoDict = {};
        const calledFunc = {
            main: true
        };

        glsl.query.all(ast, glsl.query.selector('function_declaration')).forEach(functionDefNode => {
            const name = functionDefNode.name;
            const funcInfo = funcInfoDict[name] = funcInfoDict[name] || {
                nodes: [],
                called: [],
                name
            };
            funcInfo.nodes.push(functionDefNode);

            const called = funcInfo.called;
            glsl.query.all(functionDefNode, glsl.query.selector('function_call')).forEach(functionCallNode => {
                called.push(functionCallNode.function_name);
            });
        });

        const mainFuncInfo = funcInfoDict.main;
        if (mainFuncInfo) {
            mainFuncInfo.called.forEach(name => {
                calledFunc[name] = true;
                const funcInfo = funcInfoDict[name];
                if (funcInfo) {
                    funcInfo.called.forEach(name => {
                        calledFunc[name] = true;
                    });
                }
            });

            for (let name in funcInfoDict) {
                const info = funcInfoDict[name];
                if (info && !calledFunc[name]) {
                    info.nodes.forEach(node => {
                        glsl.mod.remove(node);
                    });
                }
            }
        }
    },
    _shakeStruct(ast) {
        const structInfoDict = {};
        glsl.query.all(ast, glsl.query.selector('struct_definition')).forEach(structDefNode => {
            const name = structDefNode.name;

            const structInfo = structInfoDict[name] = {
                node: structDefNode,
                members: {},
                name
            };

            const members = structInfo.members;

            glsl.query.all(structDefNode, glsl.query.selector('declarator')).forEach(declaratorNode => {
                const typeAttribute = declaratorNode.typeAttribute;
                if (typeAttribute) {
                    members[typeAttribute.name] = true;
                }
            });
        });

        const usedTypeDict = {};

        const globalDeclaratorResult = glsl.query.all(ast, glsl.query.selector('root > declarator[typeAttribute]'));
        const functionDeclaratorResult = glsl.query.all(ast, glsl.query.selector('function_declaration declarator[typeAttribute]'));
        const parameterResult = glsl.query.all(ast, glsl.query.selector('function_declaration > parameter'));

        globalDeclaratorResult.concat(functionDeclaratorResult).forEach(declaratorNode => {
            const typeAttribute = declaratorNode.typeAttribute;
            const name = typeAttribute.name;
            usedTypeDict[name] = true;
            const members = this._getMembers(structInfoDict, name);
            for (let name in members) {
                usedTypeDict[name] = true;
            }
        });

        parameterResult.forEach(parameterNode => {
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
    _getMembers(structInfoDict, name) {
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
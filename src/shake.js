import glsl from 'glsl-man';

const shake = {
    shake(code, option = {}) {
        try{
            const ast = glsl.parse(code);
            if (option.function) {
                this._shakeFunction(ast);
            }

            if (option.struct) {
                this._shakeStruct(ast);
            }

            return glsl.string(ast);
        }
        catch(e){
            console.warn('shakeError:', e);

            return `// ${e.name}: @line:${e.location.start.line},column:${e.location.start.column}\n// ${e.message}\n${code}`;
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
        if(mainFuncInfo){
            mainFuncInfo.called.forEach(name => {
                calledFunc[name] = true;
                const funcInfo = funcInfoDict[name];
                if (funcInfo) {
                    funcInfo.called.forEach(name => {
                        calledFunc[name] = true;
                    });
                }
            });
        }

        for (name in funcInfoDict) {
            const info = funcInfoDict[name];
            if (info && !calledFunc[name]) {
                info.nodes.forEach(node => {
                    glsl.mod.remove(node);
                });
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
            for(let name in members){
                usedTypeDict[name] = true;
            }
        });

        parameterResult.forEach(parameterNode => {
            const type_name = parameterNode.type_name;
            usedTypeDict[type_name] = true;
            const members = this._getMembers(structInfoDict, type_name);
            for(let name in members){
                usedTypeDict[name] = true;
            }
        });

        for(let name in structInfoDict){
            const structInfo = structInfoDict[name];
            if(structInfo && !usedTypeDict[name]){
                glsl.mod.remove(structInfo.node);
            }
        }
    },
    _getMembers(structInfoDict, name){
        const structInfo = structInfoDict[name];
        if(structInfo){
            const members = structInfo.members; 
            for(let name in members){
                Object.assign(members, this._getMembers(structInfoDict, name));
            }
            return members;
        }

        return {};
    }
};

export default shake;
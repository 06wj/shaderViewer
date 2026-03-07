/**
 * Simple GLSL code formatter / beautifier.
 * Formats preprocessed GLSL shader code with consistent indentation.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.formatGLSL = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    /**
     * Format GLSL source code with proper indentation and line breaks.
     * @param {string} code - The GLSL source code to format.
     * @returns {string} The formatted GLSL source code.
     */
    function formatGLSL(code) {
        if (!code) return code;

        var INDENT = '    ';

        var tokens = tokenize(code);
        var lines = [];
        var indentLevel = 0;
        var currentLine = '';

        function getIndent() {
            return INDENT.repeat(indentLevel);
        }

        function flushLine() {
            var trimmed = currentLine.trim();
            if (trimmed) {
                lines.push(getIndent() + trimmed);
            }
            currentLine = '';
        }

        for (var i = 0; i < tokens.length; i++) {
            var tok = tokens[i];

            if (tok.type === 'directive') {
                flushLine();
                lines.push(tok.value);

            } else if (tok.type === 'line_comment') {
                flushLine();
                lines.push(getIndent() + tok.value);

            } else if (tok.type === 'block_comment') {
                flushLine();
                // Preserve block comment lines, re-indenting each line
                var commentLines = tok.value.split('\n');
                var baseIndent = getIndent();
                for (var c = 0; c < commentLines.length; c++) {
                    lines.push(baseIndent + commentLines[c].trim());
                }

            } else if (tok.type === 'open_brace') {
                if (currentLine.trim()) {
                    lines.push(getIndent() + currentLine.trim() + ' {');
                } else {
                    lines.push(getIndent() + '{');
                }
                currentLine = '';
                indentLevel++;

            } else if (tok.type === 'close_brace') {
                flushLine();
                indentLevel = Math.max(0, indentLevel - 1);
                lines.push(getIndent() + '}');

            } else if (tok.type === 'semicolon') {
                lines.push(getIndent() + currentLine.trim() + ';');
                currentLine = '';

            } else {
                // Regular code token
                if (currentLine) {
                    currentLine += ' ' + tok.value;
                } else {
                    currentLine = tok.value;
                }
            }
        }

        flushLine();

        // Remove leading/trailing blank lines, then collapse multiple blank lines
        var result = lines.join('\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        return result;
    }

    /**
     * Tokenize GLSL source code into a sequence of typed tokens.
     * @param {string} code
     * @returns {Array<{type: string, value: string}>}
     */
    function tokenize(code) {
        var tokens = [];
        var pos = 0;
        var len = code.length;

        while (pos < len) {
            var ch = code[pos];
            var next = pos + 1 < len ? code[pos + 1] : '';

            // Whitespace (skip, but preserve as separator)
            if (ch === ' ' || ch === '\t' || ch === '\r') {
                pos++;
                continue;
            }

            if (ch === '\n') {
                pos++;
                continue;
            }

            // Line comment
            if (ch === '/' && next === '/') {
                var end = code.indexOf('\n', pos);
                if (end === -1) end = len;
                tokens.push({ type: 'line_comment', value: code.slice(pos, end) });
                pos = end;
                continue;
            }

            // Block comment
            if (ch === '/' && next === '*') {
                var end2 = code.indexOf('*/', pos + 2);
                if (end2 === -1) end2 = len - 2;
                tokens.push({ type: 'block_comment', value: code.slice(pos, end2 + 2) });
                pos = end2 + 2;
                continue;
            }

            // Preprocessor directive
            if (ch === '#') {
                var end3 = pos;
                while (end3 < len) {
                    if (code[end3] === '\\' && end3 + 1 < len && code[end3 + 1] === '\n') {
                        end3 += 2; // line continuation
                    } else if (code[end3] === '\n') {
                        break;
                    } else {
                        end3++;
                    }
                }
                tokens.push({ type: 'directive', value: code.slice(pos, end3).trim() });
                pos = end3;
                continue;
            }

            if (ch === '{') {
                tokens.push({ type: 'open_brace', value: '{' });
                pos++;
                continue;
            }

            if (ch === '}') {
                tokens.push({ type: 'close_brace', value: '}' });
                pos++;
                continue;
            }

            if (ch === ';') {
                tokens.push({ type: 'semicolon', value: ';' });
                pos++;
                continue;
            }

            // Gather remaining characters until a delimiter
            var t = '';
            while (pos < len) {
                var c = code[pos];
                if (c === '{' || c === '}' || c === ';' || c === '\n' || c === '\r' ||
                    (c === '/' && pos + 1 < len && (code[pos + 1] === '/' || code[pos + 1] === '*')) ||
                    c === '#') {
                    break;
                }
                t += c;
                pos++;
            }
            if (t.trim()) {
                tokens.push({ type: 'token', value: t.trim() });
            }
        }

        return tokens;
    }

    return formatGLSL;
}));

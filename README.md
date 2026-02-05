# ShaderViewer [![npm][npm-image]][npm-url] [![runkit][runkit-image]][runkit-url]
Preprocess GLSL shader code using @shaderfrog/glsl-parser.

### Feature
* Preprocess directives: `#define`, `#if`, `#ifdef`, `#elif`, `#else`, `#endif`, `#if defined`, etc.
* Macro expansion with function-like macros
* Conditional compilation
* Built with TypeScript

### Chrome Extensions
[Chrome Extensions.crx](https://github.com/06wj/shaderViewer/blob/dev/extensions.crx?raw=true)  
This extension can automatically detect the shader of the current page, then preprocess and show it in the panel.

### Online Demo
[https://06wj.github.io/shaderViewer/demo/](https://06wj.github.io/shaderViewer/demo/)

![](https://gw.alicdn.com/tfs/TB1lkmzuL1TBuNjy0FjXXajyXXa-1170-1254.png_600x600.jpg)

### Module Usage

#### Import the compiler
```javascript
const { compiler } = require('shader-compiler');
```

#### Preprocess shader code
```javascript
const options = {
    constants: {
        MY_DEFINE: '1',
        MAX_LIGHTS: '4'
    }
};

compiler.preprocess(code, function(error, result) {
    if (error) {
        console.error('Preprocessing error:', error);
    } else {
        console.log('Preprocessed code:', result);
    }
}, options);
```

#### Example
```javascript
const { compiler } = require('shader-compiler');

const shaderCode = `
#define PI 3.14159
#ifdef GL_ES
precision mediump float;
#endif

void main() {
    float angle = PI * 2.0;
    gl_FragColor = vec4(1.0);
}
`;

compiler.preprocess(shaderCode, (error, result) => {
    console.log(result);
});
```

### API

#### `compiler.preprocess(code, callback, options)`

Preprocesses GLSL shader code.

**Parameters:**
- `code` (string): The GLSL shader source code to preprocess
- `callback` (function): Callback function `(error, result) => void`
  - `error` (string|null): Error message if preprocessing failed, null otherwise
  - `result` (string|null): Preprocessed code if successful, null otherwise
- `options` (object): Optional preprocessing options
  - `constants` (object): Custom defines/macros, e.g., `{ MY_DEFINE: '1' }`

### Dev
* Run `npm install` to install dependencies
* Run `npm run dev` to watch and develop
* Run `npm run build` to build

### License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[npm-image]: https://img.shields.io/npm/v/shader-compiler.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/shader-compiler
[runkit-image]: https://badge.runkitcdn.com/shader-compiler.svg
[runkit-url]: https://npm.runkit.com/shader-compiler

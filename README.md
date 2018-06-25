# ShaderViewer
Preprocess and format the shader code.

### Feature
* Preprocess directives,  ```#define```, ```#if```, ```#elif```, ```#endif```, ```#if defined``` ... 
* Remove unused function, struct...
* Format

### Chrome Extensions
[chrome extensions.crx](https://github.com/06wj/shaderViewer/blob/dev/extensions.crx?raw=true)

### Online Demo
[https://06wj.github.io/shaderViewer/demo/](https://06wj.github.io/shaderViewer/demo/)

![](https://gw.alicdn.com/tfs/TB1lkmzuL1TBuNjy0FjXXajyXXa-1170-1254.png_600x600.jpg)

### Module Usage
* import  modules
  ```
  const compiler = require('shader-compiler').compiler;
  const shake = require('shader-compiler').shake;
  ```

* set the ```options```
  ```
  const options = {
      removeUnused: true,
      ignoreConstantError: true
  };
  ```

* preprocess the code
  ```
  compiler.preprocess(code, function(error, result){  

  }, options);
  ```

* parse: preprocess => shake => format => result
  ```
  compiler.parse(code, function(error, result){  

  }, options);
  ```

* parseHighlight: preprocess => shake => format => hightlight => result

  ```
  compiler.parseHighlight(code, function(error, result){
  
  }, options);
  ```

* shake the code( code must be preprocessed )
  ```
  shake.shake(code, {function:true, struct:true});
  ```

### Dev
* run `npm install` to install dependencies
* run `npm run dev` to watch and develop
* run `npm run build` to build

### License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

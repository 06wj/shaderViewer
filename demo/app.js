var compiler = shaderCompiler.compiler;
var app = {
    show: function() {
        var preCode = this.codeElem.value;
        var options = {
            ignoreConstantError: false,
            removeUnused: true
        };

        var that = this;
        compiler.parseHighlight(preCode, function(error, code) {
            that.viewElem.innerHTML = code;
        }, options);
    },
    init: function() {
        this.codeElem = document.getElementById('code');
        this.viewElem = document.getElementById('codeView');

        this.bindEvent();
        this.show();
    },
    bindEvent: function() {
        var that = this;
        this.codeElem.oninput = function() {
            that.show();
        };
    }
};

app.init();

// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort
var e;e||(e=typeof Module !== 'undefined' ? Module : {});
e.onRuntimeInitialized=function(){function a(h,n){this.Ma=h;this.db=n;this.La=1;this.cb=[]}function b(h){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=h){var n=this.filename,p=n?k("//"+n):"/";n=ba(!0,!0);p=ca(p,(void 0!==n?n:438)&4095|32768,0);if(h){if("string"===typeof h){for(var t=Array(h.length),D=0,N=h.length;D<N;++D)t[D]=h.charCodeAt(D);h=t}da(p,n|146);t=m(p,"w");ea(t,h,0,h.length,0,void 0);fa(t);da(p,n)}}this.handleError(u(this.filename,g));this.db=q(g,"i32");rc(this.db);this.ab=
{};this.Sa={}}function c(h){this.worker=new Worker(h);this.worker.onmessage=function(n){var p=d[n.data.id];delete d[n.data.id];p&&p(n.data)}}var d={},f=0,g=v(4),l=e.cwrap,u=l("sqlite3_open","number",["string","number"]),w=l("sqlite3_close_v2","number",["number"]),r=l("sqlite3_exec","number",["number","string","number","number","number"]),E=l("sqlite3_changes","number",["number"]),H=l("sqlite3_prepare_v2","number",["number","string","number","number","number"]),aa=l("sqlite3_prepare_v2","number",["number",
"number","number","number","number"]),B=l("sqlite3_bind_text","number",["number","number","number","number","number"]),ma=l("sqlite3_bind_blob","number",["number","number","number","number","number"]),na=l("sqlite3_bind_double","number",["number","number","number"]),sc=l("sqlite3_bind_int","number",["number","number","number"]),tc=l("sqlite3_bind_parameter_index","number",["number","string"]),uc=l("sqlite3_step","number",["number"]),vc=l("sqlite3_errmsg","string",["number"]),wb=l("sqlite3_data_count",
"number",["number"]),wc=l("sqlite3_column_double","number",["number","number"]),xc=l("sqlite3_column_text","string",["number","number"]),yc=l("sqlite3_column_blob","number",["number","number"]),zc=l("sqlite3_column_bytes","number",["number","number"]),Ac=l("sqlite3_column_type","number",["number","number"]),Bc=l("sqlite3_column_name","string",["number","number"]),Cc=l("sqlite3_reset","number",["number"]),Dc=l("sqlite3_clear_bindings","number",["number"]),Ec=l("sqlite3_finalize","number",["number"]),
Fc=l("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Gc=l("sqlite3_value_type","number",["number"]),Hc=l("sqlite3_value_bytes","number",["number"]),Ic=l("sqlite3_value_text","string",["number"]),Jc=l("sqlite3_value_blob","number",["number"]),Kc=l("sqlite3_value_double","number",["number"]),Lc=l("sqlite3_result_double","",["number","number"]),xb=l("sqlite3_result_null","",["number"]),Mc=l("sqlite3_result_text","",["number","string",
"number","number"]),Nc=l("sqlite3_result_blob","",["number","number","number","number"]),Oc=l("sqlite3_result_int","",["number","number"]),yb=l("sqlite3_result_error","",["number","string","number"]),rc=l("RegisterExtensionFunctions","number",["number"]);a.prototype.bind=function(h){if(!this.Ma)throw"Statement closed";this.reset();return Array.isArray(h)?this.rb(h):null!=h&&"object"===typeof h?this.sb(h):!0};a.prototype.step=function(){if(!this.Ma)throw"Statement closed";this.La=1;var h=uc(this.Ma);
switch(h){case 100:return!0;case 101:return!1;default:throw this.db.handleError(h);}};a.prototype.yb=function(h){null==h&&(h=this.La,this.La+=1);return wc(this.Ma,h)};a.prototype.zb=function(h){null==h&&(h=this.La,this.La+=1);return xc(this.Ma,h)};a.prototype.getBlob=function(h){null==h&&(h=this.La,this.La+=1);var n=zc(this.Ma,h);var p=yc(this.Ma,h);var t=new Uint8Array(n);for(h=0;h<n;)t[h]=x[p+h],h+=1;return t};a.prototype.get=function(h){var n;null!=h&&this.bind(h)&&this.step();var p=[];h=0;for(n=
wb(this.Ma);h<n;){switch(Ac(this.Ma,h)){case 1:case 2:p.push(this.yb(h));break;case 3:p.push(this.zb(h));break;case 4:p.push(this.getBlob(h));break;default:p.push(null)}h+=1}return p};a.prototype.getColumnNames=function(){var h;var n=[];var p=0;for(h=wb(this.Ma);p<h;)n.push(Bc(this.Ma,p)),p+=1;return n};a.prototype.getAsObject=function(h){var n;var p=this.get(h);var t=this.getColumnNames();var D={};h=0;for(n=t.length;h<n;){var N=t[h];D[N]=p[h];h+=1}return D};a.prototype.run=function(h){null!=h&&this.bind(h);
this.step();return this.reset()};a.prototype.vb=function(h,n){null==n&&(n=this.La,this.La+=1);h=ha(h);var p=ia(h);this.cb.push(p);this.db.handleError(B(this.Ma,n,p,h.length-1,0))};a.prototype.qb=function(h,n){null==n&&(n=this.La,this.La+=1);var p=ia(h);this.cb.push(p);this.db.handleError(ma(this.Ma,n,p,h.length,0))};a.prototype.ub=function(h,n){null==n&&(n=this.La,this.La+=1);this.db.handleError((h===(h|0)?sc:na)(this.Ma,n,h))};a.prototype.tb=function(h){null==h&&(h=this.La,this.La+=1);ma(this.Ma,
h,0,0,0)};a.prototype.jb=function(h,n){null==n&&(n=this.La,this.La+=1);switch(typeof h){case "string":this.vb(h,n);return;case "number":case "boolean":this.ub(h+0,n);return;case "object":if(null===h){this.tb(n);return}if(null!=h.length){this.qb(h,n);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+h+").";};a.prototype.sb=function(h){var n=this;Object.keys(h).forEach(function(p){var t=tc(n.Ma,p);0!==t&&n.jb(h[p],t)});return!0};a.prototype.rb=function(h){var n;for(n=0;n<h.length;)this.jb(h[n],
n+1),n+=1;return!0};a.prototype.reset=function(){return 0===Dc(this.Ma)&&0===Cc(this.Ma)};a.prototype.freemem=function(){for(var h;void 0!==(h=this.cb.pop());)ja(h)};a.prototype.free=function(){var h=0===Ec(this.Ma);delete this.db.ab[this.Ma];this.Ma=0;return h};b.prototype.run=function(h,n){if(!this.db)throw"Database closed";if(n){h=this.prepare(h,n);try{h.step()}finally{h.free()}}else this.handleError(r(this.db,h,0,0,g));return this};b.prototype.exec=function(h,n){if(!this.db)throw"Database closed";
var p=ka();try{var t=la(h)+1,D=v(t);oa(h,x,D,t);var N=D;var C=v(4);for(h=[];0!==q(N,"i8");){qa(g);qa(C);this.handleError(aa(this.db,N,-1,g,C));var pa=q(g,"i32");N=q(C,"i32");if(0!==pa){var T=null;var A=new a(pa,this);for(null!=n&&A.bind(n);A.step();)null===T&&(T={columns:A.getColumnNames(),values:[]},h.push(T)),T.values.push(A.get());A.free()}}return h}catch(O){throw A&&A.free(),O;}finally{ra(p)}};b.prototype.each=function(h,n,p,t){"function"===typeof n&&(t=p,p=n,n=void 0);h=this.prepare(h,n);try{for(;h.step();)p(h.getAsObject())}finally{h.free()}if("function"===
typeof t)return t()};b.prototype.prepare=function(h,n){qa(g);this.handleError(H(this.db,h,-1,g,0));h=q(g,"i32");if(0===h)throw"Nothing to prepare";var p=new a(h,this);null!=n&&p.bind(n);return this.ab[h]=p};b.prototype["export"]=function(){Object.values(this.ab).forEach(function(n){n.free()});Object.values(this.Sa).forEach(sa);this.Sa={};this.handleError(w(this.db));var h=ta(this.filename);this.handleError(u(this.filename,g));this.db=q(g,"i32");return h};b.prototype.close=function(){Object.values(this.ab).forEach(function(h){h.free()});
Object.values(this.Sa).forEach(sa);this.Sa={};this.handleError(w(this.db));ua("/"+this.filename);this.db=null};b.prototype.handleError=function(h){if(0===h)return null;h=vc(this.db);throw Error(h);};b.prototype.getRowsModified=function(){return E(this.db)};b.prototype.create_function=function(h,n){Object.prototype.hasOwnProperty.call(this.Sa,h)&&(va.push(this.Sa[h]),delete this.Sa[h]);var p=wa(function(t,D,N){for(var C,pa=[],T=0;T<D;T+=1){var A=q(N+4*T,"i32"),O=Gc(A);if(1===O||2===O)A=Kc(A);else if(3===
O)A=Ic(A);else if(4===O){O=A;A=Hc(O);O=Jc(O);for(var Cb=new Uint8Array(A),Fa=0;Fa<A;Fa+=1)Cb[Fa]=x[O+Fa];A=Cb}else A=null;pa.push(A)}try{C=n.apply(null,pa)}catch(Rc){yb(t,Rc,-1);return}switch(typeof C){case "boolean":Oc(t,C?1:0);break;case "number":Lc(t,C);break;case "string":Mc(t,C,-1,-1);break;case "object":null===C?xb(t):null!=C.length?(D=ia(C),Nc(t,D,C.length,-1),ja(D)):yb(t,"Wrong API use : tried to return a value of an unknown type ("+C+").",-1);break;default:xb(t)}});this.Sa[h]=p;this.handleError(Fc(this.db,
h,n.length,1,0,p,0,0,0));return this};c.prototype.postMessage=function(h){var n;var p=this;var t=Error();return new Promise(function(D,N){n=function(C){C.error?(t.message=C.error,t.stack=C.error+"\n"+t.stack,N(t)):D(C)};f=f+1|0;h.id=f;d[h.id]=n;p.worker.postMessage(h)})};e.Database=b;e.Worker=c};var xa={},y;for(y in e)e.hasOwnProperty(y)&&(xa[y]=e[y]);var ya="./this.program",za=!1,Aa=!1,Ba=!1,Ca=!1;za="object"===typeof window;Aa="function"===typeof importScripts;
Ba="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;Ca=!za&&!Ba&&!Aa;var z="",Da,Ea,Ga,Ha;
if(Ba)z=Aa?require("path").dirname(z)+"/":__dirname+"/",Da=function(a,b){Ga||(Ga=require("fs"));Ha||(Ha=require("path"));a=Ha.normalize(a);return Ga.readFileSync(a,b?null:"utf8")},Ea=function(a){a=Da(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},1<process.argv.length&&(ya=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),"undefined"!==typeof module&&(module.exports=e),process.on("unhandledRejection",F),e.inspect=function(){return"[Emscripten Module object]"};else if(Ca)"undefined"!=
typeof read&&(Da=function(a){return read(a)}),Ea=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");assert("object"===typeof a);return a},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(za||Aa)Aa?z=self.location.href:document.currentScript&&(z=document.currentScript.src),z=0!==z.indexOf("blob:")?z.substr(0,z.lastIndexOf("/")+
1):"",Da=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},Aa&&(Ea=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)});var Ia=e.print||console.log.bind(console),G=e.printErr||console.warn.bind(console);for(y in xa)xa.hasOwnProperty(y)&&(e[y]=xa[y]);xa=null;e.thisProgram&&(ya=e.thisProgram);function Ja(a){var b=I[Ka>>2];a=b+a+15&-16;a>J.length&&F();I[Ka>>2]=a;return b}
var va=[];
function wa(a){if(va.length)var b=va.pop();else{b=La.length;try{La.grow(1)}catch(g){if(!(g instanceof RangeError))throw g;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}}try{La.set(b,a)}catch(g){if(!(g instanceof TypeError))throw g;assert(!0,"Missing signature argument to addFunction");if("function"===typeof WebAssembly.Function){for(var c={i:"i32",j:"i64",f:"f32",d:"f64"},d={parameters:[],results:[]},f=1;4>f;++f)d.parameters.push(c["viii"[f]]);a=new WebAssembly.Function(d,a)}else{c=[1,
0,1,96];d={i:127,j:126,f:125,d:124};c.push(3);for(f=0;3>f;++f)c.push(d["iii"[f]]);c.push(0);c[1]=c.length-2;f=new Uint8Array([0,97,115,109,1,0,0,0].concat(c,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));f=new WebAssembly.Module(f);a=(new WebAssembly.Instance(f,{e:{f:a}})).exports.f}La.set(b,a)}return b}function sa(a){va.push(a)}var Ma;e.wasmBinary&&(Ma=e.wasmBinary);var noExitRuntime;e.noExitRuntime&&(noExitRuntime=e.noExitRuntime);"object"!==typeof WebAssembly&&G("no native wasm support detected");
function qa(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":x[a>>0]=0;break;case "i8":x[a>>0]=0;break;case "i16":Na[a>>1]=0;break;case "i32":I[a>>2]=0;break;case "i64":K=[0,(L=0,1<=+Oa(L)?0<L?(Pa(+Qa(L/4294967296),4294967295)|0)>>>0:~~+Ra((L-+(~~L>>>0))/4294967296)>>>0:0)];I[a>>2]=K[0];I[a+4>>2]=K[1];break;case "float":Sa[a>>2]=0;break;case "double":Ta[a>>3]=0;break;default:F("invalid type for setValue: "+b)}}
function q(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return x[a>>0];case "i8":return x[a>>0];case "i16":return Na[a>>1];case "i32":return I[a>>2];case "i64":return I[a>>2];case "float":return Sa[a>>2];case "double":return Ta[a>>3];default:F("invalid type for getValue: "+b)}return null}var Ua,La=new WebAssembly.Table({initial:384,element:"anyfunc"}),Va=!1;function assert(a,b){a||F("Assertion failed: "+b)}
function Wa(a){var b=e["_"+a];assert(b,"Cannot call unknown function "+a+", make sure it is exported");return b}
function Xa(a,b,c,d){var f={string:function(r){var E=0;if(null!==r&&void 0!==r&&0!==r){var H=(r.length<<2)+1;E=v(H);oa(r,J,E,H)}return E},array:function(r){var E=v(r.length);x.set(r,E);return E}},g=Wa(a),l=[];a=0;if(d)for(var u=0;u<d.length;u++){var w=f[c[u]];w?(0===a&&(a=ka()),l[u]=w(d[u])):l[u]=d[u]}c=g.apply(null,l);c=function(r){return"string"===b?M(r):"boolean"===b?!!r:r}(c);0!==a&&ra(a);return c}var Ya=0,Za=3;
function ia(a){var b=Ya;if("number"===typeof a){var c=!0;var d=a}else c=!1,d=a.length;var f;b==Za?f=g:f=[$a,v,Ja][b](Math.max(d,1));if(c){var g=f;assert(0==(f&3));for(a=f+(d&-4);g<a;g+=4)I[g>>2]=0;for(a=f+d;g<a;)x[g++>>0]=0;return f}a.subarray||a.slice?J.set(a,f):J.set(new Uint8Array(a),f);return f}var ab="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function bb(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.subarray&&ab)return ab.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var g=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|g);else{var l=a[b++]&63;f=224==(f&240)?(f&15)<<12|g<<6|l:(f&7)<<18|g<<12|l<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function M(a){return a?bb(J,a,void 0):""}
function oa(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var g=0;g<a.length;++g){var l=a.charCodeAt(g);if(55296<=l&&57343>=l){var u=a.charCodeAt(++g);l=65536+((l&1023)<<10)|u&1023}if(127>=l){if(c>=d)break;b[c++]=l}else{if(2047>=l){if(c+1>=d)break;b[c++]=192|l>>6}else{if(65535>=l){if(c+2>=d)break;b[c++]=224|l>>12}else{if(c+3>=d)break;b[c++]=240|l>>18;b[c++]=128|l>>12&63}b[c++]=128|l>>6&63}b[c++]=128|l&63}}b[c]=0;return c-f}
function la(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);55296<=d&&57343>=d&&(d=65536+((d&1023)<<10)|a.charCodeAt(++c)&1023);127>=d?++b:b=2047>=d?b+2:65535>=d?b+3:b+4}return b}"undefined"!==typeof TextDecoder&&new TextDecoder("utf-16le");function cb(a){var b=la(a)+1,c=$a(b);c&&oa(a,x,c,b);return c}var db,x,J,Na,I,Sa,Ta;
function eb(a){db=a;e.HEAP8=x=new Int8Array(a);e.HEAP16=Na=new Int16Array(a);e.HEAP32=I=new Int32Array(a);e.HEAPU8=J=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=new Uint32Array(a);e.HEAPF32=Sa=new Float32Array(a);e.HEAPF64=Ta=new Float64Array(a)}var Ka=62896,fb=e.INITIAL_MEMORY||16777216;e.wasmMemory?Ua=e.wasmMemory:Ua=new WebAssembly.Memory({initial:fb/65536});Ua&&(db=Ua.buffer);fb=db.byteLength;eb(db);I[Ka>>2]=5305936;
function gb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b();else{var c=b.xb;"number"===typeof c?void 0===b.eb?e.dynCall_v(c):e.dynCall_vi(c,b.eb):c(void 0===b.eb?null:b.eb)}}}var hb=[],ib=[],jb=[],kb=[];function lb(){var a=e.preRun.shift();hb.unshift(a)}var Oa=Math.abs,Ra=Math.ceil,Qa=Math.floor,Pa=Math.min,mb=0,nb=null,ob=null;e.preloadedImages={};e.preloadedAudios={};
function F(a){if(e.onAbort)e.onAbort(a);Ia(a);G(a);Va=!0;throw new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}function pb(){var a=qb;return String.prototype.startsWith?a.startsWith("data:application/octet-stream;base64,"):0===a.indexOf("data:application/octet-stream;base64,")}var qb="sql-wasm.wasm";if(!pb()){var rb=qb;qb=e.locateFile?e.locateFile(rb,z):z+rb}
function sb(){try{if(Ma)return new Uint8Array(Ma);if(Ea)return Ea(qb);throw"both async and sync fetching of the wasm failed";}catch(a){F(a)}}function tb(){return Ma||!za&&!Aa||"function"!==typeof fetch?new Promise(function(a){a(sb())}):fetch(qb,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+qb+"'";return a.arrayBuffer()}).catch(function(){return sb()})}var L,K;ib.push({xb:function(){ub()}});
function vb(a){return a.replace(/\b_Z[\w\d_]+/g,function(b){return b===b?b:b+" ["+b+"]"})}function zb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}function k(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=zb(a.split("/").filter(function(d){return!!d}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}
function Ab(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function Bb(a){if("/"===a)return"/";var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}function Db(a){e.___errno_location&&(I[e.___errno_location()>>2]=a)}
function Eb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!==typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=zb(a.split("/").filter(function(d){return!!d}),!b).join("/");return(b?"/":"")+a||"."}var Fb=[];function Gb(a,b){Fb[a]={input:[],output:[],Xa:b};Hb(a,Ib)}
var Ib={open:function(a){var b=Fb[a.node.rdev];if(!b)throw new P(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.Xa.flush(a.tty)},flush:function(a){a.tty.Xa.flush(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.Xa.nb)throw new P(60);for(var f=0,g=0;g<d;g++){try{var l=a.tty.Xa.nb(a.tty)}catch(u){throw new P(29);}if(void 0===l&&0===f)throw new P(6);if(null===l||void 0===l)break;f++;b[c+g]=l}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.Xa.gb)throw new P(60);
try{for(var f=0;f<d;f++)a.tty.Xa.gb(a.tty,b[c+f])}catch(g){throw new P(29);}d&&(a.node.timestamp=Date.now());return f}},Jb={nb:function(a){if(!a.input.length){var b=null;if(Ba){var c=Buffer.pb?Buffer.pb(256):new Buffer(256),d=0;try{d=Ga.readSync(process.stdin.fd,c,0,256,null)}catch(f){if(-1!=f.toString().indexOf("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==
typeof readline&&(b=readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=ha(b,!0)}return a.input.shift()},gb:function(a,b){null===b||10===b?(Ia(bb(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Ia(bb(a.output,0)),a.output=[])}},Kb={gb:function(a,b){null===b||10===b?(G(bb(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(G(bb(a.output,0)),a.output=[])}},Q={Qa:null,Ra:function(){return Q.createNode(null,
"/",16895,0)},createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new P(63);Q.Qa||(Q.Qa={dir:{node:{Pa:Q.Ia.Pa,Oa:Q.Ia.Oa,lookup:Q.Ia.lookup,Ya:Q.Ia.Ya,rename:Q.Ia.rename,unlink:Q.Ia.unlink,rmdir:Q.Ia.rmdir,readdir:Q.Ia.readdir,symlink:Q.Ia.symlink},stream:{Ua:Q.Ja.Ua}},file:{node:{Pa:Q.Ia.Pa,Oa:Q.Ia.Oa},stream:{Ua:Q.Ja.Ua,read:Q.Ja.read,write:Q.Ja.write,ib:Q.Ja.ib,Za:Q.Ja.Za,$a:Q.Ja.$a}},link:{node:{Pa:Q.Ia.Pa,Oa:Q.Ia.Oa,readlink:Q.Ia.readlink},stream:{}},kb:{node:{Pa:Q.Ia.Pa,
Oa:Q.Ia.Oa},stream:Lb}});c=Mb(a,b,c,d);R(c.mode)?(c.Ia=Q.Qa.dir.node,c.Ja=Q.Qa.dir.stream,c.Ha={}):32768===(c.mode&61440)?(c.Ia=Q.Qa.file.node,c.Ja=Q.Qa.file.stream,c.Na=0,c.Ha=null):40960===(c.mode&61440)?(c.Ia=Q.Qa.link.node,c.Ja=Q.Qa.link.stream):8192===(c.mode&61440)&&(c.Ia=Q.Qa.kb.node,c.Ja=Q.Qa.kb.stream);c.timestamp=Date.now();a&&(a.Ha[b]=c);return c},Hb:function(a){if(a.Ha&&a.Ha.subarray){for(var b=[],c=0;c<a.Na;++c)b.push(a.Ha[c]);return b}return a.Ha},Ib:function(a){return a.Ha?a.Ha.subarray?
a.Ha.subarray(0,a.Na):new Uint8Array(a.Ha):new Uint8Array(0)},lb:function(a,b){var c=a.Ha?a.Ha.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)|0),0!=c&&(b=Math.max(b,256)),c=a.Ha,a.Ha=new Uint8Array(b),0<a.Na&&a.Ha.set(c.subarray(0,a.Na),0))},Eb:function(a,b){if(a.Na!=b)if(0==b)a.Ha=null,a.Na=0;else{if(!a.Ha||a.Ha.subarray){var c=a.Ha;a.Ha=new Uint8Array(b);c&&a.Ha.set(c.subarray(0,Math.min(b,a.Na)))}else if(a.Ha||(a.Ha=[]),a.Ha.length>b)a.Ha.length=b;else for(;a.Ha.length<b;)a.Ha.push(0);a.Na=
b}},Ia:{Pa:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;R(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.Na:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.wb=4096;b.blocks=Math.ceil(b.size/b.wb);return b},Oa:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&Q.Eb(a,
b.size)},lookup:function(){throw Nb[44];},Ya:function(a,b,c,d){return Q.createNode(a,b,c,d)},rename:function(a,b,c){if(R(a.mode)){try{var d=Ob(b,c)}catch(g){}if(d)for(var f in d.Ha)throw new P(55);}delete a.parent.Ha[a.name];a.name=c;b.Ha[c]=a;a.parent=b},unlink:function(a,b){delete a.Ha[b]},rmdir:function(a,b){var c=Ob(a,b),d;for(d in c.Ha)throw new P(55);delete a.Ha[b]},readdir:function(a){var b=[".",".."],c;for(c in a.Ha)a.Ha.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=Q.createNode(a,
b,41471,0);a.link=c;return a},readlink:function(a){if(40960!==(a.mode&61440))throw new P(28);return a.link}},Ja:{read:function(a,b,c,d,f){var g=a.node.Ha;if(f>=a.node.Na)return 0;a=Math.min(a.node.Na-f,d);if(8<a&&g.subarray)b.set(g.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=g[f+d];return a},write:function(a,b,c,d,f,g){b.buffer===x.buffer&&(g=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Ha||a.Ha.subarray)){if(g)return a.Ha=b.subarray(c,c+d),a.Na=d;if(0===a.Na&&0===f)return a.Ha=
b.slice(c,c+d),a.Na=d;if(f+d<=a.Na)return a.Ha.set(b.subarray(c,c+d),f),d}Q.lb(a,f+d);if(a.Ha.subarray&&b.subarray)a.Ha.set(b.subarray(c,c+d),f);else for(g=0;g<d;g++)a.Ha[f+g]=b[c+g];a.Na=Math.max(a.Na,f+d);return d},Ua:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Na);if(0>b)throw new P(28);return b},ib:function(a,b,c){Q.lb(a.node,b+c);a.node.Na=Math.max(a.node.Na,b+c)},Za:function(a,b,c,d,f,g,l){if(32768!==(a.node.mode&61440))throw new P(43);a=a.node.Ha;if(l&
2||a.buffer!==b.buffer){if(0<f||f+d<a.length)a.subarray?a=a.subarray(f,f+d):a=Array.prototype.slice.call(a,f,f+d);f=!0;l=b.buffer==x.buffer;d=$a(d);if(!d)throw new P(48);(l?x:b).set(a,d)}else f=!1,d=a.byteOffset;return{Db:d,bb:f}},$a:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new P(43);if(f&2)return 0;Q.Ja.write(a,b,0,d,c,!1);return 0}}},Pb=null,Qb={},S=[],Rb=1,U=null,Sb=!0,V={},P=null,Nb={};
function W(a,b){a=Eb("/",a);b=b||{};if(!a)return{path:"",node:null};var c={mb:!0,hb:0},d;for(d in c)void 0===b[d]&&(b[d]=c[d]);if(8<b.hb)throw new P(32);a=zb(a.split("/").filter(function(l){return!!l}),!1);var f=Pb;c="/";for(d=0;d<a.length;d++){var g=d===a.length-1;if(g&&b.parent)break;f=Ob(f,a[d]);c=k(c+"/"+a[d]);f.Va&&(!g||g&&b.mb)&&(f=f.Va.root);if(!g||b.Ta)for(g=0;40960===(f.mode&61440);)if(f=Tb(c),c=Eb(Ab(c),f),f=W(c,{hb:b.hb}).node,40<g++)throw new P(32);}return{path:c,node:f}}
function Ub(a){for(var b;;){if(a===a.parent)return a=a.Ra.ob,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}}function Vb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%U.length}function Wb(a){var b=Vb(a.parent.id,a.name);if(U[b]===a)U[b]=a.Wa;else for(b=U[b];b;){if(b.Wa===a){b.Wa=a.Wa;break}b=b.Wa}}
function Ob(a,b){var c;if(c=(c=Xb(a,"x"))?c:a.Ia.lookup?0:2)throw new P(c,a);for(c=U[Vb(a.id,b)];c;c=c.Wa){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Ia.lookup(a,b)}function Mb(a,b,c,d){a=new Yb(a,b,c,d);b=Vb(a.parent.id,a.name);a.Wa=U[b];return U[b]=a}function R(a){return 16384===(a&61440)}var Zb={r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218};
function $b(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}function Xb(a,b){if(Sb)return 0;if(-1===b.indexOf("r")||a.mode&292){if(-1!==b.indexOf("w")&&!(a.mode&146)||-1!==b.indexOf("x")&&!(a.mode&73))return 2}else return 2;return 0}function ac(a,b){try{return Ob(a,b),20}catch(c){}return Xb(a,"wx")}function bc(a,b,c){try{var d=Ob(a,b)}catch(f){return f.Ka}if(a=Xb(a,"wx"))return a;if(c){if(!R(d.mode))return 54;if(d===d.parent||"/"===Ub(d))return 10}else if(R(d.mode))return 31;return 0}
function cc(a){var b=4096;for(a=a||0;a<=b;a++)if(!S[a])return a;throw new P(33);}function dc(a,b){ec||(ec=function(){},ec.prototype={});var c=new ec,d;for(d in a)c[d]=a[d];a=c;b=cc(b);a.fd=b;return S[b]=a}var Lb={open:function(a){a.Ja=Qb[a.node.rdev].Ja;a.Ja.open&&a.Ja.open(a)},Ua:function(){throw new P(70);}};function Hb(a,b){Qb[a]={Ja:b}}
function fc(a,b){var c="/"===b,d=!b;if(c&&Pb)throw new P(10);if(!c&&!d){var f=W(b,{mb:!1});b=f.path;f=f.node;if(f.Va)throw new P(10);if(!R(f.mode))throw new P(54);}b={type:a,Jb:{},ob:b,Cb:[]};a=a.Ra(b);a.Ra=b;b.root=a;c?Pb=a:f&&(f.Va=b,f.Ra&&f.Ra.Cb.push(b))}function ca(a,b,c){var d=W(a,{parent:!0}).node;a=Bb(a);if(!a||"."===a||".."===a)throw new P(28);var f=ac(d,a);if(f)throw new P(f);if(!d.Ia.Ya)throw new P(63);return d.Ia.Ya(d,a,b,c)}function X(a,b){ca(a,(void 0!==b?b:511)&1023|16384,0)}
function hc(a,b,c){"undefined"===typeof c&&(c=b,b=438);ca(a,b|8192,c)}function ic(a,b){if(!Eb(a))throw new P(44);var c=W(b,{parent:!0}).node;if(!c)throw new P(44);b=Bb(b);var d=ac(c,b);if(d)throw new P(d);if(!c.Ia.symlink)throw new P(63);c.Ia.symlink(c,b,a)}
function ua(a){var b=W(a,{parent:!0}).node,c=Bb(a),d=Ob(b,c),f=bc(b,c,!1);if(f)throw new P(f);if(!b.Ia.unlink)throw new P(63);if(d.Va)throw new P(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){G("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.Ia.unlink(b,c);Wb(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){G("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+g.message)}}
function Tb(a){a=W(a).node;if(!a)throw new P(44);if(!a.Ia.readlink)throw new P(28);return Eb(Ub(a.parent),a.Ia.readlink(a))}function jc(a,b){a=W(a,{Ta:!b}).node;if(!a)throw new P(44);if(!a.Ia.Pa)throw new P(63);return a.Ia.Pa(a)}function kc(a){return jc(a,!0)}function da(a,b){var c;"string"===typeof a?c=W(a,{Ta:!0}).node:c=a;if(!c.Ia.Oa)throw new P(63);c.Ia.Oa(c,{mode:b&4095|c.mode&-4096,timestamp:Date.now()})}
function lc(a){var b;"string"===typeof a?b=W(a,{Ta:!0}).node:b=a;if(!b.Ia.Oa)throw new P(63);b.Ia.Oa(b,{timestamp:Date.now()})}function mc(a,b){if(0>b)throw new P(28);var c;"string"===typeof a?c=W(a,{Ta:!0}).node:c=a;if(!c.Ia.Oa)throw new P(63);if(R(c.mode))throw new P(31);if(32768!==(c.mode&61440))throw new P(28);if(a=Xb(c,"w"))throw new P(a);c.Ia.Oa(c,{size:b,timestamp:Date.now()})}
function m(a,b,c,d){if(""===a)throw new P(44);if("string"===typeof b){var f=Zb[b];if("undefined"===typeof f)throw Error("Unknown file open mode: "+b);b=f}c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;if("object"===typeof a)var g=a;else{a=k(a);try{g=W(a,{Ta:!(b&131072)}).node}catch(l){}}f=!1;if(b&64)if(g){if(b&128)throw new P(20);}else g=ca(a,c,0),f=!0;if(!g)throw new P(44);8192===(g.mode&61440)&&(b&=-513);if(b&65536&&!R(g.mode))throw new P(54);if(!f&&(c=g?40960===(g.mode&61440)?32:R(g.mode)&&
("r"!==$b(b)||b&512)?31:Xb(g,$b(b)):44))throw new P(c);b&512&&mc(g,0);b&=-641;d=dc({node:g,path:Ub(g),flags:b,seekable:!0,position:0,Ja:g.Ja,Gb:[],error:!1},d);d.Ja.open&&d.Ja.open(d);!e.logReadFiles||b&1||(nc||(nc={}),a in nc||(nc[a]=1,G("FS.trackingDelegate error on read file: "+a)));try{V.onOpenFile&&(g=0,1!==(b&2097155)&&(g|=1),0!==(b&2097155)&&(g|=2),V.onOpenFile(a,g))}catch(l){G("FS.trackingDelegate['onOpenFile']('"+a+"', flags) threw an exception: "+l.message)}return d}
function fa(a){if(null===a.fd)throw new P(8);a.fb&&(a.fb=null);try{a.Ja.close&&a.Ja.close(a)}catch(b){throw b;}finally{S[a.fd]=null}a.fd=null}function oc(a,b,c){if(null===a.fd)throw new P(8);if(!a.seekable||!a.Ja.Ua)throw new P(70);if(0!=c&&1!=c&&2!=c)throw new P(28);a.position=a.Ja.Ua(a,b,c);a.Gb=[]}
function pc(a,b,c,d,f){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(1===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Ja.read)throw new P(28);var g="undefined"!==typeof f;if(!g)f=a.position;else if(!a.seekable)throw new P(70);b=a.Ja.read(a,b,c,d,f);g||(a.position+=b);return b}
function ea(a,b,c,d,f,g){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(0===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Ja.write)throw new P(28);a.flags&1024&&oc(a,0,2);var l="undefined"!==typeof f;if(!l)f=a.position;else if(!a.seekable)throw new P(70);b=a.Ja.write(a,b,c,d,f,g);l||(a.position+=b);try{if(a.path&&V.onWriteToFile)V.onWriteToFile(a.path)}catch(u){G("FS.trackingDelegate['onWriteToFile']('"+a.path+"') threw an exception: "+u.message)}return b}
function ta(a){var b={encoding:"binary"};b=b||{};b.flags=b.flags||"r";b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var c,d=m(a,b.flags);a=jc(a).size;var f=new Uint8Array(a);pc(d,f,0,a,0);"utf8"===b.encoding?c=bb(f,0):"binary"===b.encoding&&(c=f);fa(d);return c}
function qc(){P||(P=function(a,b){this.node=b;this.Fb=function(c){this.Ka=c};this.Fb(a);this.message="FS error"},P.prototype=Error(),P.prototype.constructor=P,[44].forEach(function(a){Nb[a]=new P(a);Nb[a].stack="<generic error, no stack>"}))}var Pc;function ba(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}
function Qc(a,b,c){a=k("/dev/"+a);var d=ba(!!b,!!c);Sc||(Sc=64);var f=Sc++<<8|0;Hb(f,{open:function(g){g.seekable=!1},close:function(){c&&c.buffer&&c.buffer.length&&c(10)},read:function(g,l,u,w){for(var r=0,E=0;E<w;E++){try{var H=b()}catch(aa){throw new P(29);}if(void 0===H&&0===r)throw new P(6);if(null===H||void 0===H)break;r++;l[u+E]=H}r&&(g.node.timestamp=Date.now());return r},write:function(g,l,u,w){for(var r=0;r<w;r++)try{c(l[u+r])}catch(E){throw new P(29);}w&&(g.node.timestamp=Date.now());return r}});
hc(a,d,f)}var Sc,Y={},ec,nc,Tc={};
function Uc(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&k(b)!==k(Ub(f.node)))return-54;throw f;}I[c>>2]=d.dev;I[c+4>>2]=0;I[c+8>>2]=d.ino;I[c+12>>2]=d.mode;I[c+16>>2]=d.nlink;I[c+20>>2]=d.uid;I[c+24>>2]=d.gid;I[c+28>>2]=d.rdev;I[c+32>>2]=0;K=[d.size>>>0,(L=d.size,1<=+Oa(L)?0<L?(Pa(+Qa(L/4294967296),4294967295)|0)>>>0:~~+Ra((L-+(~~L>>>0))/4294967296)>>>0:0)];I[c+40>>2]=K[0];I[c+44>>2]=K[1];I[c+48>>2]=4096;I[c+52>>2]=d.blocks;I[c+56>>2]=d.atime.getTime()/1E3|0;I[c+60>>2]=0;I[c+64>>2]=d.mtime.getTime()/
1E3|0;I[c+68>>2]=0;I[c+72>>2]=d.ctime.getTime()/1E3|0;I[c+76>>2]=0;K=[d.ino>>>0,(L=d.ino,1<=+Oa(L)?0<L?(Pa(+Qa(L/4294967296),4294967295)|0)>>>0:~~+Ra((L-+(~~L>>>0))/4294967296)>>>0:0)];I[c+80>>2]=K[0];I[c+84>>2]=K[1];return 0}var Vc=void 0;function Wc(){Vc+=4;return I[Vc-4>>2]}function Z(a){a=S[a];if(!a)throw new P(8);return a}var Xc={};
function Yc(){if(!Zc){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:ya||"./this.program"},b;for(b in Xc)a[b]=Xc[b];var c=[];for(b in a)c.push(b+"="+a[b]);Zc=c}return Zc}var Zc;oa("GMT",J,62960,4);
function $c(){function a(g){return(g=g.toTimeString().match(/\(([A-Za-z ]+)\)$/))?g[1]:"GMT"}if(!ad){ad=!0;I[bd()>>2]=60*(new Date).getTimezoneOffset();var b=(new Date).getFullYear(),c=new Date(b,0,1);b=new Date(b,6,1);I[cd()>>2]=Number(c.getTimezoneOffset()!=b.getTimezoneOffset());var d=a(c),f=a(b);d=cb(d);f=cb(f);b.getTimezoneOffset()<c.getTimezoneOffset()?(I[dd()>>2]=d,I[dd()+4>>2]=f):(I[dd()>>2]=f,I[dd()+4>>2]=d)}}var ad,ed;
Ba?ed=function(){var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:"undefined"!==typeof dateNow?ed=dateNow:ed=function(){return performance.now()};function fd(a){for(var b=ed();ed()-b<a/1E3;);}e._usleep=fd;function Yb(a,b,c,d){a||(a=this);this.parent=a;this.Ra=a.Ra;this.Va=null;this.id=Rb++;this.name=b;this.mode=c;this.Ia={};this.Ja={};this.rdev=d}
Object.defineProperties(Yb.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});qc();U=Array(4096);fc(Q,"/");X("/tmp");X("/home");X("/home/web_user");
(function(){X("/dev");Hb(259,{read:function(){return 0},write:function(d,f,g,l){return l}});hc("/dev/null",259);Gb(1280,Jb);Gb(1536,Kb);hc("/dev/tty",1280);hc("/dev/tty1",1536);if("object"===typeof crypto&&"function"===typeof crypto.getRandomValues){var a=new Uint8Array(1);var b=function(){crypto.getRandomValues(a);return a[0]}}else if(Ba)try{var c=require("crypto");b=function(){return c.randomBytes(1)[0]}}catch(d){}b||(b=function(){F("random_device")});Qc("random",b);Qc("urandom",b);X("/dev/shm");
X("/dev/shm/tmp")})();X("/proc");X("/proc/self");X("/proc/self/fd");fc({Ra:function(){var a=Mb("/proc/self","fd",16895,73);a.Ia={lookup:function(b,c){var d=S[+c];if(!d)throw new P(8);b={parent:null,Ra:{ob:"fake"},Ia:{readlink:function(){return d.path}}};return b.parent=b}};return a}},"/proc/self/fd");function ha(a,b){var c=Array(la(a)+1);a=oa(a,c,0,c.length);b&&(c.length=a);return c}
var hd={a:function(a,b,c,d){F("Assertion failed: "+M(a)+", at: "+[b?M(b):"unknown filename",c,d?M(d):"unknown function"])},x:function(a){try{return a=M(a),ua(a),0}catch(b){return"undefined"!==typeof Y&&b instanceof P||F(b),-b.Ka}},t:function(a,b){try{return a=M(a),da(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),-c.Ka}},E:function(a,b){try{if(0===b)return-28;if(b<la("/")+1)return-68;oa("/",J,a,b);return a}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),-c.Ka}},w:function(a,
b,c,d,f,g){try{a:{g<<=12;var l=!1;if(0!==(d&16)&&0!==a%16384)var u=-28;else{if(0!==(d&32)){var w=gd(16384,b);if(!w){u=-48;break a}a=w;c=b;var r=0;a|=0;c|=0;var E;var H=a+c|0;r=(r|0)&255;if(67<=(c|0)){for(;0!=(a&3);)x[a>>0]=r,a=a+1|0;var aa=H&-4|0;var B=r|r<<8|r<<16|r<<24;for(E=aa-64|0;(a|0)<=(E|0);)I[a>>2]=B,I[a+4>>2]=B,I[a+8>>2]=B,I[a+12>>2]=B,I[a+16>>2]=B,I[a+20>>2]=B,I[a+24>>2]=B,I[a+28>>2]=B,I[a+32>>2]=B,I[a+36>>2]=B,I[a+40>>2]=B,I[a+44>>2]=B,I[a+48>>2]=B,I[a+52>>2]=B,I[a+56>>2]=B,I[a+60>>2]=
B,a=a+64|0;for(;(a|0)<(aa|0);)I[a>>2]=B,a=a+4|0}for(;(a|0)<(H|0);)x[a>>0]=r,a=a+1|0;l=!0}else{r=S[f];if(!r){u=-8;break a}H=g;aa=J;if(0!==(c&2)&&0===(d&2)&&2!==(r.flags&2097155))throw new P(2);if(1===(r.flags&2097155))throw new P(2);if(!r.Ja.Za)throw new P(43);var ma=r.Ja.Za(r,aa,a,b,H,c,d);w=ma.Db;l=ma.bb}Tc[w]={Bb:w,Ab:b,bb:l,fd:f,flags:d,offset:g};u=w}}return u}catch(na){return"undefined"!==typeof Y&&na instanceof P||F(na),-na.Ka}},G:function(a,b,c){try{var d=S[a];if(!d)throw new P(8);if(0===(d.flags&
2097155))throw new P(28);mc(d.node,c);return 0}catch(f){return"undefined"!==typeof Y&&f instanceof P||F(f),-f.Ka}},f:function(a,b){try{return a=M(a),Uc(jc,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),-c.Ka}},s:function(a,b){try{return a=M(a),Uc(kc,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),-c.Ka}},r:function(a,b){try{var c=Z(a);return Uc(jc,c.path,b)}catch(d){return"undefined"!==typeof Y&&d instanceof P||F(d),-d.Ka}},d:function(){return 42},I:function(){return 0},
C:function(a){try{var b=S[a];if(!b)throw new P(8);lc(b.node);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),-c.Ka}},B:function(a){try{return a=M(a),lc(a),0}catch(b){return"undefined"!==typeof Y&&b instanceof P||F(b),-b.Ka}},b:function(a,b,c){Vc=c;try{var d=Z(a);switch(b){case 0:var f=Wc();return 0>f?-28:m(d.path,d.flags,0,f).fd;case 1:case 2:return 0;case 3:return d.flags;case 4:return f=Wc(),d.flags|=f,0;case 12:return f=Wc(),Na[f+0>>1]=2,0;case 13:case 14:return 0;case 16:case 8:return-28;
case 9:return Db(28),-1;default:return-28}}catch(g){return"undefined"!==typeof Y&&g instanceof P||F(g),-g.Ka}},F:function(a,b,c){try{var d=Z(a);return pc(d,x,b,c)}catch(f){return"undefined"!==typeof Y&&f instanceof P||F(f),-f.Ka}},h:function(a,b){try{a=M(a);if(b&-8)var c=-28;else{var d;(d=W(a,{Ta:!0}).node)?(a="",b&4&&(a+="r"),b&2&&(a+="w"),b&1&&(a+="x"),c=a&&Xb(d,a)?-2:0):c=-44}return c}catch(f){return"undefined"!==typeof Y&&f instanceof P||F(f),-f.Ka}},p:function(a,b){try{return a=M(a),a=k(a),"/"===
a[a.length-1]&&(a=a.substr(0,a.length-1)),X(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),-c.Ka}},A:function(a){try{a=M(a);var b=W(a,{parent:!0}).node,c=Bb(a),d=Ob(b,c),f=bc(b,c,!0);if(f)throw new P(f);if(!b.Ia.rmdir)throw new P(63);if(d.Va)throw new P(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){G("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.Ia.rmdir(b,c);Wb(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){G("FS.trackingDelegate['onDeletePath']('"+
a+"') threw an exception: "+g.message)}return 0}catch(g){return"undefined"!==typeof Y&&g instanceof P||F(g),-g.Ka}},i:function(a,b,c){Vc=c;try{var d=M(a),f=Wc();return m(d,b,f).fd}catch(g){return"undefined"!==typeof Y&&g instanceof P||F(g),-g.Ka}},y:function(a,b,c){try{a=M(a);if(0>=c)var d=-28;else{var f=Tb(a),g=Math.min(c,la(f)),l=x[b+g];oa(f,J,b,c+1);x[b+g]=l;d=g}return d}catch(u){return"undefined"!==typeof Y&&u instanceof P||F(u),-u.Ka}},v:function(a,b){try{if(-1===a||0===b)var c=-28;else{var d=
Tc[a];if(d&&b===d.Ab){var f=S[d.fd],g=d.flags,l=d.offset,u=J.slice(a,a+b);f&&f.Ja.$a&&f.Ja.$a(f,u,l,b,g);Tc[a]=null;d.bb&&ja(d.Bb)}c=0}return c}catch(w){return"undefined"!==typeof Y&&w instanceof P||F(w),-w.Ka}},u:function(a,b){try{var c=S[a];if(!c)throw new P(8);da(c.node,b);return 0}catch(d){return"undefined"!==typeof Y&&d instanceof P||F(d),-d.Ka}},l:function(a,b,c){J.copyWithin(a,b,b+c)},c:function(a){var b=J.length;if(2147418112<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,
a+100663296);d=Math.max(16777216,a,d);0<d%65536&&(d+=65536-d%65536);a:{try{Ua.grow(Math.min(2147418112,d)-db.byteLength+65535>>16);eb(Ua.buffer);var f=1;break a}catch(g){}f=void 0}if(f)return!0}return!1},n:function(a,b){var c=0;Yc().forEach(function(d,f){var g=b+c;f=I[a+4*f>>2]=g;for(g=0;g<d.length;++g)x[f++>>0]=d.charCodeAt(g);x[f>>0]=0;c+=d.length+1});return 0},o:function(a,b){var c=Yc();I[a>>2]=c.length;var d=0;c.forEach(function(f){d+=f.length+1});I[b>>2]=d;return 0},e:function(a){try{var b=Z(a);
fa(b);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),c.Ka}},m:function(a,b){try{var c=Z(a);x[b>>0]=c.tty?2:R(c.mode)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){return"undefined"!==typeof Y&&d instanceof P||F(d),d.Ka}},k:function(a,b,c,d,f){try{var g=Z(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=a)return-61;oc(g,a,d);K=[g.position>>>0,(L=g.position,1<=+Oa(L)?0<L?(Pa(+Qa(L/4294967296),4294967295)|0)>>>0:~~+Ra((L-+(~~L>>>0))/4294967296)>>>0:0)];I[f>>
2]=K[0];I[f+4>>2]=K[1];g.fb&&0===a&&0===d&&(g.fb=null);return 0}catch(l){return"undefined"!==typeof Y&&l instanceof P||F(l),l.Ka}},D:function(a){try{var b=Z(a);return b.Ja&&b.Ja.fsync?-b.Ja.fsync(b):0}catch(c){return"undefined"!==typeof Y&&c instanceof P||F(c),c.Ka}},H:function(a,b,c,d){try{a:{for(var f=Z(a),g=a=0;g<c;g++){var l=ea(f,x,I[b+8*g>>2],I[b+(8*g+4)>>2],void 0);if(0>l){var u=-1;break a}a+=l}u=a}I[d>>2]=u;return 0}catch(w){return"undefined"!==typeof Y&&w instanceof P||F(w),w.Ka}},g:function(a){var b=
Date.now();I[a>>2]=b/1E3|0;I[a+4>>2]=b%1E3*1E3|0;return 0},j:function(a){$c();a=new Date(1E3*I[a>>2]);I[15728]=a.getSeconds();I[15729]=a.getMinutes();I[15730]=a.getHours();I[15731]=a.getDate();I[15732]=a.getMonth();I[15733]=a.getFullYear()-1900;I[15734]=a.getDay();var b=new Date(a.getFullYear(),0,1);I[15735]=(a.getTime()-b.getTime())/864E5|0;I[15737]=-(60*a.getTimezoneOffset());var c=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();b=b.getTimezoneOffset();a=(c!=b&&a.getTimezoneOffset()==Math.min(b,
c))|0;I[15736]=a;a=I[dd()+(a?4:0)>>2];I[15738]=a;return 62912},memory:Ua,J:function(a,b){if(0===a)return Db(28),-1;var c=I[a>>2];a=I[a+4>>2];if(0>a||999999999<a||0>c)return Db(28),-1;0!==b&&(I[b>>2]=0,I[b+4>>2]=0);return fd(1E6*c+a/1E3)},z:function(a){switch(a){case 30:return 16384;case 85:return 131068;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:case 79:return 200809;
case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;
case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return"object"===typeof navigator?navigator.hardwareConcurrency||1:1}Db(28);return-1},
table:La,K:function(a){var b=Date.now()/1E3|0;a&&(I[a>>2]=b);return b},q:function(a,b){if(b){var c=1E3*I[b+8>>2];c+=I[b+12>>2]/1E3}else c=Date.now();a=M(a);try{b=c;var d=W(a,{Ta:!0}).node;d.Ia.Oa(d,{timestamp:Math.max(b,c)});return 0}catch(f){a=f;if(!(a instanceof P)){a+=" : ";a:{d=Error();if(!d.stack){try{throw Error();}catch(g){d=g}if(!d.stack){d="(no stack trace available)";break a}}d=d.stack.toString()}e.extraStackTrace&&(d+="\n"+e.extraStackTrace());d=vb(d);throw a+d;}Db(a.Ka);return-1}}},id=
function(){function a(f){e.asm=f.exports;mb--;e.monitorRunDependencies&&e.monitorRunDependencies(mb);0==mb&&(null!==nb&&(clearInterval(nb),nb=null),ob&&(f=ob,ob=null,f()))}function b(f){a(f.instance)}function c(f){return tb().then(function(g){return WebAssembly.instantiate(g,d)}).then(f,function(g){G("failed to asynchronously prepare wasm: "+g);F(g)})}var d={a:hd};mb++;e.monitorRunDependencies&&e.monitorRunDependencies(mb);if(e.instantiateWasm)try{return e.instantiateWasm(d,a)}catch(f){return G("Module.instantiateWasm callback failed with error: "+
f),!1}(function(){if(Ma||"function"!==typeof WebAssembly.instantiateStreaming||pb()||"function"!==typeof fetch)return c(b);fetch(qb,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(g){G("wasm streaming compile failed: "+g);G("falling back to ArrayBuffer instantiation");c(b)})})})();return{}}();e.asm=id;var ub=e.___wasm_call_ctors=function(){return(ub=e.___wasm_call_ctors=e.asm.L).apply(null,arguments)};
e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.M).apply(null,arguments)};e.___errno_location=function(){return(e.___errno_location=e.asm.N).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.O).apply(null,arguments)};e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.P).apply(null,arguments)};e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.Q).apply(null,arguments)};
e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.R).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.S).apply(null,arguments)};e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.T).apply(null,arguments)};e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.U).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.V).apply(null,arguments)};
e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.W).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm.X).apply(null,arguments)};e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm.Y).apply(null,arguments)};e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm.Z).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm._).apply(null,arguments)};
e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.$).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.aa).apply(null,arguments)};e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.ba).apply(null,arguments)};e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.ca).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.da).apply(null,arguments)};
e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.ea).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.fa).apply(null,arguments)};e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ga).apply(null,arguments)};e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.ha).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.ia).apply(null,arguments)};
e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.ja).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.ka).apply(null,arguments)};e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.la).apply(null,arguments)};e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.ma).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.na).apply(null,arguments)};
e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.oa).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.pa).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.qa).apply(null,arguments)};e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.ra).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.sa).apply(null,arguments)};
e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.ta).apply(null,arguments)};e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.ua).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.va).apply(null,arguments)};var $a=e._malloc=function(){return($a=e._malloc=e.asm.wa).apply(null,arguments)},ja=e._free=function(){return(ja=e._free=e.asm.xa).apply(null,arguments)};
e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.ya).apply(null,arguments)};
var dd=e.__get_tzname=function(){return(dd=e.__get_tzname=e.asm.za).apply(null,arguments)},cd=e.__get_daylight=function(){return(cd=e.__get_daylight=e.asm.Aa).apply(null,arguments)},bd=e.__get_timezone=function(){return(bd=e.__get_timezone=e.asm.Ba).apply(null,arguments)},gd=e._memalign=function(){return(gd=e._memalign=e.asm.Ca).apply(null,arguments)},ka=e.stackSave=function(){return(ka=e.stackSave=e.asm.Da).apply(null,arguments)},v=e.stackAlloc=function(){return(v=e.stackAlloc=e.asm.Ea).apply(null,
arguments)},ra=e.stackRestore=function(){return(ra=e.stackRestore=e.asm.Fa).apply(null,arguments)};e.dynCall_vi=function(){return(e.dynCall_vi=e.asm.Ga).apply(null,arguments)};e.asm=id;e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(function(g){return"number"===g});return"string"!==b&&f&&!d?Wa(a):function(){return Xa(a,b,c,arguments)}};e.stackSave=ka;e.stackRestore=ra;e.stackAlloc=v;var jd;ob=function kd(){jd||ld();jd||(ob=kd)};
function ld(){function a(){if(!jd&&(jd=!0,e.calledRun=!0,!Va)){e.noFSInit||Pc||(Pc=!0,qc(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?Qc("stdin",e.stdin):ic("/dev/tty","/dev/stdin"),e.stdout?Qc("stdout",null,e.stdout):ic("/dev/tty","/dev/stdout"),e.stderr?Qc("stderr",null,e.stderr):ic("/dev/tty1","/dev/stderr"),m("/dev/stdin","r"),m("/dev/stdout","w"),m("/dev/stderr","w"));gb(ib);Sb=!1;gb(jb);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&
(e.postRun=[e.postRun]);e.postRun.length;){var b=e.postRun.shift();kb.unshift(b)}gb(kb)}}if(!(0<mb)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)lb();gb(hb);0<mb||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}e.run=ld;if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();noExitRuntime=!0;ld();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint func-names: ["off"] */
/* eslint no-restricted-globals: ["error"] */


// encapsulate web-worker code to run in any env
(function () {
    "use strict";

    // isomorphism - do not run worker.js code if not in web-worker env
    if (!(
        typeof self === "object"
        && typeof importScripts === "function"
        && self
        && self.importScripts === importScripts
    )) {
        return;
    }

    // Declare toplevel variables
    var db;
    var sqlModuleReady;

    function onModuleReady(SQL) {
        function createDb(data) {
            if (db != null) db.close();
            db = new SQL.Database(data);
            return db;
        }

        var buff; var data; var result;
        data = this["data"];
        switch (data && data["action"]) {
            case "open":
                buff = data["buffer"];
                createDb(buff && new Uint8Array(buff));
                return postMessage({
                    id: data["id"],
                    ready: true
                });
            case "exec":
                if (db === null) {
                    createDb();
                }
                if (!data["sql"]) {
                    throw "exec: Missing query string";
                }
                return postMessage({
                    id: data["id"],
                    results: db.exec(data["sql"], data["params"])
                });
            case "each":
                if (db === null) {
                    createDb();
                }
                var callback = function callback(row) {
                    return postMessage({
                        id: data["id"],
                        row: row,
                        finished: false
                    });
                };
                var done = function done() {
                    return postMessage({
                        id: data["id"],
                        finished: true
                    });
                };
                return db.each(data["sql"], data["params"], callback, done);
            case "export":
                buff = db["export"]();
                result = {
                    id: data["id"],
                    buffer: buff
                };
                try {
                    return postMessage(result, [result]);
                } catch (error) {
                    return postMessage(result);
                }
            case "close":
                return db && db.close();
            default:
                throw new Error("Invalid action : " + (data && data["action"]));
        }
    }

    function onError(err) {
        return postMessage({
            id: this["data"]["id"],
            error: err["message"]
        });
    }

    // init web-worker onmessage event-handling
    db = null;
    sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}());

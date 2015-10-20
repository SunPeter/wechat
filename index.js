var koa = require("koa");
var os = require("os");
var app = koa();

var sso = require("./middleware/sso");
app.use(sso);

var handlebars = require("koa-handlebars");
app.use(handlebars({
    viewsDir: "page"
}));

var router = require('koa-router')();
app.use(router.routes()).use(router.allowedMethods());

router.get("/",function* (next){
	yield this.render("index", this.auth);
	yield next;
})

app.listen(8080,function(){
	console.log("server is listening " + os.networkInterfaces().en0[1].address + ":8080");
});
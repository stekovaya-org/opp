var https = require("https");
var fs = require("fs");
var {argv} = process;
var od;
argv.shift();
argv.shift();
if(fs.existsSync(argv[0])){
  od = new Date();
  var data = fs.readFileSync(argv[0]) + "";
  var req = https.request({
    hostname: "not-compiler.theforarkld.repl.co",
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      //"Content-Length": Buffer.byteLength(data)
    }
  },(res)=>{
    var d = [];
    res.on("data",c=>{
      d.push(Buffer.from(c,"binary"));
      console.log(Math.floor(d.length / res.headers["content-length"] * 100) + "% done\x1b[1A");
    });
    res.on("end",()=>{
      fs.writeFileSync(argv[0].replace(/([\S\s]+)\.[^\.]+/,"$1"),Buffer.concat(d));
      console.log("done. (" + (new Date() - od) + "ms)             ");
    });
  });
  req.write(data);
  req.end();
}else{
  if(argv.length) console.error("\x1b[1mo++: \x1b[31merror: \x1b[m" + argv[0] + ": No such file");
  console.error("\x1b[1mo++: \x1b[31mfatal error: \x1b[mno input file");
  process.exit(1);
}
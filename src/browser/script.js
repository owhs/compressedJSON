// Setup CJSON
var cjson = _CJS({
    qk:{1839399343:1,"-1657405912":2}, // quick keys
    keys: ["uid","name","_ghost","level","testArr","obj","flagA"] // keys
});

// Tests
[{ uid:1, name:"oscar" }, { uid:1, level:1 }, { uid:1, obj:{a:1,b:2}, flagA:1 }].forEach(t=>{
    var saveStr = cjson.getSaveString(t);
    
    console.log("\nCompressed object string '"+saveStr.split("\n").join("\\n")+"' saved " + (JSON.stringify(t).length-saveStr.length) + " characters");
    console.log("parsed",cjson.parseSaveString(saveStr),"\n");
});

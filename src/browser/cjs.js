const _CJS = (config={})=>{

    const hasher = str=>[].reduce.call( str, function( hash, i ) { hash =  ((hash << 5) - hash) + i.charCodeAt(0); return hash | 0 }, 0 ),
          powerSet = arr => arr.reduce((total, value) => total.concat(total.map(totalItem => [value].concat(totalItem).join(','))),[[]]).filter(z=>z.length),
          superSet = options=>[...new Set([].concat(powerSet(options),powerSet(options.reverse())).filter(el => el.length !== 0))],
          KEYS = o=>Object.keys(o);

    var cache = {qk:{}};

    if (config.qk) {
        KEYS(config.qk).forEach(k=>{
            cache.qk[k] = config.qk[k];
            cache.qk[config.qk[k]] = k;
        });
    }
    
    const Export = {
        parseSaveString: str=>{
            if (!cache.lookup) throw Error("No hash lookup cached!\n\tUse 'hashLookupObj' in order to use lookup tools");
            var spl = str.split("\n"),
                keys = (cache.lookup[cache.qk[spl[0]]]||cache.lookup[spl[0]]).split(",");
            return Object.assign.apply({},spl.slice(1).map((v,i)=>({[keys[i]]:JSON.parse(v[0]==='"' ? v+'"' : v)})));
        },
        parseCompressed: async (str)=>{
            return Export.parseSaveString(await new Response((new Response(str)).body.pipeThrough(new DecompressionStream("gzip"))).text())
        },
        getCompressed: async (obj,validate=false)=>{
            return await new Response((new Response(Export.getSaveString(obj,validate))).body.pipeThrough(new CompressionStream("gzip"))).blob()
        },
        getSaveString: (obj,validate=false)=>{
            var saveHash = Export.getSaveHash(obj);
            if (validate && !Export.isSaveHashValid(saveHash)) throw Error("Invalid save obj");
            saveHash = cache.qk[saveHash] || saveHash;
            return saveHash+"\n"+KEYS(obj).sort().map(k=>{
                var t = JSON.stringify(obj[k]);
                return t[0]==='"' ? t.slice(0,-1) : t
            }).join("\n")
        },
        getSaveHash: obj=>hasher((obj.forEach ? obj : obj.split ? obj.split(",") : KEYS(obj)).sort().join(",")),
        isSaveHashValid: saveHash => {
            if (cache.lookup!==undefined) return cache.lookup[saveHash]!==undefined;
            throw Error("No hash lookup cached!\n\tUse 'hashLookupObj' in order to use lookup tools");
        },
        hashLookupObj: keyArr => {
            keyArr = keyArr.sort();
            var keyHash = hasher(keyArr.join(","));
            if (cache.lookup === undefined || cache.lookupHash != keyHash){
                cache.lookupHash = keyHash;
                return cache.lookup = Object.assign.apply({},superSet(keyArr).map(z=>({[hasher(z)]:z})))
            } else return cache.lookup;
        },
        getCache: ()=>cache
    };

    if (config.keys) {
        Export.hashLookupObj(config.keys)
    }

    return Export    
};

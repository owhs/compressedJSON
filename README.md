# compressedJSON
 ___Compressed JSON objects - for smaller string sizes compared to working with JSON.stringify___
 
 ___Allows human readable Object key names without bloating output___
  
|  | Readable<br>Input | Readable<br>Output | Output<br>Size |
|---:|:---:|:---:|:---:|
| JSON | ✅ | ✅ | 🐘 |
| CJSON | ✅ | ❌ | 🐜 |

 ✔️ Suitable for browser and server enviroments
 
---
### Outline:
- Kind of like a CSV transcoder <sup>_*1️⃣_</sup> for Objects
- The first line is a generated hashkey, which can be converted into object keys <sup>_*2️⃣_</sup>
- The remaining lines will be parsed, then transcoded with the keys <sup>_*3️⃣_</sup>
---
### Features:
- When initiating CJSON, "QuickKeys" can be specified; used for commonly used hashkeys - to help reduce size further
- gzip output; does not always reduce size though
---
### Technical Points:
- _1️⃣:_ Compressing does not require the <ins>___hash lookup___</ins> to've been generated (_Easisly validated server side_)
- _2️⃣:_ Converting a hashkey into keys _(and thus parsing)_ requires a <ins>___hash lookup___</ins> to've been generated
  - This can be done systematically/dynamically, _but might be slow for larger objects/higher possibilities_
  - Can be generated "as you go", or via rules [𝗧𝗢𝗗𝗢]
  - A presaved hash lookup can be loaded [𝗧𝗢𝗗𝗢]
  - Choose what you need, depeding on your required workflow: ie server or browser enviroment
- _3️⃣:_ Keys are sorted alphabetically to:
  - Ensure a correct match of each line to the corresponding key
  - Help reduce the amount of possible hashes
- Each line/object key value is JSON stringified / parsed,so can use the main json constructors ie:

       string, number, array, object & bool(? - just use a 0/1?)
- To save 1 char length for each entry, it will remove a trailing " } or ]

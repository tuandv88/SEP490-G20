import { registerExtension } from 'vscode/extensions';

var manifest = {name:"java",displayName:"%displayName%",description:"%description%",version:"1.0.0",publisher:"vscode",license:"MIT",engines:{vscode:"*"},scripts:{"update-grammar":"node ../node_modules/vscode-grammar-updater/bin redhat-developer/vscode-java language-support/java/java.tmLanguage.json ./syntaxes/java.tmLanguage.json"},categories:["Programming Languages"],contributes:{languages:[{id:"java",extensions:[".java",".jav"],aliases:["Java","java"],configuration:"./language-configuration.json"}],grammars:[{language:"java",scopeName:"source.java",path:"./syntaxes/java.tmLanguage.json"}],snippets:[{language:"java",path:"./snippets/java.code-snippets"}]},repository:{type:"git",url:"https://github.com/microsoft/vscode.git"},main:undefined};

const { registerFileUrl, whenReady } = registerExtension(manifest, undefined, {"system":true});
registerFileUrl('./syntaxes/java.tmLanguage.json', new URL('./resources/java.tmLanguage.json', import.meta.url).toString(), {"mimeType":"application/json","size":27444});
registerFileUrl('./language-configuration.json', new URL('./resources/language-configuration.json', import.meta.url).toString(), {"mimeType":"application/json","size":1355});
registerFileUrl('./snippets/java.code-snippets', new URL('./resources/java.code-snippets', import.meta.url).toString(), {"size":191});
registerFileUrl('package.json', new URL('./resources/package.json', import.meta.url).toString(), {"mimeType":"application/json","size":773});
registerFileUrl('package.nls.json', new URL('./resources/package.nls.json', import.meta.url).toString(), {"mimeType":"application/json","size":138});

export { whenReady };

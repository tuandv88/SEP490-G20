import { registerExtension } from 'vscode/extensions';

var manifest = {name:"theme-defaults",displayName:"%displayName%",description:"%description%",categories:["Themes"],version:"1.0.0",publisher:"vscode",license:"MIT",engines:{vscode:"*"},contributes:{themes:[{id:"Default Dark+",label:"%darkPlusColorThemeLabel%",uiTheme:"vs-dark",path:"./themes/dark_plus.json"},{id:"Default Dark Modern",label:"%darkModernThemeLabel%",uiTheme:"vs-dark",path:"./themes/dark_modern.json"},{id:"Default Light+",label:"%lightPlusColorThemeLabel%",uiTheme:"vs",path:"./themes/light_plus.json"},{id:"Default Light Modern",label:"%lightModernThemeLabel%",uiTheme:"vs",path:"./themes/light_modern.json"},{id:"Visual Studio Dark",label:"%darkColorThemeLabel%",uiTheme:"vs-dark",path:"./themes/dark_vs.json"},{id:"Visual Studio Light",label:"%lightColorThemeLabel%",uiTheme:"vs",path:"./themes/light_vs.json"},{id:"Default High Contrast",label:"%hcColorThemeLabel%",uiTheme:"hc-black",path:"./themes/hc_black.json"},{id:"Default High Contrast Light",label:"%lightHcColorThemeLabel%",uiTheme:"hc-light",path:"./themes/hc_light.json"}],iconThemes:[{id:"vs-minimal",label:"%minimalIconThemeLabel%",path:"./fileicons/vs_minimal-icon-theme.json"}]},repository:{type:"git",url:"https://github.com/microsoft/vscode.git"},main:undefined};

const { registerFileUrl, whenReady } = registerExtension(manifest, undefined, {"system":true});
registerFileUrl('./themes/dark_plus.json', new URL('./resources/dark_plus.json', import.meta.url).toString(), {"mimeType":"application/json","size":3645});
registerFileUrl('./themes/dark_modern.json', new URL('./resources/dark_modern.json', import.meta.url).toString(), {"mimeType":"application/json","size":4550});
registerFileUrl('./themes/light_plus.json', new URL('./resources/light_plus.json', import.meta.url).toString(), {"mimeType":"application/json","size":3686});
registerFileUrl('./themes/light_modern.json', new URL('./resources/light_modern.json', import.meta.url).toString(), {"mimeType":"application/json","size":5301});
registerFileUrl('./themes/dark_vs.json', new URL('./resources/dark_vs.json', import.meta.url).toString(), {"mimeType":"application/json","size":6142});
registerFileUrl('./themes/light_vs.json', new URL('./resources/light_vs.json', import.meta.url).toString(), {"mimeType":"application/json","size":7014});
registerFileUrl('./themes/hc_black.json', new URL('./resources/hc_black.json', import.meta.url).toString(), {"mimeType":"application/json","size":7042});
registerFileUrl('./themes/hc_light.json', new URL('./resources/hc_light.json', import.meta.url).toString(), {"mimeType":"application/json","size":8628});
registerFileUrl('./fileicons/vs_minimal-icon-theme.json', new URL('./resources/vs_minimal-icon-theme.json', import.meta.url).toString(), {"mimeType":"application/json","size":1094});
registerFileUrl('fileicons/images/root-folder-dark.svg', new URL('./resources/root-folder-dark.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":1061});
registerFileUrl('fileicons/images/root-folder-open-dark.svg', new URL('./resources/root-folder-open-dark.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":930});
registerFileUrl('fileicons/images/folder-dark.svg', new URL('./resources/folder-dark.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":615});
registerFileUrl('fileicons/images/folder-open-dark.svg', new URL('./resources/folder-open-dark.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":494});
registerFileUrl('fileicons/images/document-dark.svg', new URL('./resources/document-dark.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":278});
registerFileUrl('fileicons/images/root-folder-light.svg', new URL('./resources/root-folder-light.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":1061});
registerFileUrl('fileicons/images/root-folder-open-light.svg', new URL('./resources/root-folder-open-light.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":930});
registerFileUrl('fileicons/images/folder-light.svg', new URL('./resources/folder-light.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":615});
registerFileUrl('fileicons/images/folder-open-light.svg', new URL('./resources/folder-open-light.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":494});
registerFileUrl('fileicons/images/document-light.svg', new URL('./resources/document-light.svg', import.meta.url).toString(), {"mimeType":"image/svg+xml","size":278});
registerFileUrl('package.json', new URL('./resources/package.json', import.meta.url).toString(), {"mimeType":"application/json","size":1322});
registerFileUrl('package.nls.json', new URL('./resources/package.nls.json', import.meta.url).toString(), {"mimeType":"application/json","size":477});

export { whenReady };

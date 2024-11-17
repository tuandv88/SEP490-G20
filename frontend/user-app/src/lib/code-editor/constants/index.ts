import * as monaco from "monaco-editor";

export const JAVA_LANGUAGE_ID = "java";

export const JAVA_LANGUAGE_EXT_POINT: monaco.languages.ILanguageExtensionPoint =
  {
    id: "java",
    extensions: [".java"],
    aliases: ["Java", "java"],
    mimetypes: ["text/x-java-source"],
  };

export const JAVA_LANGUAGE_CONFIG: monaco.languages.LanguageConfiguration = {
  wordPattern:
    /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

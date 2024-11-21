using Learning.Application.Interfaces;

namespace Learning.Infrastructure.Services;
public class SourceCombiner : ISourceCombiner {
    public string MergeSourceCodesJava(string mainCode, string solutionCode) {
        // Tách ra các dòng của Main.java
        var mainLines = mainCode.Split(new[] { "\n" }, StringSplitOptions.None).ToList();
        var solutionLines = solutionCode.Split(new[] { "\n" }, StringSplitOptions.None).ToList();

        HashSet<string> imports = new HashSet<string>();

        foreach (var line in mainLines) {
            if (line.StartsWith("import ")) {
                imports.Add(line.Trim());
            }
        }

        foreach (var line in solutionLines) {
            if (line.StartsWith("import ")) {
                imports.Add(line.Trim());
            }
        }

        string combinedCode = string.Join("\n", imports) + "\n" + "\n";
        combinedCode += string.Join("\n", mainLines.Where(line => !line.StartsWith("import "))) + "\n" + "\n";
        combinedCode += string.Join("\n", solutionLines.Where(line => !line.StartsWith("import ")));
        return combinedCode;
    }
}


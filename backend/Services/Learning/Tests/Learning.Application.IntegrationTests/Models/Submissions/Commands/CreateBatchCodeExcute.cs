namespace Learning.Application.IntegrationTests.Models.Submissions.Commands;
using Learning.Application.Models.Submissions.Commands.CreateBatchCodeExcute;
using Learning.Application.Models.Submissions.Dtos;
using FluentAssertions;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Learning.Application.Models.TestCases.Dtos;

public class CreateBatchCodeExcuteTests : BaseTestFixture {
    [Test]
    public async Task ShouldRequireValidBatchCodeExecuteDto() {
        var command = new CreateBatchCodeExcuteCommand(
            BatchCodeExecuteDto: new BatchCodeExecuteDto(
                LanguageCode: "", // Invalid language code
                TestCode: "Console.WriteLine(\"Hello World\");",
                SolutionCodes: new List<string> { "Solution1" },
                TestCases: new List<TestCaseDto> { new TestCaseDto(new Dictionary<string, string> { { "input", "test" } }, "expected") }
            ),
            ResourceLimits: new ResourceLimits(
                CpuTimeLimit: 2.0f,
                CpuExtraTime: 0.5f,
                MemoryLimit: 64000,
                EnableNetwork: false,
                StackLimit: 64000,
                MaxThread: 20,
                MaxFileSize: 1024
            )
        );

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<ValidationException>();
    }

    [Test]
    public async Task ShouldCreateBatchCodeExecute() {
        // Arrange
        var batchCodeExecuteDto = new BatchCodeExecuteDto(
            LanguageCode: "Java",
            TestCode: "import java.io.ByteArrayOutputStream;\nimport java.io.PrintStream;\nimport java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        List<String> jsonOutputs = new ArrayList<>();\n        Scanner scanner = new Scanner(System.in);\n\n        // Read inputs for each test case\n        while (scanner.hasNextLine()) {\n            String numsLine = scanner.nextLine().trim();\n            if (numsLine.isEmpty()) continue;\n            String[] numsStr = numsLine.split(\"\\\\s+\");\n            int[] nums = Arrays.stream(numsStr).mapToInt(Integer::parseInt).toArray();\n\n            if (!scanner.hasNextLine()) break;\n            String targetLine = scanner.nextLine().trim();\n            if (targetLine.isEmpty()) continue;\n            int target = Integer.parseInt(targetLine);\n\n            // Run test case and add result to jsonOutputs\n            jsonOutputs.add(runTestCase(s, nums, target));\n        }\n\n        // Print the JSON array of all test case results\n        System.out.println(\"[\" + String.join(\", \", jsonOutputs) + \"]\");\n        scanner.close();\n    }\n\n    private static String runTestCase(Solution solution, int[] nums, int target) {\n        // Capture stdout\n        ByteArrayOutputStream stdoutBuffer = new ByteArrayOutputStream();\n        PrintStream originalOut = System.out;\n        System.setOut(new PrintStream(stdoutBuffer));\n\n        // Execute the twoSum method\n        int[] result = solution.twoSum(nums, target);\n\n        // Restore original stdout\n        System.setOut(originalOut);\n\n        // Convert result to string\n        String resultStr = Arrays.toString(result);\n\n        // Prepare JSON output\n        String stdoutStr = stdoutBuffer.toString().trim();\n        String jsonOutput = String.format(\"{\\\"Output\\\": \\\"%s\\\", \\\"Stdout\\\": \\\"%s\\\"}\",\n                                          resultStr,\n                                          stdoutStr.isEmpty() ? \"N/A\" : stdoutStr.replace(\"\\\"\", \"\\\\\\\"\") );\n\n        return jsonOutput;\n    }\n}",
            SolutionCodes: ["import java.util.HashMap;\nimport java.util.Map;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Thuật toán trả về kết quả\n        Map<Integer, Integer> numToIndex = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (numToIndex.containsKey(complement)) {\n                return new int[] {numToIndex.get(complement), i};\n            }\n            numToIndex.put(nums[i], i);\n        }\n        return new int[] {}; // No solution found!\n    }\n}", "import java.util.HashMap;\nimport java.util.Map;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Thuật toán trả về kết quả\n        Map<Integer, Integer> numToIndex = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (numToIndex.containsKey(complement)) {\n                return new int[] {numToIndex.get(complement), i};\n            }\n            numToIndex.put(nums[i], i);\n        }\n        return new int[] {}; // No solution found!\n    }\n}"],
            TestCases: 
            [
                new(
                    Inputs: new Dictionary<string, string> { { "nums", "2 7 11 15" }, { "target", "9" } },
                    ExpectedOutput: "[0, 1]"
                ),
                new(
                    Inputs: new Dictionary<string, string> { { "nums", "1 3 4" }, { "target", "7" } },
                    ExpectedOutput: "[1, 2]"
                ),
                new(
                    Inputs: new Dictionary<string, string> { { "nums", "1 3 4 2" }, { "target", "6" } },
                    ExpectedOutput: "[2, 3]"
                )
            ]
        );

        var resourceLimits = new ResourceLimits(
                CpuTimeLimit: 2.0f,
                CpuExtraTime: 0.5f,
                MemoryLimit: 64000,
                EnableNetwork: false,
                StackLimit: 64000,
                MaxThread: 20,
                MaxFileSize: 1024
            );

        var command = new CreateBatchCodeExcuteCommand(batchCodeExecuteDto, resourceLimits);

        // Act
        var result = await SendAsync(command);

        // Assert
        result.Should().NotBeNull();
        result.CodeExecuteDtos.Should().NotBeEmpty();
        result.CodeExecuteDtos.Count.Should().Be(batchCodeExecuteDto.SolutionCodes.Count);
        foreach (var codeExecuteDto in result.CodeExecuteDtos) {
            codeExecuteDto.Should().NotBeNull();
            codeExecuteDto.Status.Should().NotBeNull();
        }
    }

    [Test]
    public async Task ShouldThrowValidationExceptionForInvalidResourceLimits() {
        // Arrange
        var batchCodeExecuteDto = new BatchCodeExecuteDto(
            LanguageCode: "Java",
            TestCode: "Console.WriteLine(\"Hello World\");",
            SolutionCodes: new List<string> { "Solution1" },
            TestCases: new List<TestCaseDto> { new TestCaseDto(new Dictionary<string, string> { { "input", "test" } }, "expected") }
        );

        var resourceLimits = new ResourceLimits(
            CpuTimeLimit: -1, // Invalid limit
            CpuExtraTime: 1,
            MemoryLimit: 1024,
            EnableNetwork: false,
            StackLimit: 1024,
            MaxThread: 1,
            MaxFileSize: 1024
        );

        var command = new CreateBatchCodeExcuteCommand(batchCodeExecuteDto, resourceLimits);

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<ValidationException>();
    }
}
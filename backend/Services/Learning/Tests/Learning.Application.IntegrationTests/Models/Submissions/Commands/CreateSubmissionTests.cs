namespace Learning.Application.IntegrationTests.Models.Submissions.Commands;
using Learning.Application.Models.Submissions.Commands.CreateSubmission;
using Learning.Application.Models.Submissions.Dtos;
using FluentAssertions;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Learning.Application.Models.Problems.Commands.CreateProblem;
using Learning.Application.Models.Problems.Dtos;
using BuildingBlocks.Exceptions;

public class CreateSubmissionTests : BaseTestFixture {
    [Test]
    public async Task ShouldRequireValidLanguageCode() {
        var user = await RunAsAdministratorAsync();
        var createSubmissionDto = new SubmissionCodeDto(
            LanguageCode: "",
            SolutionCode: "print('Hello World')"
        );

        var command = new CreateSubmissionCommand(Guid.NewGuid(), createSubmissionDto);

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<ValidationException>();
    }

    [Test]
    public async Task ShouldCreateSubmission() {
        // Arrange
        var user = await RunAsAdministratorAsync();
        var problemId = await CreateTestProblemAsync(); // Assume this method creates a problem and returns it

        var createSubmissionDto = new SubmissionCodeDto(
            LanguageCode: "Java",
            SolutionCode: "import java.util.HashMap;\nimport java.util.Map;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Thuật toán trả về kết quả\n        Map<Integer, Integer> numToIndex = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (numToIndex.containsKey(complement)) {\n                return new int[] {numToIndex.get(complement), i};\n            }\n            numToIndex.put(nums[i], i);\n        }\n        return new int[] {}; // No solution found!\n    }\n}"
        );

        var command = new CreateSubmissionCommand(problemId, createSubmissionDto);

        // Act
        var result = await SendAsync(command);

        // Assert
        result.Should().NotBeNull();
        result.SubmissionId.Should().NotBe(Guid.Empty);
        result.SubmissionResponse.Should().NotBeNull();
        result.SubmissionResponse.SourceCode.Should().Be(createSubmissionDto.SolutionCode);
        result.SubmissionResponse.LanguageCode.Should().Be(createSubmissionDto.LanguageCode);
        result.SubmissionResponse.Status.Should().NotBeNull();
    }

    [Test]
    public async Task ShouldThrowNotFoundExceptionForInvalidProblemId() {
        // Arrange
        var user = await RunAsAdministratorAsync();
        var createSubmissionDto = new SubmissionCodeDto(
            LanguageCode: "Java",
            SolutionCode: "Console.WriteLine(\"Hello World\");"
        );

        var command = new CreateSubmissionCommand(Guid.NewGuid(), createSubmissionDto); // Invalid ProblemId

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<NotFoundException>();
    }

    private async Task<Guid> CreateTestProblemAsync() {
        var createProblemDto = new CreateProblemDto(
            Title: "Two Sum",
            Description: "Given an array of integers and a target value, return the indices of the two numbers that add up to the target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
            ProblemType: "Challenge",
            DifficultyType: "Easy",
            CpuTimeLimit: 2.0f,
            CpuExtraTime: 0.5f,
            MemoryLimit: 64000,
            EnableNetwork: false,
            StackLimit: 64000,
            MaxThread: 20,
            MaxFileSize: 1024,
            IsActive: true,
            CreateTestScriptDto:
            [
                new(
                    FileName: "Main.java",
                    Template: "public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Implement your logic here\n    }\n}",
                    TestCode: "import java.io.ByteArrayOutputStream;\nimport java.io.PrintStream;\nimport java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        List<String> jsonOutputs = new ArrayList<>();\n        Scanner scanner = new Scanner(System.in);\n\n        // Read inputs for each test case\n        while (scanner.hasNextLine()) {\n            String numsLine = scanner.nextLine().trim();\n            if (numsLine.isEmpty()) continue;\n            String[] numsStr = numsLine.split(\"\\\\s+\");\n            int[] nums = Arrays.stream(numsStr).mapToInt(Integer::parseInt).toArray();\n\n            if (!scanner.hasNextLine()) break;\n            String targetLine = scanner.nextLine().trim();\n            if (targetLine.isEmpty()) continue;\n            int target = Integer.parseInt(targetLine);\n\n            // Run test case and add result to jsonOutputs\n            jsonOutputs.add(runTestCase(s, nums, target));\n        }\n\n        // Print the JSON array of all test case results\n        System.out.println(\"[\" + String.join(\", \", jsonOutputs) + \"]\");\n        scanner.close();\n    }\n\n    private static String runTestCase(Solution solution, int[] nums, int target) {\n        // Capture stdout\n        ByteArrayOutputStream stdoutBuffer = new ByteArrayOutputStream();\n        PrintStream originalOut = System.out;\n        System.setOut(new PrintStream(stdoutBuffer));\n\n        // Execute the twoSum method\n        int[] result = solution.twoSum(nums, target);\n\n        // Restore original stdout\n        System.setOut(originalOut);\n\n        // Convert result to string\n        String resultStr = Arrays.toString(result);\n\n        // Prepare JSON output\n        String stdoutStr = stdoutBuffer.toString().trim();\n        String jsonOutput = String.format(\"{\\\"Output\\\": \\\"%s\\\", \\\"Stdout\\\": \\\"%s\\\"}\",\n                                          resultStr,\n                                          stdoutStr.isEmpty() ? \"N/A\" : stdoutStr.replace(\"\\\"\", \"\\\\\\\"\") );\n\n        return jsonOutput;\n    }\n}",
                    Description: "Main test script for the Two Sum problem.",
                    LanguageCode: "Java",
                    Solutions:
                    [
                        new(
                            FileName: "Solution.java",
                            SolutionCode: "import java.util.HashMap;\nimport java.util.Map;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Thuật toán trả về kết quả\n        Map<Integer, Integer> numToIndex = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (numToIndex.containsKey(complement)) {\n                return new int[] {numToIndex.get(complement), i};\n            }\n            numToIndex.put(nums[i], i);\n        }\n        return new int[] {}; // No solution found!\n    }\n}",
                            Description: "This is the solution for the Two Sum problem.",
                            LanguageCode: "Java",
                            Priority: true
                        )
                    ]
                )
            ],
            TestCases:
            [
                new(
                    Inputs: new Dictionary<string, string> { { "nums", "2 7 11 15" }, { "target", "9" } },
                    ExpectedOutput: "[0, 1]",
                    IsHidden: false,
                    OrderIndex: 1
                ),
                new(
                    Inputs: new Dictionary<string, string> { { "nums", "1 3 4" }, { "target", "7" } },
                    ExpectedOutput: "[1, 2]",
                    IsHidden: false,
                    OrderIndex: 2
                ),
                new(
                    Inputs: new Dictionary<string, string> { { "nums", "1 3 4 2" }, { "target", "6" } },
                    ExpectedOutput: "[2, 3]",
                    IsHidden: false,
                    OrderIndex: 3
                )
            ]
        );

        var command = new CreateProblemCommand() {
            LectureId = null,
            CreateProblemDto = createProblemDto
        };

        // Act
        var result = await SendAsync(command);

        return result.Id;
    }
}
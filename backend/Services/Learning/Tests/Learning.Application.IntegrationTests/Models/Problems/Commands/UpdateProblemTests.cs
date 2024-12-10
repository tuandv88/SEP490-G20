namespace Learning.Application.IntegrationTests.Models.Problems.Commands;
using Learning.Application.Models.Problems.Commands.UpdateProblem;
using Learning.Application.Models.Problems.Dtos;
using FluentAssertions;
using NUnit.Framework;
using Learning.Application.Models.TestCases.Dtos;
using Learning.Application.Models.TestScripts.Dtos;

public class UpdateProblemTests : BaseTestFixture {
    [Test]
    public async Task ShouldRequireMinimumFields() {
        var user = await RunAsAdministratorAsync();
        var updateProblemDto = new UpdateProblemDto(
            Title: "",
            Description: "",
            ProblemType: "",
            DifficultyType: "",
            CpuTimeLimit: -1,
            CpuExtraTime: 0,
            MemoryLimit: -1,
            EnableNetwork: false,
            StackLimit: -1,
            MaxThread: -1,
            MaxFileSize: -1,
            IsActive: true,
            Testcripts: new List<UpdateTestScriptDto>(),
            TestCases: new List<UpdateTestCaseDto>()
        );

        var command = new UpdateProblemCommand(Guid.NewGuid(), updateProblemDto);

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<ValidationException>();
    }

    [Test]
    public async Task ShouldUpdateProblem() {
        // Arrange
        var user = await RunAsAdministratorAsync();
        var existingProblem = await FirstAsync<Problem>();

        if(existingProblem == null) {
            return;
        }
        var updateProblemDto = new UpdateProblemDto(
            Title: "Two Sum",
            Description: "Given an array of integers and a target value, return the indices of the two numbers that add up to the target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
            ProblemType: "Challenge",
            DifficultyType: "Medium",
            CpuTimeLimit: 2.0f,
            CpuExtraTime: 0.5f,
            MemoryLimit: 64000,
            EnableNetwork: false,
            StackLimit: 64000,
            MaxThread: 20,
            MaxFileSize: 1024,
            IsActive: true,
            Testcripts:
            [
                new(
                    Id:null,
                    FileName: "Main.java",
                    Template: "public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Implement your logic here\n    }\n}",
                    TestCode: "import java.io.ByteArrayOutputStream;\nimport java.io.PrintStream;\nimport java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        List<String> jsonOutputs = new ArrayList<>();\n        Scanner scanner = new Scanner(System.in);\n\n        // Read inputs for each test case\n        while (scanner.hasNextLine()) {\n            String numsLine = scanner.nextLine().trim();\n            if (numsLine.isEmpty()) continue;\n            String[] numsStr = numsLine.split(\"\\\\s+\");\n            int[] nums = Arrays.stream(numsStr).mapToInt(Integer::parseInt).toArray();\n\n            if (!scanner.hasNextLine()) break;\n            String targetLine = scanner.nextLine().trim();\n            if (targetLine.isEmpty()) continue;\n            int target = Integer.parseInt(targetLine);\n\n            // Run test case and add result to jsonOutputs\n            jsonOutputs.add(runTestCase(s, nums, target));\n        }\n\n        // Print the JSON array of all test case results\n        System.out.println(\"[\" + String.join(\", \", jsonOutputs) + \"]\");\n        scanner.close();\n    }\n\n    private static String runTestCase(Solution solution, int[] nums, int target) {\n        // Capture stdout\n        ByteArrayOutputStream stdoutBuffer = new ByteArrayOutputStream();\n        PrintStream originalOut = System.out;\n        System.setOut(new PrintStream(stdoutBuffer));\n\n        // Execute the twoSum method\n        int[] result = solution.twoSum(nums, target);\n\n        // Restore original stdout\n        System.setOut(originalOut);\n\n        // Convert result to string\n        String resultStr = Arrays.toString(result);\n\n        // Prepare JSON output\n        String stdoutStr = stdoutBuffer.toString().trim();\n        String jsonOutput = String.format(\"{\\\"Output\\\": \\\"%s\\\", \\\"Stdout\\\": \\\"%s\\\"}\",\n                                          resultStr,\n                                          stdoutStr.isEmpty() ? \"N/A\" : stdoutStr.replace(\"\\\"\", \"\\\\\\\"\") );\n\n        return jsonOutput;\n    }\n}",
                    Description: "Main test script for the Two Sum problem.",
                    LanguageCode: "Java",
                    Solutions:
                    [
                        new(
                            Id: null,
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
                    Id: null,
                    Inputs: new Dictionary<string, string> { { "nums", "2 7 11 15" }, { "target", "9" } },
                    ExpectedOutput: "[0, 1]",
                    IsHidden: false,
                    OrderIndex: 1
                ),
                new(
                    Id: null,
                    Inputs: new Dictionary<string, string> { { "nums", "1 3 4" }, { "target", "7" } },
                    ExpectedOutput: "[1, 2]",
                    IsHidden: false,
                    OrderIndex: 2
                ),
                new(
                    Id: null,
                    Inputs: new Dictionary<string, string> { { "nums", "1 3 4 2" }, { "target", "6" } },
                    ExpectedOutput: "[2, 3]",
                    IsHidden: false,
                    OrderIndex: 3
                )
            ]
        );
        var command = new UpdateProblemCommand(existingProblem.Id.Value, updateProblemDto);

        // Act
        var result = await SendAsync(command);

        var updatedProblem = await FindAsync<Problem>(existingProblem.Id);

        // Assert
        updatedProblem.Should().NotBeNull();
        updatedProblem!.Title.Should().Be(updateProblemDto.Title);
        updatedProblem.Description.Should().Be(updateProblemDto.Description);
        updatedProblem.ProblemType.Should().Be(ProblemType.Challenge);
        updatedProblem.DifficultyType.Should().Be(DifficultyType.Medium);
        updatedProblem.CpuTimeLimit.Should().Be(updateProblemDto.CpuTimeLimit);
        updatedProblem.CpuExtraTime.Should().Be(updateProblemDto.CpuExtraTime);
        updatedProblem.MemoryLimit.Should().Be(updateProblemDto.MemoryLimit);
        updatedProblem.EnableNetwork.Should().Be(updateProblemDto.EnableNetwork);
        updatedProblem.StackLimit.Should().Be(updateProblemDto.StackLimit);
        updatedProblem.MaxThread.Should().Be(updateProblemDto.MaxThread);
        updatedProblem.MaxFileSize.Should().Be(updateProblemDto.MaxFileSize);
        updatedProblem.IsActive.Should().Be(updateProblemDto.IsActive);
        updatedProblem.LastModifiedBy.Should().Be(user.UserName);
    }
}
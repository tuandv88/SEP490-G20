using Course.Application.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Course.Application.Submissions.Commands.CreateSubmission;
public class CreateSubmissionHandler(IApplicationDbContext dbContext, ISubmissionService submissionService, IGFI compressionService)
    : ICommandHandler<CreateSubmissionCommand, CreateSubmissionResult>
{
    public async Task<CreateSubmissionResult> Handle(CreateSubmissionCommand request, CancellationToken cancellationToken)
    {
        byte[] data1 = Convert.FromBase64String(request.SubmissionDto.SourceCode);

        string coding = Encoding.UTF8.GetString(data1);
        byte[] data2 = Convert.FromBase64String(request.SubmissionDto.Stdin);

        string stdin = Encoding.UTF8.GetString(data2);
        //var submission = new Submission(@"
        //import java.util.Scanner;

        //public class Main {
        //    public static void main(String[] args) {
        //        Scanner scanner = new Scanner(System.in);
        //        System.out.print(""Enter your name: "");
        //        String name = scanner.nextLine(); // Đọc tên người dùng
        //        System.out.printf(""hello, %s\n"", name); // In ra lời chào
        //        scanner.close(); // Đóng Scanner
        //    }
        //}", 4) {
        //    Stdin = "Truong Bui",
        //    AdditionalFiles = ""
        //};

        //string codeBase64 = compressionService.CompressFolderToBase64(PathConstants.SOLUTION_PATH);
        //var submission = new Submission(null, 89) {
        //    AdditionalFiles = codeBase64,

        //};

        //IGltcG9ydCBqYXZhLnV0aWwuU2Nhbm5lcjsNCg0KIHB1YmxpYyBjbGFzcyBNYWluIHsNCiAgICAgcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgew0KICAgICAgICAgU2Nhbm5lciBzY2FubmVyID0gbmV3IFNjYW5uZXIoU3lzdGVtLmluKTsNCiAgICAgICAgIFN5c3RlbS5vdXQucHJpbnQoIkVudGVyIHlvdXIgbmFtZTogIik7DQogICAgICAgICBTdHJpbmcgbmFtZSA9IHNjYW5uZXIubmV4dExpbmUoKTsNCiAgICAgICAgIFN5c3RlbS5vdXQucHJpbnRmKCJoZWxsbywgJXNcbiIsIG5hbWUpOw0KICAgICAgICAgc2Nhbm5lci5jbG9zZSgpOw0KICAgICB9DQogfQ==
        //VHJ1b25nIEJ1aQ==

        var submission = new Submission(coding, request.SubmissionDto.LanguageId) {
            Stdin = stdin
        };
        var response = await submissionService.CreateAsync(submission, wait: true);
        //dbContext.Problems.Select

        return new CreateSubmissionResult(response);
    }
}


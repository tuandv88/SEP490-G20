import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle } from "lucide-react";

const chapters = [
  {
    id: "chapter-1",
    title: "Lộ trình Kubernetes",
    lessons: [
      {
        id: "lesson-0",
        title: "Bài 0. Lộ trình kubernetes và lưu ý quan trọng",
        duration: "15:00"
      }
    ]
  },
  {
    id: "chapter-2", 
    title: "Mở đầu với Kubernetes",
    lessons: [
      {
        id: "lesson-1",
        title: "Bài 1. Giới thiệu về Kubernetes",
        duration: "20:00"
      },
      {
        id: "lesson-2", 
        title: "Bài 2. Kiến trúc Kubernetes",
        duration: "25:00"
      }
    ]
  },
  {
    id: "chapter-3",
    title: "Cài đặt cụm Kubernetes",
    lessons: [
      {
        id: "lesson-3",
        title: "Bài 3. Cài đặt Kubernetes cluster",
        duration: "30:00"
      },
      {
        id: "lesson-4",
        title: "Bài 4. Cấu hình kubectl",
        duration: "15:00"
      }
    ]
  },
  {
    id: "chapter-4",
    title: "Triển khai dự án trên Kubernetes",
    lessons: [
      {
        id: "lesson-5",
        title: "Bài 5. Pods và Deployments",
        duration: "35:00"
      },
      {
        id: "lesson-6",
        title: "Bài 6. Services và Networking",
        duration: "40:00"
      }
    ]
  },
  {
    id: "chapter-5", 
    title: "Triển khai công cụ trên kubernetes",
    lessons: [
      {
        id: "lesson-7",
        title: "Bài 7. Monitoring với Prometheus",
        duration: "45:00"
      },
      {
        id: "lesson-8",
        title: "Bài 8. Logging với ELK Stack",
        duration: "35:00"
      }
    ]
  },
  {
    id: "chapter-6",
    title: "Giám sát và quản trị cụm kubernetes",
    lessons: [
      {
        id: "lesson-9",
        title: "Bài 9. Quản lý tài nguyên",
        duration: "30:00"
      },
      {
        id: "lesson-10",
        title: "Bài 10. Bảo mật và RBAC",
        duration: "40:00"
      }
    ]
  },
  {
    id: "chapter-7",
    title: "Kubernetes thực tế doanh nghiệp",
    lessons: [
      {
        id: "lesson-11",
        title: "Bài 11. Case Studies",
        duration: "50:00"
      },
      {
        id: "lesson-12",
        title: "Bài 12. Best Practices",
        duration: "45:00"
      }
    ]
  }
];

function Curriculum3() {
  return (
    <div className="min-h-screen bg-[#1b2a32] text-white p-8 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Khóa học Kubernetes</h1>
        
        <Accordion type="single" collapsible className="space-y-4">
          {chapters.map((chapter) => (
            <AccordionItem 
              key={chapter.id} 
              value={chapter.id}
              className="border border-white/10 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-lg font-medium">
                {chapter.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 py-2 space-y-2">
                  {chapter.lessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <PlayCircle className="w-5 h-5 text-white/60" />
                      <div className="flex-1">
                        <p className="text-sm text-white/90">{lesson.title}</p>
                        <p className="text-xs text-white/60">{lesson.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Curriculum3;
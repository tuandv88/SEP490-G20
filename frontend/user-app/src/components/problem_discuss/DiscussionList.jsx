
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DiscussionList({ discussions }) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <Card key={discussion.id} className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={discussion.author.avatar} />
                <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 line-clamp-1">{discussion.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{discussion.preview}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    <span>{discussion.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    <span>{discussion.replies}</span>
                  </div>
                  <span>{discussion.timeAgo}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
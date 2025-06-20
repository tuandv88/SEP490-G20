
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export function DiscussionList({ discussions }) {
  const navigate = useNavigate()
  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <Card className="hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/discussion/${discussion.id}`)}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={discussion.avatar || '/default-avatar.png'} />
              <AvatarFallback>{discussion.userName ? discussion.userName[0] : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 line-clamp-1">{discussion.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{discussion.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {discussion.tags.map((tag) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                ))}
              </div>
  
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  <span>{discussion.voteCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{discussion.commentCount}</span>
                </div>
                <span>{new Date(discussion.dateCreated).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Posted by {discussion.userName || 'Unknown User'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      ))}
    </div>
  );
}
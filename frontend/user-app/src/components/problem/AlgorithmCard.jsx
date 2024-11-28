import { ThumbsUp, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DifficultyBadge } from "./DifficultyBadge";


export function AlgorithmCard({ algorithm }) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{algorithm.title}</h3>
          <DifficultyBadge difficulty={algorithm.difficulty} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{algorithm.description}</p>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>Time: {algorithm.timeComplexity}</span>
            <span>Space: {algorithm.spaceComplexity}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-1">
              <ThumbsUp size={14} />
              <span>{algorithm.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{algorithm.submissions}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>{algorithm.successRate}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
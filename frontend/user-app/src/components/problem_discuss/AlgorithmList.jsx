
import { Card, CardContent } from "@/components/ui/card";

import { Users, ThumbsUp } from "lucide-react";
import { DifficultyBadge } from "../problem/DifficultyBadge";


export function AlgorithmList({ algorithms }) {
  return (
    <div className="space-y-4">
      {algorithms.map((algorithm) => (
        <Card key={algorithm.id} className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{algorithm.title}</h3>
              <DifficultyBadge difficulty={algorithm.difficulty} />
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{algorithm.successRate}% success</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp size={16} />
                <span>{algorithm.likes} likes</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {algorithm.category.split(",").map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
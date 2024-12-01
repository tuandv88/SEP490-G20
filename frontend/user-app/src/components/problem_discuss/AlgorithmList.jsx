
import { Card, CardContent } from "@/components/ui/card";

import { Users, ThumbsUp } from "lucide-react";
import { DifficultyBadge } from "../problem/DifficultyBadge";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import authServiceInstance from "@/oidc/AuthService";


export function AlgorithmList({ problems }) {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  
  const handleClick = (problemId) => {
    if (user) {
      navigate(`/problem-solve/${problemId}`)
    } else {
      authServiceInstance.login()
    }
  }

  return (
    <div className="space-y-4">
      {problems.map((algorithm) => (
        <Card onClick={() => handleClick(algorithm.problemsId)} key={algorithm.problemsId} className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{algorithm.title}</h3>
              <DifficultyBadge difficulty={algorithm.difficulty} />
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Acceptance: {algorithm.acceptanceRate !== -1 ? '0' : algorithm.acceptanceRate} %</span>
              </div>              
            </div>         
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
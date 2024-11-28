import { Badge } from "@/components/ui/badge";


const difficultyColors = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};

export function DifficultyBadge({ difficulty }) {
  return (
    <Badge variant="secondary" className={`${difficultyColors[difficulty]} font-medium`}>
      {difficulty}
    </Badge>
  );
}
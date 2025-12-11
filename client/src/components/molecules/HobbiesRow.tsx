import { Badge } from "../atoms";

type HobbiesRowProps = {
  hobbies: string[];
  maxDisplay?: number;
};

export function HobbiesRow({ hobbies, maxDisplay = 2 }: HobbiesRowProps) {
  const displayed = hobbies.slice(0, maxDisplay);
  const remaining = hobbies.length - maxDisplay;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {displayed.map((hobby) => (
        <Badge key={hobby}>{hobby}</Badge>
      ))}
      {remaining > 0 && <Badge variant="muted">+{remaining}</Badge>}
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate: Date | undefined;
}

interface TaskListProps {
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, toggleTask, deleteTask }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col p-3 bg-secondary rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.description}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTask(task.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {task.dueDate && (
            <div className="mt-2 text-sm text-gray-600">
              Due: {format(task.dueDate, "PPP")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
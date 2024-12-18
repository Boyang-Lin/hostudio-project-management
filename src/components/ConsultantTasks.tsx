import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate: Date | undefined;
  relatedTasks: string[];
}

interface ConsultantTasksProps {
  consultant: {
    name: string;
    email: string;
    phone: string;
    specialty: string;
  };
  onClose: () => void;
  allTasks?: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
}

export function ConsultantTasks({ consultant, onClose, allTasks = [], onTasksUpdate }: ConsultantTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedRelatedTasks, setSelectedRelatedTasks] = useState<string[]>([]);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [
        ...tasks,
        {
          id: crypto.randomUUID(),
          description: newTask,
          completed: false,
          dueDate: selectedDate,
          relatedTasks: selectedRelatedTasks,
        },
      ];
      setTasks(updatedTasks);
      onTasksUpdate?.(updatedTasks);
      setNewTask("");
      setSelectedDate(undefined);
      setSelectedRelatedTasks([]);
    }
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    onTasksUpdate?.(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    onTasksUpdate?.(updatedTasks);
  };

  const toggleRelatedTask = (taskId: string) => {
    setSelectedRelatedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleClose = () => {
    onTasksUpdate?.(tasks);
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          Tasks for {consultant.name}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {allTasks && allTasks.length > 0 && (
            <div className="mt-4 border rounded-lg p-4 bg-secondary/50">
              <h3 className="text-sm font-medium mb-2">Link Related Tasks:</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 hover:bg-secondary rounded">
                    <input
                      type="checkbox"
                      checked={selectedRelatedTasks.includes(task.id)}
                      onChange={() => toggleRelatedTask(task.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{task.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
              
              {task.relatedTasks.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600">Related Tasks:</div>
                  <div className="ml-4">
                    {task.relatedTasks.map(relatedTaskId => {
                      const relatedTask = allTasks.find(t => t.id === relatedTaskId);
                      return (
                        <div key={relatedTaskId} className="text-sm text-gray-600">
                          • {relatedTask?.description || "Task not found"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
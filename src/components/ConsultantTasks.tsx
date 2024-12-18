import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TaskInput } from "./tasks/TaskInput";
import { TaskList } from "./tasks/TaskList";

interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate: Date | undefined;
}

interface ConsultantTasksProps {
  consultant: {
    name: string;
    email: string;
    phone: string;
    specialty: string;
  };
  onClose: () => void;
  onTasksUpdate?: (tasks: Task[]) => void;
}

export function ConsultantTasks({ consultant, onClose, onTasksUpdate }: ConsultantTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [
        ...tasks,
        {
          id: crypto.randomUUID(),
          description: newTask,
          completed: false,
          dueDate: selectedDate,
        },
      ];
      setTasks(updatedTasks);
      onTasksUpdate?.(updatedTasks);
      setNewTask("");
      setSelectedDate(undefined);
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
        <TaskInput
          newTask={newTask}
          setNewTask={setNewTask}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          addTask={addTask}
        />
        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      </CardContent>
    </Card>
  );
}
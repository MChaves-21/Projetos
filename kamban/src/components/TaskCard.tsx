import { Badge, Button, Card, Flex, Text } from "@radix-ui/themes"
import { Task, TaskPriority, TaskStatus } from "../entities/Task"

interface TaskCardProps {
  task: Task
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getActionText = (status: TaskStatus) => {
    const actionTexts = {
      "todo": "Iniciar",
      "doing": "Concluir",
      "done": "Arquivar"
    }
    return actionTexts[status]
  }

  const getActionColor = (status: TaskStatus) => {
    const actionColors: { [key: string]: "indigo" | "green" | "bronze" } = {
      "todo": "indigo",
      "doing": "green",
      "done": "bronze"
    }
    return actionColors[status]
  }

  const getPriorityColor = (priority: TaskPriority) => {
    const priorityColors: { [key: string]: "sky" | "amber" | "tomato" } = {
      "low": "sky",
      "medium": "amber",
      "high": "tomato"
    }
    return priorityColors[priority]
  }

  return (
    <Card>
      <Flex align="center" gap="4">
        <Text weight="bold">{task.title}</Text>
        <Badge color={getPriorityColor(task.priority)}>{task.priority}</Badge>
      </Flex>
      <Text as="p" my="3">{task.description}</Text>
      <Flex gap="2">
        <Button color={getActionColor(task.status)} onClick={update}>
          {getActionText(task.status)}
        </Button>
        <Button color="red">Excluir</Button>
      </Flex>
    </Card>
  )
}
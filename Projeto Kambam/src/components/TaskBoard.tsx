import { TaskCard } from "./TaskCard"
import { Badge, Flex, Grid, ScrollArea } from "@radix-ui/themes"

export const TaskBoard: React.FC = () => {

    const tasksTodo = 
  const tasksInProgress = 
  const tasksDone = 

  return (
        <ScrollArea scrollbars="horizontal">
            <Grid columns="3" gap="4" minWidth="64rem">
                <Flex direction="column" gap="4">
                    <Badge size="3" color="gray">
                        Para Fazer ({tasksTodo.length})
                    </Badge>
                    {tasksTodo.map((task) => <TaskCard key={task.id} task={task} />)}
                </Flex>

                <Flex direction="column" gap="4">
                    <Badge size="3" color="yellow">
                        Em Progresso ({tasksInProgress.length})
                    </Badge>
                    {tasksInProgress.map((task) => <TaskCard key={task.id} task={task} />)}
                </Flex>

                <Flex direction="column" gap="4">
                    <Badge size="3" color="green">
                        Concluídas ({tasksDone.length})
                    </Badge>
                    {tasksDone.map((task) => <TaskCard key={task.id} task={task} />)}
                </Flex>
            </Grid>
        </ScrollArea>
    )
}
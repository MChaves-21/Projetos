import { CreateTaskForm } from "./components/CreateTaskForm";
import { TaskBoard } from "./components/TaskBoard";
import { Box, Flex, Heading } from "@radix-ui/themes";

function App() {
  return (
    <Box maxWidth="80rem" mx="auto">
      <Box height="4rem" px="4">
        <Flex align="center" gap="4" height="100%">
          <Heading size="8" weight="light">React Kanban</Heading>
          <CreateTaskForm />
        </Flex>
      </Box>

      <Box px="4" maxWidth="80rem" mx="auto">
        <h2 className="mb-3">Quadro de tarefas</h2>
        <TaskBoard />
      </Box>
    </Box>
  )
}

export default App
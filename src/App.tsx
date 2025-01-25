import { Flex } from "@chakra-ui/react";
import WeatherCard from "./components/WeatherCard";

function App() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-950">
      <Flex direction={"column"} justifyContent={"center"} align={"center"}>
        <WeatherCard />
      </Flex>
    </div>
  );
}

export default App;

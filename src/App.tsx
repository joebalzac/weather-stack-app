import { Flex } from "@chakra-ui/react";
import WeatherCard from "./components/WeatherCard";

function App() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-950">
      <Flex direction={"column"} justifyContent={"center"} align={"center"}>
        <h1 className="text-3xl text-blue-700 pb-12">Weather Card</h1>
        <WeatherCard />
      </Flex>
    </div>
  );
}

export default App;

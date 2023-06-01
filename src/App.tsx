import { ContextProvider } from "./components/Context";
import Main from "./components/Main";

const App = () => {
  return (
    <>
      <ContextProvider>
        <Main />
      </ContextProvider>
    </>
  );
};

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Setting from "./pages/setting/Setting";
import ChatInterface from "./pages/chatInterface/ChatInterface";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<Setting />} />
            <Route path="/chatInterface" element={<ChatInterface />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

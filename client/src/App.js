import { BrowserRouter, Route, Routes } from "react-router-dom";
import Setting from "./pages/setting/Setting";
import ChatInterface from "./pages/chatInterface/ChatInterface";
import Navbar from "./components/navbar/Navbar";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Navbar />
          <Routes>
            <Route path="/" element={<Setting />} />
            <Route path="/chat-interface" element={<ChatInterface />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

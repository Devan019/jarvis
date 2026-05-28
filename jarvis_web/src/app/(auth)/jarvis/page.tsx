import { Dashboard } from "./components/Dashboard";
import { DeepgramContextProvider } from "./context/DeepgramContext";
import { MicrophoneContextProvider } from "./context/MicrophoneContext";
import { SocketProvider } from "./context/SocketContext";

export default function Page() {
  return (
    <DeepgramContextProvider>
      <MicrophoneContextProvider>
         <SocketProvider>
            <Dashboard />
         </SocketProvider>
      </MicrophoneContextProvider>
    </DeepgramContextProvider>
  );
}

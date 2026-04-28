import { Dashboard } from "./components/Dashboard";
import { SocketProvider } from "./context/SocketContext";

export default function Page() {
  return (
    <SocketProvider>
      <Dashboard />
    </SocketProvider>
  );
}

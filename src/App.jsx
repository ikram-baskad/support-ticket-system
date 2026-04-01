import { useState }       from "react";
import "noplin-uis/dist/styles.css";
import { TicketProvider } from "./context/TicketContext";
import { UserProvider }   from "./context/UserContext";
import { Dashboard }      from "./pages/Dashboard/Dashboard";
import { CreateTicket }   from "./pages/CreateTicket/CreateTicket";
import { TicketDetail }   from "./pages/TicketDetail/TicketDetail";
import { Footer }         from "./components/common/Footer";
import { useUserContext } from "./context/UserContext";
import { MOCK_USERS }     from "./data/users.data";

function RoleSwitcher() {
  const { currentUser, switchUser } = useUserContext();
  return (
    <div style={{
      position: "fixed", bottom: 16, right: 16,
      background: "#1a1d23", color: "#fff",
      padding: "10px 14px", borderRadius: "10px",
      fontSize: "12px", zIndex: 9999,
      display: "flex", flexDirection: "column", gap: "6px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    }}>
      <span style={{ fontWeight: 700, color: "#9ca3af" }}>
        DEV: Switch User
      </span>
      {MOCK_USERS.map((u) => (
        <button
          key={u.id}
          onClick={() => switchUser(u.id)}
          style={{
            background: currentUser.id === u.id ? "#4F6EF7" : "transparent",
            border: "1px solid #374151",
            color: "#fff", borderRadius: "6px",
            padding: "4px 10px", cursor: "pointer",
            fontSize: "12px", textAlign: "left"
          }}
        >
          {u.name} ({u.role})
        </button>
      ))}
    </div>
  );
}

function AppContent() {
  const [nav, setNav] = useState({ page: "dashboard", id: null });
  const handleNavigate = (page, id = null) => setNav({ page, id });

  const renderPage = () => {
    switch (nav.page) {
      case "dashboard": return <Dashboard    onNavigate={handleNavigate} />;
      case "create":    return <CreateTicket onNavigate={handleNavigate} />;
      case "detail":    return <TicketDetail onNavigate={handleNavigate} ticketId={nav.id} />;
      default:          return <Dashboard    onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Footer />
      <RoleSwitcher />
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <TicketProvider>
        <AppContent />
      </TicketProvider>
    </UserProvider>
  );
}

export default App;
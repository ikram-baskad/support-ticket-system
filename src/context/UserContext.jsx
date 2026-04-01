import { createContext, useContext, useState } from "react";
import { MOCK_USERS } from "../data/users.data";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // Simulates "who is logged in"
  // In a real app this comes from an auth token
  // Default to the first user (Alex, a regular user)
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);

  // Lets you switch roles to test both user and agent views
  const switchUser = (userId) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, switchUser, allUsers: MOCK_USERS }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used inside a <UserProvider>");
  }
  return context;
}
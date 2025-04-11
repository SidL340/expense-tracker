import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: 0,
    description: ''
  });
  const [value, setValue] = useState("expense");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
      loadUserTransactions(JSON.parse(user).id);
    }
  }, []);

  function handleFormSubmit(currentformdata) {
    if (currentformdata.description && currentformdata.amount) {
      const newTransaction = { 
        ...currentformdata, 
        id: Date.now(),
        userId: currentUser?.id 
      };
      setAllTransactions([...allTransactions, newTransaction]);
    }
  }

  function loadUserTransactions(userId) {
    const userTransactions = localStorage.getItem(`transactions_${userId}`);
    if (userTransactions) {
      setAllTransactions(JSON.parse(userTransactions));
    }
  }

  function saveUserTransactions(userId, transactions) {
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
  }

  function loginUser(user) {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    loadUserTransactions(user.id);
  }

  function logoutUser() {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAllTransactions([]);
    localStorage.removeItem('currentUser');
  }

  function registerUser(user) {
    // In a real app, you would hash the password before storing
    const newUser = { ...user, id: Date.now() };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    loginUser(newUser);
  }

  // Save transactions when they change
  useEffect(() => {
    if (currentUser && allTransactions.length > 0) {
      saveUserTransactions(currentUser.id, allTransactions);
    }
  }, [allTransactions, currentUser]);

  return (
    <GlobalContext.Provider value={{
      formData,
      setFormData,
      value,
      setValue,
      totalIncome,
      setTotalIncome,
      totalExpense,
      setTotalExpense,
      allTransactions,
      setAllTransactions,
      handleFormSubmit,
      currentUser,
      isAuthenticated,
      loginUser,
      logoutUser,
      registerUser
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

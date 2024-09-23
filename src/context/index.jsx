import { createContext, useState } from "react";

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

  function handleFormSubmit(currentformdata) {
    if (currentformdata.description && currentformdata.amount) {
      setAllTransactions([...allTransactions, { ...currentformdata, id: Date.now() }]);
    }
  }
console.log(allTransactions);
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
      handleFormSubmit
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

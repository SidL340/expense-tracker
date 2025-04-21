import { createContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc,
  getFirestore
} from "firebase/firestore";

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
  const [isLoading, setIsLoading] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);

  const db = getFirestore();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(user.emailVerified);
        if (!user.emailVerified) {
          loadUserTransactions(user.uid);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAllTransactions([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleFormSubmit(currentformdata) {
    if (currentformdata.description && currentformdata.amount) {
      try {
        const newTransaction = { 
          ...currentformdata, 
          userId: currentUser.uid,
          createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, "transactions"), newTransaction);
        setAllTransactions([...allTransactions, { ...newTransaction, id: docRef.id }]);
      } catch (error) {
        console.error("Error adding transaction: ", error);
      }
    }
  }

  async function loadUserTransactions(userId) {
    try {
      const q = query(collection(db, "transactions"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ ...doc.data(), id: doc.id });
      });
      setAllTransactions(transactions);
    } catch (error) {
      console.error("Error loading transactions: ", error);
    }
  }

  async function deleteTransaction(transactionId) {
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
      setAllTransactions(allTransactions.filter(t => t.id !== transactionId));
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  }

  async function loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        throw new Error("Please verify your email before logging in");
      }
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async function registerUser(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with name
      await updateProfile(user, {
        displayName: name
      });

      // Send verification email
      await sendEmailVerification(user);
      setVerificationSent(true);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async function resendVerificationEmail() {
    try {
      if (currentUser) {
        await sendEmailVerification(currentUser);
        setVerificationSent(true);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async function logoutUser() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Calculate totals whenever transactions change
  useEffect(() => {
    let income = 0;
    let expense = 0;

    allTransactions.forEach((item) => {
      if (item.type === "income") {
        income += parseFloat(item.amount);
      } else {
        expense += parseFloat(item.amount);
      }
    });

    setTotalExpense(expense);
    setTotalIncome(income);
  }, [allTransactions]);

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
      deleteTransaction,
      currentUser,
      isAuthenticated,
      isLoading,
      verificationSent,
      loginUser,
      loginWithGoogle,
      logoutUser,
      registerUser,
      resendVerificationEmail,
      resetPassword
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

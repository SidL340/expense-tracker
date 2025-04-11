import { 
  Button, 
  Flex, 
  Heading, 
  Text, 
  Avatar, 
  Box 
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import Overview from "../overview/overview";
import ExpenseView from "../expense-view";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    totalExpense,
    allTransactions,
    setAllTransactions,
    setTotalExpense,
    totalIncome,
    setTotalIncome,
    currentUser,
    logoutUser
  } = useContext(GlobalContext);

  // Load transactions from local storage when the component mounts
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      console.log("Loading transactions from local storage...");
      setAllTransactions(JSON.parse(storedTransactions));
    }
  }, [setAllTransactions]);

  // Save transactions to local storage when allTransactions changes
  useEffect(() => {
    console.log("Saving transactions to local storage...");
    localStorage.setItem("transactions", JSON.stringify(allTransactions));
  }, [allTransactions]);

  // Recalculate totals whenever allTransactions changes
  useEffect(() => {
    console.log("Calculating totals...");
    let income = 0;
    let expense = 0;

    allTransactions.forEach((item) => {
      console.log(`Processing transaction: ${item.description}, Type: ${item.type}, Amount: ${item.amount}`);
      if (item.type === "income") {
        income += parseFloat(item.amount);
      } else {
        expense += parseFloat(item.amount);
      }
    });

    setTotalExpense(expense);
    setTotalIncome(income);
  }, [allTransactions, setTotalExpense, setTotalIncome]);

  // Function to clear all transactions
  const clearAllTransactions = () => {
    setAllTransactions([]); // Reset the transactions in the state
    setTotalIncome(0); // Reset income total
    setTotalExpense(0); // Reset expense total
    localStorage.removeItem("transactions"); // Clear the local storage
    console.log("All transactions have been cleared.");
  };

  // Debugging logs
  console.log("All Transactions:", allTransactions);
  const incomeTransactions = allTransactions.filter((item) => item.type === "income");
  console.log("Filtered Income Transactions:", incomeTransactions);

  return (
    <Flex textAlign={"center"} flexDirection={"column"} pr={"5"} pl={"5"}>
      <Flex alignItems={"center"} justifyContent={"space-between"} mt={"12"}>
        <Flex alignItems={"center"}>
          <Avatar name={currentUser?.name} size="sm" mr={2} />
          <Box>
            <Heading
              color={"blue.400"}
              display={["none", "block", "block", "block", "block"]}
              size="md"
            >
              Expense Tracker
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Welcome, {currentUser?.name}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems={"center"}>
          <Button onClick={onOpen} bg={"blue.300"} color={"black"} ml={"4"}>
            Add New Transaction
          </Button>
          <Button 
            onClick={clearAllTransactions} 
            bg={"red.300"} 
            color={"white"} 
            ml={"4"}
          >
            Clear All Transactions
          </Button>
          <Button 
            onClick={() => navigate('/financial-tools')}
            bg={"green.300"} 
            color={"black"} 
            ml={"4"}
          >
            Financial Tools
          </Button>
          <Button 
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            bg={"gray.300"} 
            color={"black"} 
            ml={"4"}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
      <Overview
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        isOpen={isOpen}
        onClose={onClose}
      />

      <Flex
        w="full"
        alignItems={"flex-start"}
        justifyContent={"space-evenly"}
        flexDirection={["column", "column", "column", "row", "row"]}
      >
        <ExpenseView
          data={allTransactions.filter((item) => item.type === "expense")}
          type={"expense"}
        />
        <ExpenseView
          data={incomeTransactions} // Using the filtered variable here
          type={"income"}
        />
      </Flex>
    </Flex>
  );
}

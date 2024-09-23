import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import Overview from "../overview/overview";
import ExpenseView from "../expense-view";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context";

export default function Main() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    totalExpense,
    allTransactions,
    setAllTransactions,  // Assuming you have this to update transactions in the context
    setTotalExpense,
    totalIncome,
    setTotalIncome,
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
        <Heading
          color={"blue.400"}
          display={["none", "block", "block", "block", "block"]}
        >
          Expense Tracker
        </Heading>
        <Flex alignItems={"center"}>
          <Button onClick={onOpen} bg={"blue.300"} color={"black"} ml={"4"}>
            Add New Transaction
          </Button>
          <Button onClick={clearAllTransactions} bg={"red.300"} color={"white"} ml={"4"}>
            Clear All Transactions
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

import { 
  Button, 
  Flex, 
  Heading, 
  Text, 
  Avatar, 
  Box,
  Spinner
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
    logoutUser,
    isLoading
  } = useContext(GlobalContext);

  // Recalculate totals whenever transactions change
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
  }, [allTransactions, setTotalExpense, setTotalIncome]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Flex textAlign={"center"} flexDirection={"column"} pr={"5"} pl={"5"}>
      <Flex alignItems={"center"} justifyContent={"space-between"} mt={"12"}>
        <Flex alignItems={"center"}>
          <Avatar name={currentUser?.displayName || currentUser?.email} size="sm" mr={2} />
          <Box>
            <Heading
              color={"blue.400"}
              display={["none", "block", "block", "block", "block"]}
              size="md"
            >
              Expense Tracker
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Welcome, {currentUser?.displayName || currentUser?.email}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems={"center"}>
          <Button onClick={onOpen} bg={"blue.300"} color={"black"} ml={"4"}>
            Add New Transaction
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
            onClick={handleLogout}
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
          data={allTransactions.filter((item) => item.type === "income")}
          type={"income"}
        />
      </Flex>
    </Flex>
  );
}

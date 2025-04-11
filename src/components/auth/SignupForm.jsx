import { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading
} from "@chakra-ui/react";
import { GlobalContext } from "../../context";

export default function SignupForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useContext(GlobalContext);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!name || !email || !password) {
      toast({
        title: "All fields are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        registerUser({ name, email, password });
        toast({
          title: "Account created",
          description: "You have been logged in automatically",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onSuccess?.();
      } catch (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Heading mb={6} textAlign="center">Create Account</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

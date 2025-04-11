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

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(GlobalContext);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    setTimeout(() => {
      if (user) {
        loginUser(user);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onSuccess?.();
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password",
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
      <Heading mb={6} textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
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
              placeholder="Enter your password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Login
          </Button>
          <Button
            onClick={() => window.location.href = '/signup'}
            variant="link"
            colorScheme="blue"
            mt={4}
          >
            Don't have an account? Sign up
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

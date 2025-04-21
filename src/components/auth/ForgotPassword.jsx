import { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
  Container,
  useMediaQuery
} from "@chakra-ui/react";
import { GlobalContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdError } from "react-icons/md";
import "../../styles/animations.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useContext(GlobalContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setResetSent(true);
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = "An error occurred while sending the reset email.";
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many reset attempts. Please try again later.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <Container maxW="container.sm" py={8}>
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="auto"
          p={6}
          borderRadius="lg"
          className={`card-hover-effect ${isLargerThan768 ? 'fade-in' : 'mobile-fade-in'}`}
        >
          <AlertIcon boxSize="40px" mr={0} className="checkmark" />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Password Reset Email Sent
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            <List spacing={3} mt={4} textAlign="left">
              <ListItem>
                <ListIcon as={MdCheckCircle} color="green.500" className="checkmark" />
                Check your email inbox for the password reset link
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color="green.500" className="checkmark" />
                The link will expire in 1 hour
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color="green.500" className="checkmark" />
                If you don't see the email, check your spam folder
              </ListItem>
            </List>
          </AlertDescription>
          <Button
            mt={6}
            colorScheme="blue"
            onClick={() => navigate('/login')}
            className="button-hover-effect"
          >
            Back to Login
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Box
        className={`card-hover-effect ${isLargerThan768 ? 'fade-in' : 'mobile-fade-in'}`}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading 
          mb={6} 
          textAlign="center"
          className={isLargerThan768 ? 'slide-in' : 'mobile-slide-in'}
        >
          Reset Password
        </Heading>
        <Text 
          mb={6} 
          textAlign="center" 
          color="gray.600"
          className={isLargerThan768 ? 'fade-in' : 'mobile-fade-in'}
        >
          Enter your email address and we'll send you instructions to reset your password.
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-focus-effect"
                size="lg"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              size="lg"
              isLoading={isLoading}
              loadingText="Sending reset email..."
              className="button-hover-effect"
            >
              Send Reset Instructions
            </Button>

            <Button
              onClick={() => navigate('/login')}
              variant="link"
              colorScheme="blue"
              className="button-hover-effect"
            >
              Back to Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
} 
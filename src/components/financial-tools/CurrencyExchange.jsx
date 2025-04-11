import { useState, useEffect } from 'react';
import { Box, Heading, Select, Input, Text, Stack } from '@chakra-ui/react';

export default function CurrencyExchange() {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 
    'CAD', 'CHF', 'CNY', 'INR', 'SGD'
  ];

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        setRates(data.rates);
        if (data.rates[toCurrency] && amount) {
          setConverted((parseFloat(amount) * data.rates[toCurrency]).toFixed(2));
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (rates[toCurrency] && amount) {
      setConverted((parseFloat(amount) * rates[toCurrency]).toFixed(2));
    }
  }, [amount, toCurrency, rates]);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Heading size="md" mb={4}>Currency Converter</Heading>
      <Stack spacing={4}>
        <Input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Amount"
        />
        
        <Select 
          value={fromCurrency} 
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </Select>

        <Text textAlign="center">to</Text>

        <Select 
          value={toCurrency} 
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </Select>

        {isLoading ? (
          <Text>Loading rates...</Text>
        ) : (
          <Text fontSize="xl" fontWeight="bold">
            ₹{amount} {fromCurrency} = ₹{converted} {toCurrency}
          </Text>
        )}
      </Stack>
    </Box>
  );
}

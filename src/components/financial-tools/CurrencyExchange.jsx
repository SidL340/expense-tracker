import { useState, useEffect } from 'react';
import { Box, Heading, Select, Input, Text, Stack } from '@chakra-ui/react';

export default function CurrencyExchange() {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Complete list of all ISO 4217 currency codes
  const currencies = [
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
    'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD',
    'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK',
    'DJF', 'DKK', 'DOP', 'DZD',
    'EGP', 'ERN', 'ETB', 'EUR',
    'FJD', 'FKP',
    'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD',
    'HKD', 'HNL', 'HRK', 'HTG', 'HUF',
    'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK',
    'JMD', 'JOD', 'JPY',
    'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT',
    'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD',
    'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN',
    'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD',
    'OMR',
    'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG',
    'QAR',
    'RON', 'RSD', 'RUB', 'RWF',
    'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL',
    'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS',
    'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UYW', 'UZS',
    'VED', 'VES', 'VND', 'VUV',
    'WST',
    'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU', 'XTS', 'XUA', 'XXX',
    'YER',
    'ZAR', 'ZMW', 'ZWL'
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
        // Fallback to free API if primary fails
        try {
          const fallbackResponse = await fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}`);
          const fallbackData = await fallbackResponse.json();
          setRates(fallbackData.rates);
          if (fallbackData.rates[toCurrency] && amount) {
            setConverted((parseFloat(amount) * fallbackData.rates[toCurrency]).toFixed(2));
          }
        } catch (fallbackError) {
          console.error("Fallback API also failed:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency, amount]);

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
    if (rates[toCurrency]) {
      setConverted((value * rates[toCurrency]).toFixed(2));
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Heading size="md" mb={4}>Currency Converter</Heading>
      <Stack spacing={4}>
        <Input 
          type="number" 
          value={amount} 
          onChange={handleAmountChange}
          placeholder="Amount"
          min="0"
          step="0.01"
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

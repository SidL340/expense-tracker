import { useState } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Input,
  Grid,
  Select
} from '@chakra-ui/react';

const operations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  'ROI': (a, b) => ((b - a) / a * 100).toFixed(2),
  'FV': (pv, r, n) => pv * Math.pow(1 + (r/100), n)
};

export default function FinancialCalculator() {
  const [input, setInput] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [calcType, setCalcType] = useState('basic');
  const [additionalInputs, setAdditionalInputs] = useState({});

  const handleNumber = (number) => {
    if (input === '0') {
      setInput(number.toString());
    } else {
      setInput(input + number.toString());
    }
  };

  const handleOperation = (op) => {
    if (calcType === 'basic') {
      setPrevValue(parseFloat(input));
      setInput('0');
      setOperation(op);
    } else {
      setOperation(op);
    }
  };

  const calculate = () => {
    if (!operation || prevValue === null) return;
    
    const currentValue = parseFloat(input);
    let result;

    if (calcType === 'basic') {
      result = operations[operation](prevValue, currentValue);
    } else {
      result = operations[operation](
        prevValue, 
        currentValue,
        additionalInputs.periods || 1
      );
    }

    setInput(result.toString());
    setOperation(null);
    setPrevValue(null);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Heading size="md" mb={4}>Financial Calculator</Heading>
      
      <Select 
        value={calcType} 
        onChange={(e) => {
          setCalcType(e.target.value);
          setInput('0');
          setPrevValue(null);
          setOperation(null);
        }}
        mb={4}
      >
        <option value="basic">Basic Calculator</option>
        <option value="financial">Financial Tools</option>
      </Select>

      <Input 
        value={input} 
        isReadOnly 
        mb={4} 
        fontSize="xl"
        textAlign="right"
      />

      {calcType === 'financial' && (
        <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
          <Button onClick={() => handleOperation('ROI')}>ROI %</Button>
          <Button onClick={() => handleOperation('FV')}>Future Value</Button>
          {operation === 'FV' && (
            <>
              <Input 
                placeholder="Periods (years)" 
                type="number"
                onChange={(e) => setAdditionalInputs({
                  ...additionalInputs,
                  periods: parseFloat(e.target.value)
                })}
              />
              <Input 
                placeholder="Rate %" 
                type="number"
                onChange={(e) => setPrevValue(parseFloat(e.target.value))}
              />
            </>
          )}
        </Grid>
      )}

      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {[7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, '.', '=', '+'].map((item) => (
          <Button 
            key={item}
            onClick={() => {
              if (typeof item === 'number' || item === '.') {
                handleNumber(item);
              } else if (item === '=') {
                calculate();
              } else {
                handleOperation(item);
              }
            }}
            colorScheme={typeof item === 'number' ? 'gray' : 'blue'}
          >
            {item}
          </Button>
        ))}
      </Grid>
    </Box>
  );
}

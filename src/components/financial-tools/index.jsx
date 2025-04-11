import { Box, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import CurrencyExchange from './CurrencyExchange';
import FinancialCalculator from './FinancialCalculator';

export default function FinancialTools() {
  return (
    <Box p={4}>
      <Heading mb={6}>Financial Tools</Heading>
      <Flex direction={['column', 'row']} gap={6}>
        <Box flex={1}>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Currency Exchange</Tab>
              <Tab>Financial Calculator</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <CurrencyExchange />
              </TabPanel>
              <TabPanel>
                <FinancialCalculator />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
}

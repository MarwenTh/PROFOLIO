import { Flex, Switch, Text } from '@chakra-ui/react';

const PreviewSwitch = ({ title, isChecked, onChange, isDisabled }) => {
  const handleChange = ({ checked }) => onChange?.(checked);

  return (
    <Flex align="center" justify="space-between" w="100%" my={4} opacity={isDisabled ? 0.4 : 1} transition="opacity 0.2s">
      {title && (
        <Text fontSize="12px" fontWeight={600} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" letterSpacing="0.05em">
          {title}
        </Text>
      )}

      <Switch.Root checked={isChecked} onCheckedChange={handleChange} disabled={isDisabled}>
        <Switch.HiddenInput />
        <Switch.Control bg="rgba(255, 255, 255, 0.05)" border="1px solid rgba(255, 255, 255, 0.1)" _checked={{ bg: '#5227FF', borderColor: '#5227FF' }} />
      </Switch.Root>
    </Flex>
  );
};

export default PreviewSwitch;

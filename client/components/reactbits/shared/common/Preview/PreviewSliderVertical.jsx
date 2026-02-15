import { Box, Flex, Slider, Text } from '@chakra-ui/react';

const PreviewSliderVertical = ({
  title = '',
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  valueUnit = '',
  width = '100%',
  isDisabled = false,
  onChange
}) => {
  const handleChange = ({ value: next }) => onChange?.(next[0]);

  return (
    <Box my={4} opacity={isDisabled ? 0.4 : 1} transition="opacity 0.2s">
      {title && (
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize="12px" fontWeight={600} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" letterSpacing="0.05em">
            {title}
          </Text>
          <Text fontSize="11px" color="#5227FF" fontWeight={700} fontFamily="mono" bg="rgba(82, 39, 255, 0.1)" px={2} py={0.5} borderRadius="4px">
            {typeof value === 'number' ? (step < 1 ? value.toFixed(2) : value.toFixed(0)) : value}
            {valueUnit}
          </Text>
        </Flex>
      )}
      <Slider.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={handleChange}
        width={typeof width === 'number' ? `${width}px` : width}
        disabled={isDisabled}
      >
        <Slider.Control>
          <Slider.Track bg="rgba(255, 255, 255, 0.05)" h="6px" borderRadius="10px">
            <Slider.Range bg="#5227FF" />
          </Slider.Track>
          <Slider.Thumb index={0} boxSize={3.5} bg="#fff" borderRadius="full" boxShadow="0 0 15px rgba(82, 39, 255, 0.4)" border="2px solid #5227FF" cursor="pointer" />
        </Slider.Control>
      </Slider.Root>
    </Box>
  );
};

export default PreviewSliderVertical;

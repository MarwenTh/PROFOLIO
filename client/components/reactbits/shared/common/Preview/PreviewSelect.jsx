import { useMemo } from 'react';
import { Flex, Text, Select, Field, Portal, createListCollection } from '@chakra-ui/react';

const PreviewSelect = ({
  title = '',
  options = [],
  value = '',
  width = 100,
  isDisabled = false,
  name = '',
  onChange
}) => {
  const values = useMemo(() => options.map(opt => opt.value), [options]);
  const labelMap = useMemo(
    () =>
      options.reduce((map, opt) => {
        map[opt.value] = opt.label;
        return map;
      }, {}),
    [options]
  );

  const collection = useMemo(() => createListCollection({ items: values }), [values]);

  const handleChange = ({ value: next }) => {
    onChange?.(next[0]);
  };

  return (
    <Flex gap="4" align="center" justify="space-between" w="100%" mt="4" mb="4" opacity={isDisabled ? 0.4 : 1} transition="opacity 0.2s">
      {title && (
        <Text fontSize="12px" fontWeight={600} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" letterSpacing="0.05em">
          {title}
        </Text>
      )}

      <Field.Root width="auto">
        <Select.Root
          collection={collection}
          value={[value]}
          onValueChange={handleChange}
          size="sm"
          disabled={isDisabled}
        >
          <Select.HiddenSelect name={name} />

          <Select.Control>
            <Select.Trigger
              fontSize="12px"
              fontWeight={700}
              h={9}
              w={`${width}px`}
              bg="rgba(255, 255, 255, 0.03)"
              border="1px solid rgba(255, 255, 255, 0.08)"
              borderRadius="12px"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Select.ValueText fontSize="12px">{labelMap[value]}</Select.ValueText>
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator fontSize="12px" color="rgba(255, 255, 255, 0.4)" />
            </Select.IndicatorGroup>
          </Select.Control>

          <Portal>
            <Select.Positioner>
              <Select.Content bg="rgba(20, 10, 35, 0.95)" backdropFilter="blur(24px)" border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="14px" boxShadow="0 20px 40px rgba(0,0,0,0.5)">
                {collection.items.map(val => (
                  <Select.Item
                    key={val}
                    item={val}
                    fontSize="13px"
                    fontWeight={500}
                    color="rgba(255, 255, 255, 0.82)"
                    borderRadius="10px"
                    m={1}
                    cursor="pointer"
                    _highlighted={{ bg: 'rgba(82, 39, 255, 0.2)', color: 'white' }}
                  >
                    <Select.ItemText>{labelMap[val]}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Field.Root>
    </Flex>
  );
};

export default PreviewSelect;

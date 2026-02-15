import { Box, Flex, Text, Icon, Input, Code, Button, Tooltip } from '@chakra-ui/react';
import { ChevronDown, RotateCcw, Share2, Code2, Plus, X, ExternalLink, Info } from 'lucide-react';
import { TbCopy, TbCopyCheckFilled } from 'react-icons/tb';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// Removed Link as react-router-dom is not used standalone
// import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKGROUNDS, getDocsPath } from './backgrounds';
import { generateExportCode } from './utils/exportCode';
import { useOptions } from '../../shared/context/OptionsContext/useOptions';
import PreviewSliderVertical from '../../shared/common/Preview/PreviewSliderVertical';
import PreviewSwitch from '../../shared/common/Preview/PreviewSwitch';
import PreviewSelect from '../../shared/common/Preview/PreviewSelect';
import CodeHighlighter from '../../shared/code/CodeHighlighter';

export const BackgroundSelector = ({ selectedId, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBackgrounds = useMemo(() => {
    const sorted = [...BACKGROUNDS].sort((a, b) => a.label.localeCompare(b.label));
    if (!searchQuery.trim()) return sorted;
    const query = searchQuery.toLowerCase();
    return sorted.filter(bg => bg.label.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <Box mb={8}>
      <Box mb={4}>
        <Input
          placeholder="Search styles..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          size="sm"
          bg="rgba(255, 255, 255, 0.03)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="12px"
          color="#fff"
          fontSize="13px"
          h="38px"
          px={4}
          _placeholder={{ color: 'rgba(255, 255, 255, 0.3)' }}
          _hover={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
          _focus={{ borderColor: '#5227FF', boxShadow: '0 0 0 2px rgba(82, 39, 255, 0.2)' }}
        />
      </Box>

      <Flex
        wrap="wrap"
        gap={3}
        maxH="400px"
        overflowY="auto"
        pr={1}
        className="custom-scrollbar"
      >
        {filteredBackgrounds.length === 0 ? (
          <Flex align="center" justify="center" py={8} w="100%">
            <Text fontSize="13px" color="rgba(255, 255, 255, 0.4)">
              No styles match...
            </Text>
          </Flex>
        ) : (
          filteredBackgrounds.map(bg => (
            <Box
              key={bg.id}
              as="button"
              onClick={() => onSelect(bg.id)}
              w="calc(50% - 6px)"
              position="relative"
              borderRadius="16px"
              overflow="hidden"
              aspectRatio="4/3"
              bg="rgba(255, 255, 255, 0.03)"
              border="1px solid"
              borderColor={selectedId === bg.id ? '#5227FF' : 'rgba(255, 255, 255, 0.08)'}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{ 
                bg: 'rgba(255, 255, 255, 0.06)', 
                borderColor: selectedId === bg.id ? '#5227FF' : 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)'
              }}
              role="group"
            >
              {/* Thumbnail Background Gradient */}
              <Box
                position="absolute"
                inset={0}
                bg={`linear-gradient(135deg, ${selectedId === bg.id ? '#5227FF44' : 'rgba(255, 255, 255, 0.05)'}, rgba(0,0,0,0.5))`}
                zIndex={0}
              />
              
              <Flex
                position="relative"
                zIndex={1}
                h="100%"
                w="100%"
                direction="column"
                justify="flex-end"
                p={3}
                textAlign="left"
              >
                <Text 
                  fontSize="12px" 
                  fontWeight={700} 
                  color={selectedId === bg.id ? '#fff' : 'rgba(255, 255, 255, 0.7)'}
                  noOfLines={1}
                >
                  {bg.label}
                </Text>
              </Flex>

              {selectedId === bg.id && (
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg="#5227FF"
                  boxShadow="0 0 10px #5227FF"
                />
              )}
            </Box>
          ))
        )}
      </Flex>
    </Box>
  );
};

const NumberControl = ({ prop, value, onChange }) => {
  const { name, label, min = 0, max = 100, step = 1 } = prop;

  return (
    <Box mt={6} mb={8}>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="13px" fontWeight={600} color="rgba(255, 255, 255, 0.6)" textTransform="uppercase" letterSpacing="0.05em">
          {label}
        </Text>
        <Text fontSize="11px" color="#5227FF" fontWeight={700} fontFamily="mono" bg="rgba(82, 39, 255, 0.1)" px={2} py={0.5} borderRadius="4px">
          {value}
        </Text>
      </Flex>
      <PreviewSliderVertical
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={val => onChange(name, val)}
      />
    </Box>
  );
};

const BooleanControl = ({ prop, value, onChange }) => {
  const { name, label } = prop;

  return (
    <Flex justify="space-between" align="center" my={6}>
      <Text fontSize="13px" fontWeight={600} color="rgba(255, 255, 255, 0.6)" textTransform="uppercase" letterSpacing="0.05em">
        {label}
      </Text>
      <PreviewSwitch isChecked={value} onChange={checked => onChange(name, checked)} />
    </Flex>
  );
};

const ColorControl = ({ prop, value, onChange }) => {
  const { name, label } = prop;

  return (
    <Flex justify="space-between" align="center" my={6}>
      <Text fontSize="13px" fontWeight={600} color="rgba(255, 255, 255, 0.6)" textTransform="uppercase" letterSpacing="0.05em">
        {label}
      </Text>
      <Flex align="center" gap={3}>
        <Text fontSize="11px" color="#5227FF" fontWeight={700} fontFamily="mono" bg="rgba(82, 39, 255, 0.1)" px={2} py={0.5} borderRadius="4px">
          {value.toUpperCase()}
        </Text>
        <Box position="relative">
          <Box w="24px" h="24px" borderRadius="full" bg={value} border="2px solid rgba(255, 255, 255, 0.1)" boxShadow="0 0 10px rgba(0,0,0,0.3)" />
          <Input
            type="color"
            value={value}
            onChange={e => onChange(name, e.target.value)}
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            opacity={0}
            cursor="pointer"
          />
        </Box>
      </Flex>
    </Flex>
  );
};

const ColorArrayControl = ({ prop, value, onChange }) => {
  const { name, label, minItems = 1, maxItems = 5 } = prop;
  const colors = Array.isArray(value) ? value : [value];

  const updateColor = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    onChange(name, newColors);
  };

  const addColor = () => {
    if (colors.length < maxItems) {
      onChange(name, [...colors, '#ffffff']);
    }
  };

  const removeColor = index => {
    if (colors.length > minItems) {
      onChange(
        name,
        colors.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Box my={6}>
      <Text fontSize="sm" mb={2}>
        {label}
      </Text>
      <Flex flexWrap="wrap" gap={2} px={1} pt={1}>
        {colors.map((color, index) => (
          <Box key={index} position="relative" w="32px" h="32px">
            <Box
              w="32px"
              h="32px"
              borderRadius="6px"
              bg={color}
              border="2px solid #271E37"
              overflow="hidden"
              position="relative"
            >
              <Input
                type="color"
                value={color}
                onChange={e => updateColor(index, e.target.value)}
                position="absolute"
                top={0}
                left={0}
                w="32px"
                h="32px"
                opacity={0}
                cursor="pointer"
              />
            </Box>
            {colors.length > minItems && (
              <Flex
                as="button"
                onClick={() => removeColor(index)}
                position="absolute"
                top="-6px"
                right="-6px"
                w="16px"
                h="16px"
                bg="#170D27"
                border="1px solid #271E37"
                borderRadius="50%"
                align="center"
                justify="center"
                cursor="pointer"
              >
                <Icon as={X} boxSize={2.5} color="#988BC7" />
              </Flex>
            )}
          </Box>
        ))}
        {colors.length < maxItems && (
          <Flex
            as="button"
            onClick={addColor}
            w="32px"
            h="32px"
            borderRadius="6px"
            border="2px dashed #392e4e"
            align="center"
            justify="center"
            cursor="pointer"
            _hover={{ borderColor: '#5227FF' }}
            transition="border-color 0.2s"
          >
            <Icon as={Plus} boxSize={4} color="#988BC7" />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

const SelectControl = ({ prop, value, onChange }) => {
  const { name, label, options = [] } = prop;
  const selectOptions = options.map(opt => (typeof opt === 'string' ? { value: opt, label: opt } : opt));

  return (
    <Box my={6}>
      <Text fontSize="13px" fontWeight={600} color="rgba(255, 255, 255, 0.6)" textTransform="uppercase" letterSpacing="0.05em" mb={3}>
        {label}
      </Text>
      <Flex wrap="wrap" gap={2}>
        {selectOptions.map(opt => (
          <Box
            key={opt.value}
            as="button"
            onClick={() => onChange(name, opt.value)}
            px={3}
            py={2}
            borderRadius="10px"
            bg={value === opt.value ? 'rgba(82, 39, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)'}
            border="1px solid"
            borderColor={value === opt.value ? '#5227FF' : 'rgba(255, 255, 255, 0.08)'}
            transition="all 0.2s"
            _hover={{ bg: value === opt.value ? 'rgba(82, 39, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)' }}
            flex={1}
            minW="calc(50% - 4px)"
            textAlign="center"
          >
            <Text fontSize="12px" fontWeight={600} color={value === opt.value ? '#fff' : 'rgba(255, 255, 255, 0.6)'}>
              {opt.label}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

const RgbArrayControl = ({ prop, value, onChange }) => {
  const { name, label } = prop;
  const rgb = Array.isArray(value) ? value : [0.5, 0.5, 0.5];

  const rgbToHex = (r, g, b) => {
    const toHex = v =>
      Math.round(Math.max(0, Math.min(1, v)) * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
    }
    return [0.5, 0.5, 0.5];
  };

  const hexValue = rgbToHex(rgb[0], rgb[1], rgb[2]);

  return (
    <Flex justify="space-between" align="center" my={6}>
      <Text fontSize="13px" fontWeight={600} color="rgba(255, 255, 255, 0.6)" textTransform="uppercase" letterSpacing="0.05em">
        {label}
      </Text>
      <Flex align="center" gap={3}>
        <Text fontSize="10px" color="#5227FF" fontWeight={700} fontFamily="mono" bg="rgba(82, 39, 255, 0.1)" px={1.5} py={0.5} borderRadius="4px">
          [{rgb.map(v => v.toFixed(1)).join(',')}]
        </Text>
        <Box position="relative">
          <Box w="24px" h="24px" borderRadius="full" bg={hexValue} border="2px solid rgba(255, 255, 255, 0.1)" />
          <Input
            type="color"
            value={hexValue}
            onChange={e => onChange(name, hexToRgb(e.target.value))}
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            opacity={0}
            cursor="pointer"
          />
        </Box>
      </Flex>
    </Flex>
  );
};

const TextControl = ({ prop, value, onChange }) => {
  const { name, label } = prop;

  return (
    <Box my={6}>
      <Text fontSize="13px" fontWeight={600} color="rgba(255, 255, 255, 0.6)" textTransform="uppercase" letterSpacing="0.05em" mb={3}>
        {label}
      </Text>
      <Input
        type="text"
        value={value || ''}
        onChange={e => onChange(name, e.target.value)}
        bg="rgba(255, 255, 255, 0.03)"
        border="1px solid rgba(255, 255, 255, 0.08)"
        borderRadius="12px"
        color="#fff"
        fontSize="13px"
        h="42px"
        px={4}
        _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
        _focus={{ borderColor: '#5227FF', bg: 'rgba(255, 255, 255, 0.06)', boxShadow: '0 0 0 2px rgba(82, 39, 255, 0.2)' }}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </Box>
  );
};

const DynamicControl = ({ prop, value, onChange }) => {
  switch (prop.type) {
    case 'number':
      return <NumberControl prop={prop} value={value} onChange={onChange} />;
    case 'boolean':
      return <BooleanControl prop={prop} value={value} onChange={onChange} />;
    case 'color':
      return <ColorControl prop={prop} value={value} onChange={onChange} />;
    case 'colorArray':
      return <ColorArrayControl prop={prop} value={value} onChange={onChange} />;
    case 'select':
      return <SelectControl prop={prop} value={value} onChange={onChange} />;
    case 'rgbArray':
      return <RgbArrayControl prop={prop} value={value} onChange={onChange} />;
    case 'text':
      return <TextControl prop={prop} value={value} onChange={onChange} />;
    default:
      return null;
  }
};

const PKG_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'];

const ExportModal = ({ isOpen, onClose, background, props }) => {
  const { languagePreset, stylePreset } = useOptions() || {};
  const [copied, setCopied] = useState(null);
  const [pkg, setPkg] = useState('pnpm');

  const language = languagePreset || 'JS';
  const style = stylePreset === 'TW' ? 'Tailwind' : stylePreset || 'CSS';

  const { commands, jsxCode } = useMemo(
    () => generateExportCode(background, props, { language, style }),
    [background, props, language, style]
  );

  const currentCommand = useMemo(() => {
    if (!commands) return '';
    const key = pkg === 'npm' ? 'npx' : pkg;
    return commands.shadcn?.[key] || '';
  }, [commands, pkg]);

  const copyToClipboard = useCallback((text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0,0,0,0.85)"
      backdropFilter="blur(16px)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
      p={4}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0D0716',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          padding: '32px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.6)'
        }}
      >
        <Flex justify="space-between" align="center" mb={10}>
          <Box>
            <Text fontSize="24px" fontWeight={800} color="#fff" letterSpacing="-0.02em">
              Export Component
            </Text>
            <Text fontSize="13px" color="rgba(255, 255, 255, 0.4)" fontWeight={500} mt={1}>
              Add this custom {background.label} to your project
            </Text>
          </Box>
          <Flex
            as="button"
            onClick={onClose}
            w={10}
            h={10}
            align="center"
            justify="center"
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.03)"
            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
            transition="all 0.2s"
            cursor="pointer"
          >
            <Icon as={X} boxSize={5} color="rgba(255, 255, 255, 0.5)" />
          </Flex>
        </Flex>

        <Box mb={10}>
          <Flex align="center" gap={3} mb={4}>
            <Box w={6} h={6} borderRadius="full" bg="#5227FF" display="flex" align="center" justify="center">
              <Text fontSize="12px" fontWeight={800} color="white">1</Text>
            </Box>
            <Text fontSize="15px" fontWeight={700} color="#fff">Install via CLI</Text>
          </Flex>

          <Box bg="rgba(0, 0, 0, 0.3)" borderRadius="20px" border="1px solid rgba(255, 255, 255, 0.05)" p={1}>
            <Flex gap={1} mb={1}>
              {PKG_MANAGERS.map(m => (
                <button
                  key={m}
                  onClick={() => setPkg(m)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    color: pkg === m ? 'white' : 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: pkg === m ? 'rgba(82, 39, 255, 0.2)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </Flex>
            <Box position="relative" mt={1}>
              <Box 
                bg="#060010" 
                borderRadius="16px" 
                p={5} 
                border="1px solid rgba(255, 255, 255, 0.05)"
                fontFamily="mono"
                fontSize="13px"
                color="#B19EEF"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                pr="120px"
              >
                {currentCommand}
              </Box>
              <Button
                position="absolute"
                h="36px"
                top="50%"
                transform="translateY(-50%)"
                right="12px"
                borderRadius="10px"
                fontWeight={600}
                fontSize="12px"
                bg={copied === 'install' ? '#10b981' : '#5227FF'}
                color="white"
                _hover={{ bg: copied === 'install' ? '#059669' : '#6366f1' }}
                onClick={() => copyToClipboard(currentCommand, 'install')}
                leftIcon={<Icon as={copied === 'install' ? TbCopyCheckFilled : TbCopy} boxSize={3.5} />}
                transition="all 0.3s"
              >
                {copied === 'install' ? 'Copied' : 'Copy'}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box>
          <Flex align="center" gap={3} mb={4}>
            <Box w={6} h={6} borderRadius="full" bg="#5227FF" display="flex" align="center" justify="center">
              <Text fontSize="12px" fontWeight={800} color="white">2</Text>
            </Box>
            <Text fontSize="15px" fontWeight={700} color="#fff">Component Code</Text>
          </Flex>

          <Box borderRadius="24px" overflow="hidden" border="1px solid rgba(255, 255, 255, 0.08)" bg="rgba(0, 0, 0, 0.2)">
            <CodeHighlighter
              language="jsx"
              codeString={jsxCode}
              showLineNumbers={true}
              maxLines={20}
              snippetId="export-jsx"
            />
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default function Controls({
  background,
  backgroundId,
  props,
  onPropChange,
  onBackgroundChange,
  onReset,
  toolSelector,
  isMobile = false,
  disabled = false,
  canvasBg = '#060010',
  onCanvasBgChange,
  showSelector = true
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setShareStatus('Copied!');
    setTimeout(() => setShareStatus(null), 2000);
  }, []);

  return (
    <Flex
      direction="column"
      h="100%"
      overflow="hidden"
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? 'none' : 'auto'}
      transition="opacity 0.2s"
    >
      {toolSelector && !isMobile && (
        <Box mb={4} flexShrink={0}>
          {toolSelector}
        </Box>
      )}

      <Box
        flex={1}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {showSelector && (
          <>
            <Text fontSize="11px" color="#988BC7" fontWeight={600} mb={3} textTransform="uppercase" letterSpacing="0.5px">
              Background
            </Text>
            <BackgroundSelector selectedId={backgroundId} onSelect={onBackgroundChange} />
          </>
        )}

        {onCanvasBgChange && (
          <Flex justify="space-between" align="center" mb={4}>
            <Flex align="center" gap={1.5}>
              <Text fontSize="sm">Canvas BG</Text>
              <Tooltip.Root openDelay={200} closeDelay={100} positioning={{ placement: 'top', gutter: 8 }}>
                <Tooltip.Trigger asChild>
                  <Flex align="center" justify="center" cursor="help">
                    <Icon as={Info} boxSize={3.5} color="#988BC7" />
                  </Flex>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content
                    bg="#060010"
                    border="1px solid #271e37"
                    color="#B19EEF"
                    fontSize="12px"
                    fontWeight="500"
                    px={3}
                    py={2}
                    borderRadius="10px"
                    maxW="220px"
                    lineHeight="1.4"
                  >
                    Light backgrounds might not work well with some effects, and some effects might not have a
                    transparent background.
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontSize="xs" color="#B19EEF" fontFamily="mono">
                {canvasBg}
              </Text>
              <Box position="relative">
                <Box w="28px" h="28px" borderRadius="6px" bg={canvasBg} border="2px solid #271E37" />
                <Input
                  type="color"
                  value={canvasBg}
                  onChange={e => onCanvasBgChange(e.target.value)}
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  opacity={0}
                  cursor="pointer"
                />
              </Box>
            </Flex>
          </Flex>
        )}

        <Box h="1px" bg="#271E37" mb={4} />

        <Box>
          {background?.props?.length > 0 ? (
            background.props.map(prop => (
              <DynamicControl key={prop.name} prop={prop} value={props[prop.name]} onChange={onPropChange} />
            ))
          ) : (
            <Text fontSize="13px" color="#988BC7" textAlign="center" py={4}>
              No customizable props for this background
            </Text>
          )}
        </Box>
      </Box>

      <Box pt={6} borderTop="1px solid rgba(255, 255, 255, 0.05)" mt={8} flexShrink={0}>
        <Flex gap={3} mb={3}>
          <Flex
            as="button"
            onClick={onReset}
            align="center"
            gap={2}
            px={4}
            py={2.5}
            bg="rgba(255, 255, 255, 0.03)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="12px"
            cursor="pointer"
            flex={1}
            justify="center"
            _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            transition="all 0.2s"
          >
            <Icon as={RotateCcw} boxSize={3.5} color="rgba(255, 255, 255, 0.4)" />
            <Text fontSize="12px" color="rgba(255, 255, 255, 0.6)" fontWeight={600}>
              Reset
            </Text>
          </Flex>
          <Flex
            as="button"
            onClick={handleShare}
            align="center"
            gap={2}
            px={4}
            py={2.5}
            bg="rgba(255, 255, 255, 0.03)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="12px"
            cursor="pointer"
            flex={1}
            justify="center"
            _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            transition="all 0.2s"
          >
            <Icon as={Share2} boxSize={3.5} color="rgba(255, 255, 255, 0.4)" />
            <Text fontSize="12px" color="rgba(255, 255, 255, 0.6)" fontWeight={600}>
              {shareStatus || 'Share'}
            </Text>
          </Flex>
        </Flex>
        
        <Flex
          as="button"
          onClick={() => window.open(getDocsPath(background), '_blank')}
          align="center"
          gap={2}
          px={4}
          py={2.5}
          mb={3}
          bg="rgba(255, 255, 255, 0.03)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="12px"
          cursor="pointer"
          w="100%"
          justify="center"
          _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
          transition="all 0.2s"
        >
          <Icon as={ExternalLink} boxSize={3.5} color="rgba(255, 255, 255, 0.4)" />
          <Text fontSize="12px" color="rgba(255, 255, 255, 0.6)" fontWeight={600}>
            View Documentation
          </Text>
        </Flex>

        <Flex
          as="button"
          onClick={() => setExportOpen(true)}
          align="center"
          gap={2.5}
          px={4}
          py={3.5}
          bg="#5227FF"
          boxShadow="0 8px 30px rgba(82, 39, 255, 0.4)"
          borderRadius="14px"
          cursor="pointer"
          w="100%"
          justify="center"
          _hover={{ bg: '#6b3fff', transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(82, 39, 255, 0.5)' }}
          _active={{ transform: 'translateY(0)' }}
          transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        >
          <Icon as={Code2} boxSize={4.5} color="#fff" />
          <Text fontSize="14px" color="#fff" fontWeight={700} letterSpacing="-0.01em">
            Generate Export Code
          </Text>
        </Flex>
      </Box>

      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} background={background} props={props} />
    </Flex>
  );
}

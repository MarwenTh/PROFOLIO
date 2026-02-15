import { Box, Flex, Text, Icon, Input, Kbd } from '@chakra-ui/react';
import {
  Plus,
  Trash2,
  Copy,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  Code2,
  Download,
  Keyboard,
  Merge,
  ChevronUp,
  FileCode2,
  Image
} from 'lucide-react';
import { useState, useCallback } from 'react';
import {
  generateMergedSVG,
  generateMergedClipPathSVG,
  generateReactComponent,
  generateCSSClipPath
} from './svgRenderers';

const ColorInput = ({ label, value, onChange }) => (
  <Flex align="center" justify="space-between" mb={4}>
    <Text fontSize="12px" fontWeight={600} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" letterSpacing="0.05em">
      {label}
    </Text>
    <Flex align="center" gap={3}>
      <Text fontSize="10px" color="#5227FF" fontWeight={700} fontFamily="mono" bg="rgba(82, 39, 255, 0.1)" px={1.5} py={0.5} borderRadius="4px">
        {value.toUpperCase()}
      </Text>
      <Box position="relative">
        <Box w="24px" h="24px" borderRadius="full" bg={value} border="2px solid rgba(255, 255, 255, 0.1)" />
        <Input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
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

const NumberInput = ({ label, value, onChange, min, max, step = 1 }) => (
  <Flex align="center" gap={2} flex={1} minW={0}>
    <Text fontSize="10px" fontWeight={800} color="rgba(255, 255, 255, 0.3)" w="12px" flexShrink={0}>
      {label}
    </Text>
    <Input
      type="number"
      value={Math.round(value)}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      min={min}
      max={max}
      step={step}
      h="36px"
      bg="rgba(255, 255, 255, 0.03)"
      border="1px solid rgba(255, 255, 255, 0.08)"
      borderRadius="10px"
      color="#fff"
      fontSize="12px"
      fontWeight={600}
      px={2}
      textAlign="center"
      _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
      _focus={{ borderColor: '#5227FF', bg: 'rgba(255, 255, 255, 0.06)', boxShadow: '0 0 0 2px rgba(82, 39, 255, 0.2)' }}
    />
  </Flex>
);

const ToggleButton = ({ icon: IconComponent, label, isActive, onClick, disabled, flex }) => (
  <Flex
    as="button"
    type="button"
    align="center"
    justify="center"
    gap={2}
    px={3}
    py={2.5}
    flex={flex}
    bg={isActive ? 'rgba(82, 39, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)'}
    border={isActive ? '1px solid #5227FF' : '1px solid rgba(255, 255, 255, 0.08)'}
    borderRadius="12px"
    cursor={disabled ? 'not-allowed' : 'pointer'}
    opacity={disabled ? 0.3 : 1}
    onClick={disabled ? undefined : onClick}
    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    _hover={{ bg: isActive ? 'rgba(82, 39, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)', borderColor: isActive ? '#5227FF' : 'rgba(255, 255, 255, 0.2)' }}
  >
    <Icon as={IconComponent} boxSize={3.5} color={isActive ? '#5227FF' : 'rgba(255, 255, 255, 0.4)'} />
    {label && (
      <Text fontSize="11px" fontWeight={700} color={isActive ? '#5227FF' : 'rgba(255, 255, 255, 0.4)'}>
        {label}
      </Text>
    )}
  </Flex>
);

const SectionHeader = ({ children }) => (
  <Text fontSize="11px" color="rgba(255, 255, 255, 0.3)" fontWeight={800} mb={4} mt={6} textTransform="uppercase" letterSpacing="0.1em">
    {children}
  </Text>
);

const StyledKbd = ({ children }) => (
  <Kbd
    bg="#0D0716"
    borderColor="#392e4e"
    color="#B19EEF"
    fontSize="11px"
    fontWeight={500}
    px={1.5}
    py={0.5}
    borderRadius="4px"
  >
    {children}
  </Kbd>
);

const Controls = ({
  shapes,
  bridges,
  cornerRadii,
  selectedIds,
  style,
  globalRadius,
  onAddShape,
  onDeleteShapes,
  onDuplicateShapes,
  onStyleChange,
  onGlobalRadiusChange,
  onShapeUpdate,
  onDistributeShapes,
  toolSelector,
  disabled = false,
  showTools = true
}) => {
  const [copyStatus, setCopyStatus] = useState(null);
  const [shortcutsHovered, setShortcutsHovered] = useState(false);

  const selectedShape = shapes.find(s => s.id === selectedIds[0]);
  const hasMultiSelection = selectedIds.length > 1;

  const handleCopySVG = useCallback(() => {
    const svg = generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius);
    navigator.clipboard.writeText(svg);
    setCopyStatus('svg');
    setTimeout(() => setCopyStatus(null), 2000);
  }, [shapes, bridges, cornerRadii, globalRadius, style]);

  const handleCopyReact = useCallback(() => {
    const code = generateReactComponent(shapes, bridges, cornerRadii || {}, style, globalRadius);
    navigator.clipboard.writeText(code);
    setCopyStatus('react');
    setTimeout(() => setCopyStatus(null), 2000);
  }, [shapes, bridges, cornerRadii, globalRadius, style]);

  const handleCopyMerged = useCallback(() => {
    const svg = generateMergedClipPathSVG(shapes, bridges, cornerRadii || {}, style, globalRadius);
    navigator.clipboard.writeText(svg);
    setCopyStatus('merged');
    setTimeout(() => setCopyStatus(null), 2000);
  }, [shapes, bridges, cornerRadii, globalRadius, style]);

  const handleDownloadSVG = useCallback(() => {
    const svg = generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'merged-shape.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [shapes, bridges, cornerRadii, globalRadius, style]);

  const handleCopyCSS = useCallback(() => {
    const css = generateCSSClipPath(shapes, bridges, cornerRadii || {}, globalRadius);
    navigator.clipboard.writeText(css);
    setCopyStatus('css');
    setTimeout(() => setCopyStatus(null), 2000);
  }, [shapes, bridges, cornerRadii, globalRadius]);

  const handleDownloadPNG = useCallback(() => {
    const svg = generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const scale = 2; // 2x resolution
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(pngBlob => {
        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.download = 'merged-shape.png';
        link.href = pngUrl;
        link.click();
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
    };
    img.src = url;
  }, [shapes, bridges, cornerRadii, globalRadius, style]);

  const hasThreeOrMoreSelected = selectedIds.length >= 3;

  return (
    <Flex
      direction="column"
      h="100%"
      overflow="hidden"
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? 'none' : 'auto'}
      transition="opacity 0.2s"
    >
      {toolSelector && (
        <Box mb={4} flexShrink={0}>
          {toolSelector}
        </Box>
      )}

      <Box
        flex={1}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}
      >
        {showTools && (
          <ShapeToolbox 
            onAddShape={onAddShape}
            onDeleteShapes={onDeleteShapes}
            onDuplicateShapes={onDuplicateShapes}
            onAlignShapes={onAlignShapes}
            onDistributeShapes={onDistributeShapes}
            hasMultiSelection={hasMultiSelection}
            hasThreeOrMoreSelected={hasThreeOrMoreSelected}
          />
        )}

        {selectedShape && !hasMultiSelection && (
          <>
            <SectionHeader>Selected Shape</SectionHeader>
            <Flex direction="column" gap={2} mb={4}>
              <Flex gap={2}>
                <NumberInput
                  label="X"
                  value={selectedShape.x}
                  onChange={v => onShapeUpdate(selectedShape.id, { x: v })}
                />
                <NumberInput
                  label="Y"
                  value={selectedShape.y}
                  onChange={v => onShapeUpdate(selectedShape.id, { y: v })}
                />
              </Flex>
              <Flex gap={2}>
                <NumberInput
                  label="W"
                  value={selectedShape.w}
                  onChange={v => onShapeUpdate(selectedShape.id, { w: Math.max(20, v) })}
                  min={20}
                />
                <NumberInput
                  label="H"
                  value={selectedShape.h}
                  onChange={v => onShapeUpdate(selectedShape.id, { h: Math.max(20, v) })}
                  min={20}
                />
              </Flex>
              <NumberInput
                label="Radius"
                value={selectedShape.r !== undefined ? selectedShape.r : globalRadius}
                onChange={v => onShapeUpdate(selectedShape.id, { r: v })}
                min={0}
              />
            </Flex>
          </>
        )}

        <SectionHeader>Style</SectionHeader>
        <Flex direction="column" gap={2} mb={4}>
          <ColorInput label="Fill" value={style.fill} onChange={v => onStyleChange({ ...style, fill: v })} />
        </Flex>

        <SectionHeader>Settings</SectionHeader>
        <Flex direction="column" gap={2} mb={4}>
          <NumberInput label="Radius" value={globalRadius} onChange={onGlobalRadiusChange} min={0} max={100} />
        </Flex>
      </Box>

      <Box
        bg="#170D27"
        border="1px solid #271E37"
        borderRadius="8px"
        mb={4}
        flexShrink={0}
        overflow="hidden"
        onMouseEnter={() => setShortcutsHovered(true)}
        onMouseLeave={() => setShortcutsHovered(false)}
        transition="all 0.2s ease"
      >
        <Flex align="center" justify="space-between" gap={1.5} p={3} cursor="pointer">
          <Flex align="center" gap={1.5}>
            <Icon as={Keyboard} boxSize={3} color="#988BC7" />
            <Text fontSize="10px" color="#988BC7" fontWeight={600} textTransform="uppercase" letterSpacing="0.5px">
              Shortcuts
            </Text>
          </Flex>
          <Icon
            as={ChevronUp}
            boxSize={3}
            color="#988BC7"
            transform={shortcutsHovered ? 'rotate(0deg)' : 'rotate(180deg)'}
            transition="transform 0.2s ease"
          />
        </Flex>
        <Box
          maxH={shortcutsHovered ? '200px' : '0px'}
          opacity={shortcutsHovered ? 1 : 0}
          overflow="hidden"
          transition="all 0.2s ease"
          px={3}
          pb={shortcutsHovered ? 3 : 0}
        >
          <Flex direction="column" gap={1.5}>
            <Flex justify="space-between" align="center">
              <Text fontSize="12px" color="#988BC7">
                Undo
              </Text>
              <Flex gap={1}>
                <StyledKbd>⌘</StyledKbd>
                <StyledKbd>Z</StyledKbd>
              </Flex>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize="12px" color="#988BC7">
                Redo
              </Text>
              <Flex gap={1}>
                <StyledKbd>⌘</StyledKbd>
                <StyledKbd>⇧</StyledKbd>
                <StyledKbd>Z</StyledKbd>
              </Flex>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize="12px" color="#988BC7">
                Duplicate
              </Text>
              <Flex gap={1}>
                <StyledKbd>⌘</StyledKbd>
                <StyledKbd>D</StyledKbd>
              </Flex>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize="12px" color="#988BC7">
                Delete
              </Text>
              <StyledKbd>⌫</StyledKbd>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize="12px" color="#988BC7">
                Pan
              </Text>
              <Flex gap={1} align="center">
                <StyledKbd>Space+Drag</StyledKbd>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>

      <Box pt={6} borderTop="1px solid rgba(255, 255, 255, 0.05)" flexShrink={0} mt={4}>
        <SectionHeader>Export Shapes</SectionHeader>
        <Flex direction="column" gap={3}>
          <Flex
            as="button"
            align="center"
            justify="center"
            gap={2.5}
            bg={copyStatus === 'merged' ? 'rgba(82, 39, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)'}
            border={copyStatus === 'merged' ? '1px solid #5227FF' : '1px solid rgba(255, 255, 255, 0.08)'}
            borderRadius="12px"
            py={2.5}
            cursor="pointer"
            onClick={handleCopyMerged}
            transition="all 0.3s"
            _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: '#5227FF' }}
          >
            <Icon as={Merge} boxSize={4} color={copyStatus === 'merged' ? '#5227FF' : 'rgba(255, 255, 255, 0.5)'} />
            <Text fontSize="12px" color={copyStatus === 'merged' ? '#5227FF' : 'rgba(255, 255, 255, 0.6)'} fontWeight={600}>
              {copyStatus === 'merged' ? 'Copied!' : 'Merge & Copy SVG'}
            </Text>
          </Flex>
          <Flex gap={2}>
            <Flex
              as="button"
              flex={1}
              align="center"
              justify="center"
              gap={2}
              bg={copyStatus === 'svg' ? 'rgba(82, 39, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)'}
              border={copyStatus === 'svg' ? '1px solid #5227FF' : '1px solid rgba(255, 255, 255, 0.08)'}
              borderRadius="12px"
              py={2.5}
              cursor="pointer"
              onClick={handleCopySVG}
              transition="all 0.3s"
              _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: '#5227FF' }}
            >
              <Icon as={Code2} boxSize={4} color={copyStatus === 'svg' ? '#5227FF' : 'rgba(255, 255, 255, 0.5)'} />
              <Text fontSize="12px" color={copyStatus === 'svg' ? '#5227FF' : 'rgba(255, 255, 255, 0.6)'} fontWeight={600}>
                {copyStatus === 'svg' ? 'Copied!' : 'SVG'}
              </Text>
            </Flex>
            <Flex
              as="button"
              flex={1}
              align="center"
              justify="center"
              gap={2}
              bg={copyStatus === 'react' ? 'rgba(82, 39, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)'}
              border={copyStatus === 'react' ? '1px solid #5227FF' : '1px solid rgba(255, 255, 255, 0.08)'}
              borderRadius="12px"
              py={2.5}
              cursor="pointer"
              onClick={handleCopyReact}
              transition="all 0.3s"
              _hover={{ bg: 'rgba(255, 255, 255, 0.06)', borderColor: '#5227FF' }}
            >
              <Icon as={Code2} boxSize={4} color={copyStatus === 'react' ? '#5227FF' : 'rgba(255, 255, 255, 0.5)'} />
              <Text fontSize="12px" color={copyStatus === 'react' ? '#5227FF' : 'rgba(255, 255, 255, 0.6)'} fontWeight={600}>
                {copyStatus === 'react' ? 'Copied!' : 'React'}
              </Text>
            </Flex>
          </Flex>
          <Flex
            as="button"
            align="center"
            justify="center"
            gap={2.5}
            px={4}
            py={3.5}
            bg="#5227FF"
            boxShadow="0 8px 30px rgba(82, 39, 255, 0.4)"
            borderRadius="14px"
            cursor="pointer"
            onClick={handleDownloadSVG}
            transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ bg: '#6b3fff', transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(82, 39, 255, 0.5)' }}
            _active={{ transform: 'translateY(0)' }}
          >
            <Icon as={Download} boxSize={4.5} color="#fff" />
            <Text fontSize="14px" color="#fff" fontWeight={700} letterSpacing="-0.01em">
              Download SVG Asset
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Controls;

export const ShapeToolbox = ({ 
  onAddShape, 
  onDeleteShapes, 
  onDuplicateShapes, 
  onAlignShapes, 
  onDistributeShapes,
  hasMultiSelection,
  hasThreeOrMoreSelected
}) => (
  <>
    <SectionHeader>Tools</SectionHeader>
    <Flex gap={2} mb={4}>
      <ToggleButton icon={Plus} label="Add" onClick={onAddShape} flex={1} />
      <ToggleButton icon={Trash2} label="Delete" onClick={onDeleteShapes} isActive={false} flex={1} />
      <ToggleButton icon={Copy} label="Duplicate" onClick={onDuplicateShapes} flex={1} />
    </Flex>

    {hasMultiSelection && (
      <>
        <SectionHeader>Align</SectionHeader>
        <Flex gap={2} mb={4} flexWrap="wrap">
          <ToggleButton icon={AlignHorizontalJustifyStart} onClick={() => onAlignShapes('left')} />
          <ToggleButton icon={AlignHorizontalJustifyCenter} onClick={() => onAlignShapes('centerH')} />
          <ToggleButton icon={AlignHorizontalJustifyEnd} onClick={() => onAlignShapes('right')} />
          <ToggleButton icon={AlignVerticalJustifyStart} onClick={() => onAlignShapes('top')} />
          <ToggleButton icon={AlignVerticalJustifyCenter} onClick={() => onAlignShapes('centerV')} />
          <ToggleButton icon={AlignVerticalJustifyEnd} onClick={() => onAlignShapes('bottom')} />
        </Flex>
        {hasThreeOrMoreSelected && (
          <>
            <SectionHeader>Distribute</SectionHeader>
            <Flex gap={2} mb={4}>
              <ToggleButton
                icon={AlignHorizontalSpaceAround}
                label="Horizontal"
                onClick={() => onDistributeShapes('horizontal')}
                flex={1}
              />
              <ToggleButton
                icon={AlignVerticalSpaceAround}
                label="Vertical"
                onClick={() => onDistributeShapes('vertical')}
                flex={1}
              />
            </Flex>
          </>
        )}
      </>
    )}
  </>
);

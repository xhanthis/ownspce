import React from 'react';
import Svg, { Circle, Ellipse, G, Text as SvgText } from 'react-native-svg';

interface OwlIconProps {
  size?: number;
}

export function OwlIcon({ size = 32 }: OwlIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Circle cx={256} cy={270} r={220} fill="#F5F5F5" />
      <Ellipse cx={160} cy={80} rx={50} ry={40} fill="#F5F5F5" />
      <Ellipse cx={352} cy={80} rx={50} ry={40} fill="#F5F5F5" />
      <Ellipse cx={185} cy={280} rx={80} ry={85} fill="#1A1A1A" />
      <Ellipse cx={327} cy={280} rx={80} ry={85} fill="#1A1A1A" />
      <Circle cx={200} cy={290} r={22} fill="#C45A3C" />
      <Circle cx={205} cy={285} r={8} fill="#F5F5F5" />
      <Circle cx={312} cy={290} r={22} fill="#C45A3C" />
      <Circle cx={317} cy={285} r={8} fill="#F5F5F5" />
    </Svg>
  );
}

interface HorizontalLogoProps {
  height?: number;
}

export function HorizontalLogo({ height = 30 }: HorizontalLogoProps) {
  const width = (480 / 100) * height;
  return (
    <Svg width={width} height={height} viewBox="0 0 480 100">
      <G transform="translate(10, 5) scale(0.18)">
        <Circle cx={256} cy={270} r={220} fill="#F5F5F5" />
        <Ellipse cx={160} cy={80} rx={50} ry={40} fill="#F5F5F5" />
        <Ellipse cx={352} cy={80} rx={50} ry={40} fill="#F5F5F5" />
        <Ellipse cx={185} cy={280} rx={80} ry={85} fill="#1A1A1A" />
        <Ellipse cx={327} cy={280} rx={80} ry={85} fill="#1A1A1A" />
        <Circle cx={200} cy={290} r={22} fill="#C45A3C" />
        <Circle cx={205} cy={285} r={8} fill="#F5F5F5" />
        <Circle cx={312} cy={290} r={22} fill="#C45A3C" />
        <Circle cx={317} cy={285} r={8} fill="#F5F5F5" />
      </G>
      <SvgText
        x={115}
        y={68}
        fontFamily="System"
        fontSize={48}
        fontWeight="400"
        fill="#F5F5F5"
        letterSpacing={-1}
      >
        ownspce
      </SvgText>
    </Svg>
  );
}

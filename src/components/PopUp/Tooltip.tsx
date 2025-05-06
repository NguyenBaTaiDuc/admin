// components/CustomTooltip.tsx
import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import '../PopUp/Tooltip.css'
import { TooltipPlacement } from 'antd/es/tooltip';

interface CustomTooltipProps {
  title: string;
  description: string;
  hoverColor?: string;
  placement?: TooltipPlacement;
  customStyle?: React.CSSProperties;
  className?: string;
  defaultColor?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ title, description , hoverColor, placement = 'top',
    customStyle = {}, className, defaultColor }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Tooltip
      title={
        <div className="flex flex-col items-center text-center border p-3">
          <InfoCircleOutlined style={{ fontSize: 45, color: 'rgb(3,105,94,var(--tw-text-opacity,1))' }} />
          <div className="font-semibold self-center mt-4 underline text-xl">{title}</div>
          <div className="text-xs text-gray-600 mt-3">{description}</div>
        </div>
      }
      placement={placement}
      className="ant-tooltip"
    >
      <div
        className={`cursor-pointer ${className ?? ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <InfoCircleOutlined
          style={{
            fontSize: customStyle.fontSize || 'inherit',
            color: hovered ? hoverColor : defaultColor,
            transition: 'color 0.3s ease',
          }}
        />
      </div>
    </Tooltip>
  );
};

export default CustomTooltip;

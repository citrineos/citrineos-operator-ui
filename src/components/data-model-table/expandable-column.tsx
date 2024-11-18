import { Button, Drawer, Space } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

export interface IExpandableColumnProps {
  expandedContent:
    | React.ReactNode
    | (({ closeDrawer }: { closeDrawer: () => void }) => React.ReactNode);
  initialContent?: any;
  viewTitle?: string;
  multipleNested?: boolean;
  useInitialContentAsButton?: boolean;
  forceRender?: boolean; // force render components in drawer
  onExpanded?: () => Promise<void>;
}

export const ExpandableColumn = ({
  expandedContent,
  initialContent = '',
  viewTitle,
  multipleNested = false,
  useInitialContentAsButton = false,
  forceRender = false,
  onExpanded,
}: IExpandableColumnProps) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const onViewButtonClick = () => {
    if (onExpanded) {
      onExpanded().then(() => setShowDrawer(true));
    } else {
      setShowDrawer(true);
    }
  };

  const onDrawerClose = () => {
    setShowDrawer(false);
  };

  return (
    <Space>
      {useInitialContentAsButton ? (
        <span
          onClick={onViewButtonClick}
          style={{ cursor: 'pointer' }}
          data-testId={`expandable-column-clickable-span`}
        >
          {initialContent}
        </span>
      ) : (
        <>
          {initialContent}
          <Button
            icon={<ExportOutlined />}
            onClick={onViewButtonClick}
            size="small"
            data-testId={`expandable-column-clickable-button`}
          >
            {multipleNested ? 'View All' : ''}
          </Button>
        </>
      )}
      <Drawer
        title={viewTitle}
        open={showDrawer}
        onClose={onDrawerClose}
        forceRender={forceRender}
        width="70%"
      >
        {typeof expandedContent === 'function'
          ? expandedContent({ closeDrawer: onDrawerClose })
          : expandedContent}
      </Drawer>
    </Space>
  );
};

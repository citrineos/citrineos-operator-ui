// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Import your PlusIcon or use Ant Design's PlusOutlined
import { PlusOutlined as PlusIcon } from '@ant-design/icons';
import { MessageTypeId } from '@citrineos/base';

export const CollapsibleOCPPMessageViewer: React.FC<{
  ocppMessage: any;
  unparsed: boolean;
}> = ({ ocppMessage, unparsed = false }) => {
  const [expanded, setExpanded] = useState(false);
  const threshold = 7;

  let payload = null;
  if (unparsed) {
    payload = JSON.stringify(ocppMessage);
  } else {
    switch (ocppMessage[0]) {
      case MessageTypeId.Call:
        payload = ocppMessage[3];
        break;
      case MessageTypeId.CallResult:
        payload = ocppMessage[2];
        break;
      case MessageTypeId.CallError: {
        const [
          messageTypeId,
          messageId,
          errorCode,
          errorDescription,
          errorDetails,
        ] = ocppMessage;
        payload = { errorCode, errorDescription, errorDetails };
        break;
      }
      default:
        payload = ocppMessage;
        break;
    }
  }

  const formattedJson = JSON.stringify(payload, null, 2);
  const lines = formattedJson.split('\n');
  const isExpandable = lines.length > threshold;

  return (
    <div className="relative">
      <SyntaxHighlighter
        language="json"
        style={okaidia}
        customStyle={{
          fontSize: '80%',
          padding: 'var(--ant-padding-xxs)',
          borderRadius: '4px',
          maxHeight: isExpandable && !expanded ? '200px' : 'none',
          overflow: 'hidden',
        }}
      >
        {isExpandable && !expanded
          ? lines.slice(0, threshold).join('\n')
          : formattedJson}
      </SyntaxHighlighter>

      {isExpandable && (
        <Button
          type="link"
          onClick={() => setExpanded(!expanded)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: `var(--ant-padding-xxs)`,
            alignItems: 'start',
          }}
        >
          {expanded ? <MinusOutlined /> : <PlusIcon />}
        </Button>
      )}
    </div>
  );
};

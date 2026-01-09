// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Minus, Plus } from 'lucide-react';
import { MessageTypeId } from '@citrineos/base';
import { Button } from '@lib/client/components/ui/button';
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { buttonIconSize } from '@lib/client/styles/icon';

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
          fontSize: '0.8rem',
          padding: '0.5rem',
          borderRadius: '4px',
          maxHeight: isExpandable && !expanded ? '200px' : 'none',
          overflow: 'hidden',
          margin: 0,
        }}
      >
        {isExpandable && !expanded
          ? lines.slice(0, threshold).join('\n')
          : formattedJson}
      </SyntaxHighlighter>

      {isExpandable && (
        <Button
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="absolute top-1 right-1 p-1"
        >
          {expanded ? (
            <Minus className={buttonIconSize} />
          ) : (
            <Plus className={buttonIconSize} />
          )}
        </Button>
      )}
    </div>
  );
};

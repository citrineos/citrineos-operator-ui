// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type ChargingStationDto,
  OCPP1_6,
  OCPP2_0_1,
  OCPPVersion,
} from '@citrineos/base';
import { Button } from '@lib/client/components/ui/button';
import { Input } from '@lib/client/components/ui/input';
import { Label } from '@lib/client/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/client/components/ui/select';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTenantId } from '@lib/client/hooks/useTenantId';

export interface StagedAuthorization {
  // For 2.0.1
  idToken: string;
  type?: OCPP2_0_1.IdTokenEnumType | null;
  // For 1.6 the parentIdTag string; for 2.0.1 the groupIdToken
  parentIdTag?: string | null;
  status: string;
  expiryDate?: string | null;
}

export interface SendLocalListModalProps {
  station: any;
  currentVersion?: number;
  addUpdate?: StagedAuthorization[];
  /**
   * For 1.6 differential delete: idTags to remove. For 2.0.1 differential delete:
   * objects with idToken+type, supplied as JSON string entries here for simplicity.
   */
  deleteIdTokens?: { idToken: string; type?: OCPP2_0_1.IdTokenEnumType | null }[];
  initialUpdateType?: 'Full' | 'Differential';
  /** Send empty FULL list to wipe the charger's local list. */
  sendEmpty?: boolean;
}

export const SendLocalListModal = ({
  station,
  currentVersion = 0,
  addUpdate = [],
  deleteIdTokens = [],
  initialUpdateType = 'Full',
  sendEmpty = false,
}: SendLocalListModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const tenantId = useTenantId();

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const [versionNumber, setVersionNumber] = useState<number>(
    Math.max(currentVersion + 1, 1),
  );
  const [updateType, setUpdateType] = useState<'Full' | 'Differential'>(
    initialUpdateType,
  );
  const [empty, setEmpty] = useState<boolean>(sendEmpty);

  const isOcpp16 = parsedStation.protocol === OCPPVersion.OCPP1_6;

  const buildBody = () => {
    if (isOcpp16) {
      const list: NonNullable<OCPP1_6.SendLocalListRequest['localAuthorizationList']> = [];
      if (updateType === 'Differential') {
        for (const del of deleteIdTokens) {
          list.push({ idTag: del.idToken });
        }
      }
      if (!(updateType === 'Full' && empty)) {
        for (const entry of addUpdate) {
          list.push({
            idTag: entry.idToken,
            idTagInfo: {
              status:
                (entry.status as OCPP1_6.SendLocalListRequestStatus) ??
                OCPP1_6.SendLocalListRequestStatus.Accepted,
              expiryDate: entry.expiryDate ?? undefined,
              parentIdTag: entry.parentIdTag ?? undefined,
            },
          });
        }
      }
      return {
        listVersion: versionNumber,
        updateType:
          updateType === 'Full'
            ? OCPP1_6.SendLocalListRequestUpdateType.Full
            : OCPP1_6.SendLocalListRequestUpdateType.Differential,
        localAuthorizationList: list.length > 0 ? list : undefined,
      } as OCPP1_6.SendLocalListRequest;
    }

    // 2.0.1
    const list: OCPP2_0_1.AuthorizationData[] = [];
    if (!(updateType === 'Full' && empty)) {
      for (const entry of addUpdate) {
        list.push({
          idToken: {
            idToken: entry.idToken,
            type:
              (entry.type as OCPP2_0_1.IdTokenEnumType) ??
              OCPP2_0_1.IdTokenEnumType.Central,
          },
          idTokenInfo: {
            status:
              (entry.status as OCPP2_0_1.AuthorizationStatusEnumType) ??
              OCPP2_0_1.AuthorizationStatusEnumType.Accepted,
            cacheExpiryDateTime: entry.expiryDate ?? undefined,
            groupIdToken: entry.parentIdTag
              ? {
                  idToken: entry.parentIdTag,
                  type: OCPP2_0_1.IdTokenEnumType.Central,
                }
              : undefined,
          },
        } as OCPP2_0_1.AuthorizationData);
      }
    }
    return {
      versionNumber,
      updateType:
        updateType === 'Full'
          ? OCPP2_0_1.UpdateEnumType.Full
          : OCPP2_0_1.UpdateEnumType.Differential,
      localAuthorizationList:
        list.length > 0 ? (list as [OCPP2_0_1.AuthorizationData, ...OCPP2_0_1.AuthorizationData[]]) : undefined,
    } as OCPP2_0_1.SendLocalListRequest;
  };

  const handleSubmit = async () => {
    if (!parsedStation?.id) return;
    if (versionNumber <= currentVersion) {
      return;
    }
    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/sendLocalList?identifier=${parsedStation.id}&tenantId=${tenantId}`,
      data: buildBody(),
      setLoading,
      ocppVersion: parsedStation.protocol as OCPPVersion,
    });
    dispatch(closeModal());
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="versionNumber">Version Number</Label>
        <Input
          id="versionNumber"
          type="number"
          min={Math.max(currentVersion + 1, 1)}
          value={versionNumber}
          onChange={(e) => setVersionNumber(Number(e.target.value))}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Must be greater than current version ({currentVersion}).
        </p>
      </div>

      <div>
        <Label>Update Type</Label>
        <Select
          value={updateType}
          onValueChange={(v) => setUpdateType(v as 'Full' | 'Differential')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full">Full</SelectItem>
            <SelectItem value="Differential">Differential</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {updateType === 'Full' && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="empty"
            checked={empty}
            onCheckedChange={(c) => setEmpty(Boolean(c))}
          />
          <Label htmlFor="empty">Send empty list (clears charger)</Label>
        </div>
      )}

      <div className="rounded-md border p-3 text-sm space-y-2">
        <div>
          <span className="font-semibold">Add / Update:</span>{' '}
          {empty && updateType === 'Full' ? 0 : addUpdate.length}
        </div>
        {updateType === 'Differential' && (
          <div>
            <span className="font-semibold">Delete:</span>{' '}
            {deleteIdTokens.length}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(closeModal())}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending...' : 'Send Local List'}
        </Button>
      </div>
    </div>
  );
};

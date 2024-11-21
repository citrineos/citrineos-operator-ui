import { ChargingStation } from '../pages/charging-stations/ChargingStation';
import { RemoteStop } from './remote-stop';
import { CustomAction } from '../components/custom-actions';
import { SetVariables } from './set-variables';
import { TriggerMessage } from './trigger-message';
import { GetBaseReport } from './get-base-report';
import { ClearCache } from './clear-cache';
import { ChangeAvailability } from './change-availability';
import { GetLog } from './get-log';
import { UpdateFirmware } from './update-firmware';
import { UnlockConnector } from './unlock-connector';
import React from 'react';
import { GetVariables } from './get-variables';
import { CustomerInformation } from './customer-information';
import { ResetChargingStation } from './reset';
import { RemoteStart } from './remote-start';
import { InstallCertificate } from './install-certificate';
import { GetInstalledCertificateIds } from './get-installed-certificate-ids';
import { SetNetworkProfile } from './set-network-profile';
import { CertificateSigned } from './certificate-signed';
import { GetTransactionStatus } from './get-transaction-status';
import { setSelectedChargingStation } from '../redux/selectedChargingStationSlice';
import { instanceToPlain } from 'class-transformer';
import { UpdateAuthPassword } from './update-auth-password';
import { DeleteStationNetworkProfiles } from './delete-station-network-profiles';
import { DeleteCertificate } from './delete-certificate';
import {
  ClearOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  GlobalOutlined,
  IdcardOutlined,
  KeyOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StopOutlined,
  SyncOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { UploadExistingCertificate } from './upload-existing-certificate';
import { RegenerateExistingCertificate } from './regenerate-existing-certificate';

export const CUSTOM_CHARGING_STATION_ACTIONS: CustomAction<ChargingStation>[] =
  [
    {
      label: 'Certificate Signed',
      icon: <SafetyCertificateOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <CertificateSigned station={station} />;
      },
    },
    {
      label: 'Change Availability',
      icon: <SyncOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <ChangeAvailability station={station} />;
      },
    },
    {
      label: 'Clear Cache',
      icon: <ClearOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <ClearCache station={station} />;
      },
    },
    {
      label: 'Customer Information',
      icon: <UserOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <CustomerInformation station={station} />;
      },
    },
    {
      label: 'Delete Certificate',
      icon: <DeleteOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <DeleteCertificate station={station} />;
      },
    },
    {
      label: 'Delete Station Network Profiles',
      icon: <DeleteOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <DeleteStationNetworkProfiles station={station} />;
      },
    },
    {
      label: 'Get Base Report',
      icon: <FileTextOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <GetBaseReport station={station} />;
      },
    },
    {
      label: 'Get Installed Certificate IDs',
      icon: <IdcardOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <GetInstalledCertificateIds station={station} />;
      },
    },
    {
      label: 'Get Log',
      icon: <FileSearchOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <GetLog station={station} />;
      },
    },
    {
      label: 'Get Transaction Status',
      icon: <FieldTimeOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <GetTransactionStatus station={station} />;
      },
    },
    {
      label: 'Get Variables',
      icon: <ProfileOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <GetVariables station={station} />;
      },
    },
    {
      label: 'Install Certificate',
      icon: <FileAddOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <InstallCertificate station={station} />;
      },
    },
    {
      label: 'Remote Start',
      icon: <PlayCircleOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <RemoteStart station={station} />;
      },
    },
    {
      label: 'Remote Stop',
      icon: <StopOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <RemoteStop station={station} />;
      },
    },
    {
      label: 'Reset',
      icon: <ReloadOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <ResetChargingStation station={station} />;
      },
    },
    {
      label: 'Set Network Profile',
      icon: <GlobalOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <SetNetworkProfile station={station} />;
      },
    },
    {
      label: 'Set Variables',
      icon: <SettingOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <SetVariables station={station} />;
      },
    },
    {
      label: 'Trigger Message',
      icon: <MessageOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <TriggerMessage station={station} />;
      },
    },
    {
      label: 'Unlock Connector',
      icon: <UnlockOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <UnlockConnector station={station} />;
      },
    },
    {
      label: 'Update Firmware',
      icon: <CloudUploadOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <UpdateFirmware station={station} />;
      },
    },
  ].sort((a, b) => a.label.localeCompare(b.label));

export const CUSTOM_CHARGING_STATION_ADMIN_ACTIONS: CustomAction<ChargingStation>[] =
  [
    {
      label: 'Update Auth Password',
      icon: <KeyOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <UpdateAuthPassword station={station} />;
      },
    },
    {
      label: 'Upload Existing Certificate',
      icon: <CloudUploadOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <UploadExistingCertificate station={station} />;
      },
    },
    {
      label: 'Regenerate Existing Certificate',
      icon: <ReloadOutlined />,
      execOrRender: (
        station: ChargingStation,
        _setLoading: any,
        dispatch: any,
      ) => {
        dispatch(
          setSelectedChargingStation({
            selectedChargingStation: JSON.stringify(instanceToPlain(station)),
          }),
        );
        return <RegenerateExistingCertificate station={station} />;
      },
    },
  ].sort((a, b) => a.label.localeCompare(b.label));

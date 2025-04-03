import {Flex, Progress, Spin} from 'antd';
import './style.scss';
import { useCustom } from '@refinedev/core'
import {CHARGING_STATIONS_STATUS_COUNT_QUERY} from "../../charging-stations/queries";
import {TRANSACTION_SUCCESS_RATE_QUERY} from "../../transactions/queries";
import React from "react";

export const PluginSuccessRateCard = () => {
  const { data, isLoading, error } = useCustom({
    meta: {
      gqlQuery: TRANSACTION_SUCCESS_RATE_QUERY,
    },
  } as any);

  const successCount = data?.data?.success?.aggregate?.count || 0;
  const totalCount = data?.data?.total?.aggregate?.count || 0;
  const percentage = (successCount / totalCount) * 100;
  const roundedPercentage = Math.round(percentage * 10) / 10;

  const comparison = "+2.5%"; // TODO

  if (isLoading) return <Spin />;
  if (error) return <p>Error loading success rate</p>;

  return (
    <Flex vertical gap={32} className="plugin-success-rate">
      <h4>Plug-in Success Rate</h4>
      <Progress percent={roundedPercentage} size={[200, 20]} showInfo={false}/>
      <div className="plugin-success-rate-percentage">{roundedPercentage}%</div>
    </Flex>
  );
};

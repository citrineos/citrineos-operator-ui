import { Cell, Pie, PieChart, Sector } from 'recharts';
import React from 'react';
import { ChartWrapper } from './chart-wrapper';
import { GET_CHARGING_STATIONS_WITH_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS } from './queries';
import { useGqlCustom } from '@util/use-gql-custom';
import { Transaction } from '../transactions/Transaction';
import { StatusNotification } from '../status-notifications/StatusNotification';
import { ChargingStation } from '../charging-stations/ChargingStation';
import { Evse } from '../evses/Evse';
import { plainToInstance } from 'class-transformer';
import { Alert, Spin } from 'antd';
import { OCPP2_0_1 } from '@citrineos/base';

class ChargingStationWithLatestStatusNotificationsAndTransactions extends ChargingStation {
  Evses!: { Evse: Evse }[];
  LatestStatusNotifications!: { StatusNotification: StatusNotification }[];
  Transactions!: { Transaction: Transaction }[];
}

class ChargingStationList {
  ChargingStations!: ChargingStationWithLatestStatusNotificationsAndTransactions[];
}

interface OnlineStatusCounts {
  charging: number;
  chargingSuspended: number;
  available: number;
  unavailable: number;
  faulted: number;
}

const aggregateOnlineStatusCounts = (
  finalCounts: OnlineStatusCounts,
  stationCounts: OnlineStatusCounts,
): void => {
  finalCounts.charging += stationCounts.charging;
  finalCounts.chargingSuspended += stationCounts.chargingSuspended;
  finalCounts.available += stationCounts.available;
  finalCounts.unavailable += stationCounts.unavailable;
  finalCounts.faulted += stationCounts.faulted;
};

const getOnlineStatusCountsForStation = (
  chargingStation: ChargingStationWithLatestStatusNotificationsAndTransactions,
) => {
  const counts: OnlineStatusCounts = {
    charging: 0,
    chargingSuspended: 0,
    available: 0,
    unavailable: 0,
    faulted: 0,
  };
  const evses: Evse[] = chargingStation.Evses.map((evse) => evse.Evse);
  if (evses && evses.length > 0) {
    for (const evse of evses) {
      const latestStatusNotificationForEvse =
        chargingStation.LatestStatusNotifications.find(
          (latestStatusNotification) =>
            latestStatusNotification.StatusNotification.evseId === evse.id &&
            latestStatusNotification.StatusNotification.connectorId ===
              evse.connectorId,
        );
      if (latestStatusNotificationForEvse) {
        const connectorStatus =
          latestStatusNotificationForEvse.StatusNotification.connectorStatus;
        switch (connectorStatus) {
          case OCPP2_0_1.ConnectorStatusEnumType.Available:
            counts.available++;
            break;
          case OCPP2_0_1.ConnectorStatusEnumType.Occupied: {
            const activeTransaction = chargingStation.Transactions.find(
              (transaction) =>
                transaction.Transaction.evseDatabaseId === evse.databaseId,
            );
            if (
              activeTransaction &&
              activeTransaction.Transaction &&
              activeTransaction.Transaction.isActive
            ) {
              const chargingState = activeTransaction.Transaction.chargingState;
              if (chargingState === OCPP2_0_1.ChargingStateEnumType.Charging) {
                counts.charging++;
              } else {
                counts.chargingSuspended++;
              }
            }
            break;
          }
          case OCPP2_0_1.ConnectorStatusEnumType.Faulted:
            counts.faulted++;
            break;
          case OCPP2_0_1.ConnectorStatusEnumType.Unavailable:
            counts.unavailable++;
            break;
          case OCPP2_0_1.ConnectorStatusEnumType.Reserved:
          default:
            // no handling
            break;
        }
      } else {
        counts.unavailable++;
      }
    }
  }
  return counts;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} (${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

export const OnlineStatus = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const { data, isLoading, isError } = useGqlCustom<ChargingStationList>({
    gqlQuery:
      GET_CHARGING_STATIONS_WITH_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS,
  });

  const chargingStations: ChargingStationWithLatestStatusNotificationsAndTransactions[] =
    data?.data.ChargingStations.map((cs) => {
      return plainToInstance(
        ChargingStationWithLatestStatusNotificationsAndTransactions,
        cs,
      );
    }) || [];

  const final: OnlineStatusCounts = {
    charging: 0,
    chargingSuspended: 0,
    available: 0,
    unavailable: 0,
    faulted: 0,
  };

  for (const chargingStation of chargingStations) {
    aggregateOnlineStatusCounts(
      final,
      getOnlineStatusCountsForStation(chargingStation),
    );
  }

  const cells = [
    {
      name: 'Charging',
      value: final.charging,
      color: 'var(--ant-purple)',
    },
    {
      name: 'Charging Suspended',
      value: final.chargingSuspended,
      color: 'var(--ant-yellow)',
    },
    {
      name: 'Available',
      value: final.available,
      color: 'var(--ant-green)',
    },
    {
      name: 'Unavailable',
      value: final.unavailable,
      color: 'var(--ant-orange)',
    },
    {
      name: 'Faulted',
      value: final.faulted,
      color: 'var(--ant-red)',
    },
  ];

  if (isLoading) {
    return <Spin />;
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description="Online Status Breakdown component failed to fetch data"
        type="error"
      />
    );
  }

  return (
    <ChartWrapper title={'Online Status Breakdown'}>
      <PieChart>
        <Pie
          data={cells}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={(_, index) => {
            setActiveIndex(index);
          }}
          innerRadius={'60%'}
          outerRadius={'80%'}
          dataKey="value"
          fill="#82ca9d"
        >
          {cells.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartWrapper>
  );
};

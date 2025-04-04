import { instanceToPlain } from 'class-transformer';
import { Button, Flex, Form } from 'antd';
import { ModalComponentType } from '../../../AppModal';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { chargingStationActionMap } from '../../../message/2.0.1';
import { openModal, closeModal } from '../../../redux/modal.slice';
import { useDispatch } from 'react-redux';

export interface OCPP2_0_1_CommandsProps {
  station: ChargingStationDto;
}

export const OCPP2_0_1_Commands = ({ station }: OCPP2_0_1_CommandsProps) => {
  const dispatch = useDispatch();

  const handleGetLogs = () => {
    dispatch(
      openModal({
        title: 'Get Logs',
        modalComponentType: ModalComponentType.getLogs,
        modalComponentProps: { station: instanceToPlain(station) },
      }),
    );
  };

  const handleCommandClick = (
    command: string,
    CommandComponent: React.FC<any>,
  ) => {
    dispatch(
      openModal({
        title: command,
        modalComponentType: ModalComponentType.otherCommandsDynamic,
        modalComponentProps: {
          content: <CommandComponent station={station} />,
        },
      }),
    );
  };

  const commandsToExclude = ['Get Log', 'Remote Start', 'Remote Stop', 'Reset'];

  const filteredCommands = Object.keys(chargingStationActionMap).filter(
    (command) => !commandsToExclude.includes(command),
  );

  return (
    <Form layout="vertical">
      <Flex vertical gap={16}>
        {filteredCommands.map((command) => (
          <Button
            key={command}
            onClick={() =>
              handleCommandClick(command, chargingStationActionMap[command])
            }
          >
            {command}
          </Button>
        ))}

        <Button key="Get Logs" onClick={() => handleGetLogs()}>
          Get Logs
        </Button>

        <Flex justify="end" gap={8}>
          <Button onClick={() => dispatch(closeModal())}>Close</Button>
        </Flex>
      </Flex>
    </Form>
  );
};

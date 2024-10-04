import { TableColumnsType } from 'antd';
import {
  ActionsColumn,
  ColumnAction,
} from '../../components/data-model-table/actions-column';
import { AdditionalInfos } from '../../graphql/schema.types';
import { ResourceType } from '../../resource-type';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { IdTokensList } from '../id-tokens';

export const ADDITIONAL_INFOS_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
) => {
  const baseColumns: TableColumnsType<AdditionalInfos> = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'additionalIdToken',
      title: 'Additional Id Token',
    },
    {
      dataIndex: 'type',
      title: 'Type',
    },
    {
      dataIndex: 'IdTokenAdditionalInfos.IdToken',
      title: 'ID Tokens',
      render: (_: any, record: AdditionalInfos) => {
        if (
          !record?.IdTokenAdditionalInfos ||
          record.IdTokenAdditionalInfos.length === 0
        ) {
          return '';
        }

        const idTokenIds = record.IdTokenAdditionalInfos.filter(
          (additionalInfo) => additionalInfo.IdToken,
        ).map((additionalInfo) => additionalInfo.IdToken.id);

        const filter = DEFAULT_EXPANDED_DATA_FILTER('id', 'in', idTokenIds);

        return (
          <ExpandableColumn
            expandedContent={
              <IdTokensList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.ADDITIONAL_INFOS}
              />
            }
            multipleNested={true}
            viewTitle={`ID Tokens linked to Additional Infos with ID ${record.id}`}
          />
        );
      },
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: AdditionalInfos) => {
        return (
          <ActionsColumn
            record={record}
            actions={[{ type: ColumnAction.SHOW }]}
          />
        );
      },
    });
  }

  return baseColumns;
};

import { TableColumnsType } from 'antd';
import { Authorizations } from '../../graphql/schema.types';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { AUTHORIZATIONS_DELETE_MUTATION } from './queries';
import { TagList } from '../../components/data-model-table/tag-list';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { IdTokensList } from '../id-tokens';
import { IdTokenInfosList } from '../id-token-infos';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ResourceType } from '../../resource-type';

export const AUTHORIZATIONS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
) => {
  const baseColumns: TableColumnsType<Authorizations> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'allowedConnectorTypes',
      title: 'Allowed Connector Types',
      render: (_: any, record: Authorizations) => {
        if (!record) {
          return '';
        }

        return <TagList items={record.allowedConnectorTypes} />;
      },
    },
    {
      dataIndex: 'disallowedEvseIdPrefixes',
      title: 'Disallowed EVSE ID Prefixes',
      render: (_: any, record: Authorizations) => {
        if (!record) {
          return '';
        }

        return <TagList items={record.disallowedEvseIdPrefixes} />;
      },
    },
    {
      dataIndex: 'idTokenId',
      title: 'ID Token',
      render: (_: any, record: Authorizations) => {
        if (!record?.idTokenId) {
          return '';
        }

        const idTokenId = record.idTokenId;

        if (parentView === ResourceType.ID_TOKENS) {
          return idTokenId;
        }

        const filter = DEFAULT_EXPANDED_DATA_FILTER('id', 'eq', idTokenId);

        return (
          <ExpandableColumn
            initialContent={idTokenId}
            expandedContent={
              <IdTokensList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.AUTHORIZATIONS}
              />
            }
            viewTitle={`ID Tokens linked to Authorization with ID ${record.id}`}
          />
        );
      },
    },
    {
      dataIndex: 'idTokenInfoId',
      title: 'ID Token Info',
      render: (_: any, record: Authorizations) => {
        if (!record?.idTokenInfoId) {
          return '';
        }

        const idTokenInfoId = record.idTokenInfoId;

        if (parentView === ResourceType.ID_TOKEN_INFOS) {
          return idTokenInfoId;
        }

        const filter = DEFAULT_EXPANDED_DATA_FILTER('id', 'eq', idTokenInfoId);

        return (
          <ExpandableColumn
            initialContent={idTokenInfoId}
            expandedContent={
              <IdTokenInfosList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.AUTHORIZATIONS}
              />
            }
            viewTitle={`ID Token Infos linked to Authorization with ID ${record.id}`}
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
      render: (_: any, record: Authorizations) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={AUTHORIZATIONS_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};

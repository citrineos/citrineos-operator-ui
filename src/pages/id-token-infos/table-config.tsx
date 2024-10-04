import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { IdTokenInfos } from '../../graphql/schema.types';
import { ID_TOKEN_INFOS_DELETE_MUTATION } from './queries';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { AuthorizationsList } from '../authorizations';
import { ResourceType } from '../../resource-type';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { IdTokensList } from '../id-tokens';

export const ID_TOKEN_INFOS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
) => {
  const baseColumns: TableColumnsType<IdTokenInfos> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: { multiple: 2 },
    },
    {
      dataIndex: 'status',
      title: 'Status',
      sorter: { multiple: 1 },
    },
    {
      dataIndex: 'language1',
      title: 'Language 1',
    },
    {
      dataIndex: 'language2',
      title: 'Language 2',
    },
    {
      dataIndex: 'Authorizations',
      title: 'Authorizations',
      render: (_: any, record: IdTokenInfos) => {
        if (!record?.Authorizations || record.Authorizations.length === 0) {
          return '';
        }

        const authorizationIds = record.Authorizations.map((auth) => auth.id);

        const filter = DEFAULT_EXPANDED_DATA_FILTER(
          'id',
          'in',
          authorizationIds,
        );

        return (
          <ExpandableColumn
            expandedContent={
              <AuthorizationsList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.ID_TOKEN_INFOS}
              />
            }
            multipleNested={true}
            viewTitle={`Authorizations linked to ID Token Infos with ID ${record.id}`}
          />
        );
      },
    },
    {
      dataIndex: 'groupIdTokenId',
      title: 'Id Token',
      render: (_: any, record: IdTokenInfos) => {
        if (!record?.groupIdTokenId) {
          return '';
        }

        const groupIdTokenId = record.groupIdTokenId;

        if (parentView === ResourceType.ID_TOKENS) {
          return groupIdTokenId;
        }

        const filter = DEFAULT_EXPANDED_DATA_FILTER('id', 'eq', groupIdTokenId);

        return (
          <ExpandableColumn
            initialContent={groupIdTokenId}
            expandedContent={
              <IdTokensList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.ID_TOKEN_INFOS}
              />
            }
            viewTitle={`ID Tokens linked to ID Token Infos with ID ${record.id}`}
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
      render: (_: any, record: IdTokenInfos) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={ID_TOKEN_INFOS_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};

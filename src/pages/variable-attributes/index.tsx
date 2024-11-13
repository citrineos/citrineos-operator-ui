import { AiOutlineMonitor } from 'react-icons/ai';
import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import { IDataModelListProps } from '../../components';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { GenericView } from '../../components/view';
import { VariableAttribute } from './VariableAttributes';
import {
  VARIABLE_ATTRIBUTE_CREATE_MUTATION,
  VARIABLE_ATTRIBUTE_DELETE_MUTATION,
  VARIABLE_ATTRIBUTE_EDIT_MUTATION,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from './queries';

export const VariableAttributesView: React.FC = () => {
  return (
    <GenericView
      dtoClass={VariableAttribute}
      gqlQuery={VARIABLE_ATTRIBUTE_LIST_QUERY}
      editMutation={VARIABLE_ATTRIBUTE_EDIT_MUTATION}
      createMutation={VARIABLE_ATTRIBUTE_CREATE_MUTATION}
      deleteMutation={VARIABLE_ATTRIBUTE_DELETE_MUTATION}
    />
  );
};

export const VariableAttributesList = (_props: IDataModelListProps) => {
  return (
    <>
      <GenericDataTable
        dtoClass={VariableAttribute}
      />
    </>
  );
};

// Routes Setup
export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<VariableAttributesList />} />
      <Route path="/:id/*" element={<VariableAttributesView />} />
    </Routes>
  );
};

// Resource Definition
export const resources = [
  {
    name: ResourceType.VARIABLE_ATTRIBUTES,
    list: '/variable-attributes',
    create: '/variable-attributes/new',
    show: '/variable-attributes/:id',
    edit: '/variable-attributes/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <AiOutlineMonitor />,
  },
];

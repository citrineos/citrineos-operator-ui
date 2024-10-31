import React from "react";
import { GenericView } from "../../components/view";
import { AdditionalInfos } from "./additional-infos";
import { ADDITIONAL_INFOS_CREATE_MUTATION, ADDITIONAL_INFOS_DELETE_MUTATION, ADDITIONAL_INFOS_EDIT_MUTATION, ADDITIONAL_INFOS_SHOW_QUERY } from "../../queries/additionalInfo";
import { IDataModelListProps } from "../../components";
import { GenericDataTable } from "../../components/data-model-table/editable";
import { Route, Routes } from "react-router-dom";
import { ResourceType } from "../../resource-type";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const AdditionalInfosView: React.FC = () => {
    return <GenericView
        dtoClass={AdditionalInfos}
        gqlQuery={ADDITIONAL_INFOS_SHOW_QUERY}
        editMutation={ADDITIONAL_INFOS_EDIT_MUTATION}
        createMutation={ADDITIONAL_INFOS_CREATE_MUTATION}
        deleteMutation={ADDITIONAL_INFOS_DELETE_MUTATION}
    />
};

export const AdditionalInfosList = (_props: IDataModelListProps) => {
    return (
        <>
            <GenericDataTable
                dtoClass={AdditionalInfos}
            />
        </>
    );
};

export const routes: React.FC = () => {
    return (
        <Routes>
            <Route index element={<AdditionalInfosList />} />
            <Route path="/:id/" element={<AdditionalInfosView />} />
        </Routes>
    );
};

export const resources = [
    {
        name: ResourceType.ADDITIONAL_INFOS,
        list: '/additional-infos',
        create: '/additional-infos/create',
        edit: '/additional-infos/edit/:id',
        show: '/additional-infos/show/:id',
        meta: {
            canDelete: true,
        },
        icon: <ExclamationCircleOutlined />,
    }
];
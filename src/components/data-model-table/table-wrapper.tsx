import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useTable } from '@refinedev/antd';
import { SorterResult } from 'antd/lib/table/interface';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Table, Button } from 'antd';

import isEqual from 'lodash.isequal';
import { plainToInstance } from 'class-transformer';

import { SelectionType } from '@enums';
import { CustomActions } from '../custom-actions';
import { generateSearchFilters } from '@util/tables';
import { useDebounce } from '../../hooks/useDebounce';
import {
  CUSTOM_CHARGING_STATION_ACTIONS,
  EXCLUDED_FROM_MULTI_SELECT,
} from '../../message';
import { getSearchableKeys } from '@util/decorators/Searcheable';
import { TableWrapperProps, TableWrapperRef } from '@interfaces';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';

export const TableWrapper = forwardRef(function TableWrapper<
  Model extends { key: any },
>(props: TableWrapperProps<Model>, ref: React.Ref<TableWrapperRef<Model>>) {
  const {
    selectable,
    onSelectionChange,
    primaryKeyFieldName,
    columns,
    editingRecord,
    dtoClass,
    useTableProps: externalTableProps = null,
    filters,
    dtoResourceType,
    dtoGqlListQuery,
    gqlQueryVariables,
    customActions,
    handleCreate,
  } = props;

  const [isDisabled, setIsDisabled] = useState(true);

  // Memoized Searchable Keys
  const searchableKeys = useMemo(() => getSearchableKeys(dtoClass), [dtoClass]);

  // Table Configuration
  const tableOptions = useMemo(() => {
    const meta: Record<string, any> = {
      gqlQuery: dtoGqlListQuery,
      ...(gqlQueryVariables && { gqlVariables: gqlQueryVariables }),
    };

    const options: Record<string, any> = {
      resource: dtoResourceType,
      sorters: { initial: [{ field: 'updatedAt', order: 'desc' }] },
      meta,
    };

    if (searchableKeys?.size) {
      options.onSearch = (values: any) =>
        generateSearchFilters(values, searchableKeys);
    }

    if (filters) {
      options.filters = filters;
    }

    return options;
  }, [dtoGqlListQuery, gqlQueryVariables, filters, searchableKeys]);

  // useTable Hook
  const {
    tableProps: defaultTableProps,
    tableQuery: defaultQueryResult,
    setSorters: defaultSetSorters,
    setCurrent: defaultSetCurrent,
    setPageSize: defaultSetPageSize,
    searchFormProps: defaultSearchFormProps,
  } = useTable(tableOptions);

  // Derived Table Props
  const tableProps = externalTableProps?.tableProps ?? defaultTableProps;
  const queryResult = externalTableProps?.tableQuery ?? defaultQueryResult;
  const searchFormProps =
    externalTableProps?.searchFormProps ?? defaultSearchFormProps;
  const setSorters = externalTableProps?.setSorters ?? defaultSetSorters;
  const setCurrent = externalTableProps?.setCurrent ?? defaultSetCurrent;
  const setPageSize = externalTableProps?.setPageSize ?? defaultSetPageSize;

  // Data State Management
  const [dataWithKeys, setDataWithKeys] = useState<Model[]>([]);
  const [newRecord, setNewRecord] = useState<Model | null>(null);

  useEffect(() => {
    const updatedData = (tableProps.dataSource ?? []).map((item: any) =>
      plainToInstance(dtoClass as any, {
        ...item,
        key: item[primaryKeyFieldName] ?? item.id,
      }),
    );

    if (!isEqual(updatedData, dataWithKeys)) {
      setDataWithKeys(updatedData as Model[]);
    }
  }, [tableProps.dataSource, primaryKeyFieldName]);

  // Row Selection
  const rowSelection = useMemo(() => {
    if (!selectable) return undefined;

    return {
      selectedRowKeys: externalTableProps?.rowSelection?.selectedRowKeys || [],
      onChange: (selectedRowKeys: React.Key[], selectedRows: Model[]) => {
        setIsDisabled(selectedRows.length <= 0);
        onSelectionChange?.(selectedRows);
      },
      getCheckboxProps: (_record: Model) => ({
        disabled: false,
      }),
      type: selectable === SelectionType.SINGLE ? 'radio' : 'checkbox',
    };
  }, [selectable, onSelectionChange, externalTableProps?.rowSelection]);

  // Imperative Handle
  useImperativeHandle(ref, () => ({
    addRecordToTable: (record: Model) => {
      setNewRecord(record);
      setDataWithKeys([record, ...dataWithKeys]);
    },
    removeNewRow: () => {
      setDataWithKeys((prev) => prev.filter((item) => item !== newRecord));
    },
    refreshTable: () => queryResult?.refetch(),
  }));

  // Search Handling with useDebounce
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 250);

  useEffect(() => {
    if (debouncedSearchText && searchFormProps.onFinish) {
      searchFormProps.onFinish();
    }
  }, [debouncedSearchText]);

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [],
  );

  // Render
  return (
    <Col className="table-wrapper">
      <div className="table-header">
        {searchableKeys?.size > 0 && (
          <Form {...searchFormProps} className="search-form">
            <Row>
              <Form.Item name="search" style={{ margin: 0 }}>
                <Input
                  placeholder="Search"
                  onChange={handleSearchInputChange}
                />
              </Form.Item>
              <Col className="search-icon">
                <SearchOutlined />
              </Col>
            </Row>
          </Form>
        )}
        <div className="table-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            disabled={!!editingRecord}
            style={{ float: 'left' }}
          >
            Create
          </Button>
          {customActions && (
            <CustomActions
              isDisabled={isDisabled}
              displayText="Custom Actions"
              actions={CUSTOM_CHARGING_STATION_ACTIONS}
              exclusionList={EXCLUDED_FROM_MULTI_SELECT}
              data={dataWithKeys[0] as unknown as ChargingStation}
            />
          )}
        </div>
      </div>
      <Table
        {...tableProps}
        rowSelection={externalTableProps?.rowSelection ?? rowSelection}
        dataSource={dataWithKeys}
        columns={columns}
        rowClassName={(record) =>
          editingRecord &&
          record[primaryKeyFieldName] ===
            (editingRecord as any)[primaryKeyFieldName]
            ? 'editable-row editing-row'
            : 'editable-row'
        }
        onChange={(pagination, _, sorter) => {
          if (pagination.current) setCurrent(pagination.current);
          if (pagination.pageSize) setPageSize(pagination.pageSize);

          const sort = sorter as SorterResult<any>;
          if (sort.field && sort.order) {
            setSorters([
              {
                field: sort.field,
                order: sort.order === 'ascend' ? 'asc' : 'desc',
              },
            ]);
          } else {
            setSorters([]);
          }
        }}
        className="editable-table"
      />
    </Col>
  );
});

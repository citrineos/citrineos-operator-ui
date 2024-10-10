import { FieldSchema } from '../form';
import { SelectionType } from './editable';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Col, Form, Input, Row, Table, TableProps } from 'antd';
import { plainToInstance } from 'class-transformer';
import { useTable } from '@refinedev/antd';
import isEqual from 'lodash.isequal';
import type { TableRowSelection } from 'antd/lib/table/interface';
import { SorterResult } from 'antd/lib/table/interface';
import { Constructable } from '../../util/Constructable';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchOutlined } from '@ant-design/icons';
import { getSearchableKeys } from '../../util/decorators/Searcheable';

export interface TableWrapperProps<Model> extends TableProps<Model> {
  dtoClass: Constructable<Model>;
  useTableProps: any;
  selectable?: SelectionType | null;
  onSelectionChange?: (selectedRows: Model[]) => void;
  primaryKeyFieldName: string;
  columns: FieldSchema[];
  editingRecord: Model;
  filters?: any;
  dtoResourceType?: string;
  dtoGqlListQuery?: any;
  gqlQueryVariables?: any;
}

export interface TableWrapperRef<Model> {
  addRecordToTable: (record: Model) => void;
  removeNewRow: () => void;
  refreshTable: () => void;
}

export const TableWrapper = forwardRef((<Model extends { key: any }>(
  props: TableWrapperProps<Model>,
  ref: React.Ref<TableWrapperRef<Model>>,
): ForwardRefExoticComponent<TableWrapperProps<Model>> => {
  const {
    selectable,
    onSelectionChange,
    primaryKeyFieldName,
    columns,
    editingRecord,
    dtoClass,
    useTableProps: passedUseTableProps = null,
    filters,
    dtoResourceType,
    dtoGqlListQuery,
    gqlQueryVariables,
  } = props;

  const searchableKeys = useMemo(() => {
    return getSearchableKeys(dtoClass);
  }, [dtoClass]);

  const tableOptions: any = useMemo(() => {
    const meta: any = {
      gqlQuery: dtoGqlListQuery,
    };

    if (gqlQueryVariables) {
      meta.gqlVariables = gqlQueryVariables;
    }

    const obj: any = {
      resource: dtoResourceType,
      sorters: {
        initial: [
          {
            field: 'updatedAt',
            order: 'desc',
          },
        ],
      },
      meta,
    };

    if (searchableKeys && searchableKeys.size > 0) {
      obj['onSearch'] = (values: any) => {
        const result = [];
        if (!values || !values.search || values.search.length === 0) {
          return [];
        }
        for (const searchableKey of searchableKeys) {
          result.push({
            field: searchableKey,
            operator: 'contains',
            value: values.search,
          });
        }
        return result;
      };
    }

    if (filters) {
      obj['filters'] = filters;
    }
    console.log('tableOptions', obj);
    return obj;
  }, [filters]);

  const {
    tableProps: defaultTableProps,
    tableQuery: defaultQueryResult,
    searchFormProps: defaultSearchFormProps,
    setSorter: defaultSetSorter,
    setCurrent: defaultSetCurrent,
    setPageSize: defaultSetPageSize,
  } = useTable(tableOptions as any);

  const tableProps: TableProps<Model> = (
    passedUseTableProps ? passedUseTableProps.tableProps : defaultTableProps
  ) as any;
  const queryResult = (
    passedUseTableProps ? passedUseTableProps.tableQuery : defaultQueryResult
  ) as any;
  const searchFormProps = (
    passedUseTableProps
      ? passedUseTableProps.searchFormProps
      : defaultSearchFormProps
  ) as any;
  const setSorter = (
    passedUseTableProps ? passedUseTableProps.setSorter : defaultSetSorter
  ) as any;
  const setCurrent = (
    passedUseTableProps ? passedUseTableProps.setCurrent : defaultSetCurrent
  ) as any;
  const setPageSize = (
    passedUseTableProps ? passedUseTableProps.setPageSize : defaultSetPageSize
  ) as any;

  const [dataWithKeys, setDataWithKeys] = useState(() =>
    ((tableProps.dataSource as Model[]) || []).map((item: Model) => ({
      ...item,
      key: (item as any)[primaryKeyFieldName] || (item as any).id,
    })),
  );

  useEffect(() => {
    const newVal = (tableProps.dataSource || []).map((item: any) => {
      const newPlain = {
        ...item,
        key: item[primaryKeyFieldName] || item.id,
      };
      return plainToInstance(dtoClass as any, newPlain);
    });
    if (!isEqual(newVal, dataWithKeys)) {
      setDataWithKeys(newVal as any);
    }
  }, [tableProps.dataSource, primaryKeyFieldName]);

  const rowSelection = useMemo(() => {
    if (!selectable) return undefined;

    const handleRowChange = (
      selectedRowKeys: React.Key[],
      selectedRows: any[],
    ) => {
      // Notify parent of selection change
      if (onSelectionChange) {
        onSelectionChange(selectedRows);
      }
    };

    return {
      selectedRowKeys: props?.rowSelection?.selectedRowKeys || [],
      onChange: handleRowChange,
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
      type: selectable === SelectionType.SINGLE ? 'radio' : 'checkbox',
    };
  }, [selectable, onSelectionChange]);

  const addRecordToTable = (record: Model) => {
    setDataWithKeys([record, ...((tableProps.dataSource as Model[]) || [])]);
  };

  const removeNewRow = () => {
    setDataWithKeys((prev: any) => {
      return prev.filter((item: any) => item[primaryKeyFieldName] !== 'new');
    });
  };

  const refreshTable = () => {
    queryResult && queryResult.refetch();
  };

  useImperativeHandle(ref, () => ({
    addRecordToTable,
    removeNewRow,
    refreshTable,
  }));

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchSubject] = useState(() => new Subject<string>());

  useEffect(() => {
    const { form } = searchFormProps;
    const subscription = searchSubject
      .pipe(debounceTime(250))
      .subscribe((searchValue) => {
        searchFormProps.onFinish();
        form.submit();
      });

    return () => subscription.unsubscribe(); // Clean up the subscription
  }, [searchFormProps]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    searchSubject.next(value);
  };

  return (
    <Col className="table-wrapper">
      {searchableKeys && searchableKeys.size > 0 && (
        <Form {...searchFormProps} className="search-form">
          <Row align="middle" justify="start">
            <Form.Item name="search">
              <Input placeholder="Search" onChange={handleSearchInputChange} />
            </Form.Item>
            <Col className="search-icon">
              <SearchOutlined />
            </Col>
          </Row>
        </Form>
      )}
      <Table
        ref={ref as any}
        {...tableProps}
        rowSelection={
          (passedUseTableProps && passedUseTableProps.rowSelection
            ? passedUseTableProps.rowSelection
            : rowSelection) as TableRowSelection<Model> | undefined
        }
        dataSource={dataWithKeys}
        columns={columns as any}
        rowClassName={(record: Model) => {
          const isCurrentlyEditing =
            editingRecord &&
            (record as any)[primaryKeyFieldName] ===
              (editingRecord as any)[primaryKeyFieldName];
          return isCurrentlyEditing
            ? 'editable-row editing-row'
            : 'editable-row';
        }}
        onChange={(pagination, filters, sorter) => {
          // Handle pagination
          if (pagination.current) {
            setCurrent(pagination.current);
          }

          if (pagination.pageSize) {
            setPageSize(pagination.pageSize);
          }

          const sort = sorter as SorterResult<any>;
          if (sort.field && sort.order) {
            setSorter([
              {
                field: sort.field as string,
                order: sort.order === 'ascend' ? 'asc' : 'desc',
              },
            ]);
          } else {
            // Clear sorting if no valid sort is applied
            setSorter([]);
          }
        }}
        className="editable-table"
      />
    </Col>
  ) as any;
}) as unknown as ForwardRefRenderFunction<
  TableWrapperRef<{ key: any }>,
  TableWrapperProps<{ key: any }>
>);

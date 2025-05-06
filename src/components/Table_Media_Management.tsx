// components/EditableTable.tsx
import React, { use, useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

export interface FacebookPost {
  id: string;
  message?: string;
  permalink_url?: string;
  created_time?: string;
}
interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

const EditableRow: React.FC<any> = ({ index, ...props }) => {

  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<any> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


const EditableTable = ({ posts, onViewContent }: { posts: FacebookPost[], onViewContent: (content: string) => void }) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  useEffect(() => {
    const formatted = posts.map((post, index) => ({
      key: post.id,
      name: `${index + 1}`,
      age: post.message || 'No Content', // Default value for age
      address: post.permalink_url || `no url`,
      image: 'src/assets/iconFacebook.svg',
    }));
    console.log(formatted.length);
    
    setDataSource(formatted);
  }, [posts]);
  const [count, setCount] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  console.log(currentPage);
  
  // const handleDelete = (key: React.Key) => {
  //   const newData = dataSource.filter((item) => item.key !== key);
  //   setDataSource(newData);
  // };

  // const handleAdd = () => {
  //   const newData: DataType = {
  //     key: count.toString(),
  //     name: `Edward King ${count}`,
  //     age: '32',
  //     address: `London, Park Lane no. ${count}`,
  //   };
  //   const newList = [...dataSource, newData];
  //   setDataSource(newList);
  //   setCount(count + 1);

  //   const newPage = Math.ceil(newList.length / pageSize);
  //   setCurrentPage(newPage);
  // };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'No.',
      dataIndex: 'name',
      editable: false,
      align: 'center',
    },
    {
      title: 'CONTENT',
      dataIndex: 'age',
      align: 'center',
      render: (text) => (
        <button
          onClick={() => onViewContent(text)}
          className='underline text-blue-500 hover:text-blue-700'>
          View
        </button>
      )
    },
    {
      title: 'TAG',
      dataIndex: 'image',
      align: 'center',
      render: (img: string) =>
        <img src={img} alt="Facebook" className="w-8 h-8 mx-auto" />,
    },
    {
      title: 'URL',
      dataIndex: 'address',
      align: 'center',
      render: (text, record) =>
        record.address && record.address !== 'No URL' ? (
          <a
            href={record.address}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {record.address}
          </a>
        ) : (
          <span className="text-gray-400 italic">No URL</span>
        ),
    }

  ];


  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button> */}
      <Table
        pagination={{
          pageSize,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
        bordered
        components={components}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        rowClassName={() => 'editable-row'}
      />
    </div>
  );
};

export default EditableTable;

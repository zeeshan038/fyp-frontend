import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Typography, Empty, Button, Space, Modal, Image } from 'antd';
import { HistoryOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { confirm } = Modal;

// Sample data - replace with actual API call
const sampleHistoryData = [
  {
    key: '1',
    date: '2023-11-04 14:30',
    condition: 'Eczema',
    confidence: '87%',
    image: 'https://via.placeholder.com/150',
    status: 'completed',
  },
  {
    key: '2',
    date: '2023-11-03 09:15',
    condition: 'Acne',
    confidence: '92%',
    image: 'https://via.placeholder.com/150',
    status: 'completed',
  },
  {
    key: '3',
    date: '2023-11-02 16:45',
    condition: 'Psoriasis',
    confidence: '78%',
    image: 'https://via.placeholder.com/150',
    status: 'completed',
  },
];

const ScanHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchHistory = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/scans/history');
        // const data = await response.json();
        setHistoryData(sampleHistoryData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = (record) => {
    confirm({
      title: 'Delete Scan Record',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this scan record? This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk() {
        // Simulate delete
        setHistoryData(historyData.filter(item => item.key !== record.key));
        message.success('Scan record deleted successfully');
      },
    });
  };

  const handlePreview = (record) => {
    setPreviewImage(record.image);
    setPreviewTitle(`Scan from ${record.date}`);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      filters: [
        { text: 'Eczema', value: 'Eczema' },
        { text: 'Acne', value: 'Acne' },
        { text: 'Psoriasis', value: 'Psoriasis' },
      ],
      onFilter: (value, record) => record.condition === value,
      render: (_, record) => (
        <Tag color={getConditionColor(record.condition)}>
          {record.condition}
        </Tag>
      ),
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      sorter: (a, b) => parseFloat(a.confidence) - parseFloat(b.confidence),
      render: (confidence) => (
        <Text strong style={{ color: getConfidenceColor(confidence) }}>
          {confidence}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handlePreview(record)}
            title="View Details"
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
            title="Delete Record"
          />
        </Space>
      ),
    },
  ];

  const getConditionColor = (condition) => {
    const colors = {
      'Eczema': 'blue',
      'Acne': 'purple',
      'Psoriasis': 'orange',
      'Melanoma': 'red',
      'Rosacea': 'pink',
    };
    return colors[condition] || 'default';
  };

  const getConfidenceColor = (confidence) => {
    const percentage = parseFloat(confidence);
    if (percentage >= 90) return '#52c41a'; // green
    if (percentage >= 70) return '#1890ff'; // blue
    return '#faad14'; // orange
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={3}>
          <HistoryOutlined style={{ marginRight: '8px' }} />
          Scan History
        </Title>
        <Button 
          type="primary" 
          onClick={() => window.location.href = '/upload'}
        >
          New Scan
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          dataSource={historyData}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <span>
                    No scan history found. <a href="/upload">Upload your first scan</a>
                  </span>
                }
              />
            ),
          }}
        />
      </Card>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Image
          width="100%"
          src={previewImage}
          alt="Scan preview"
          style={{ marginBottom: '16px' }}
        />
        <div style={{ marginTop: '16px' }}>
          <p><strong>Condition:</strong> {previewTitle.split(' ').pop()}</p>
          <p><strong>Confidence:</strong> {historyData.find(item => item.image === previewImage)?.confidence}</p>
        </div>
      </Modal>
    </div>
  );
};

export default ScanHistory;

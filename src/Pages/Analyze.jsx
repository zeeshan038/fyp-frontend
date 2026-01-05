import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  theme,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Progress,
  Upload,
  message,
  Table,
  Tag,
  Empty,
  Space,
  Modal,
  Image
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  HistoryOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { BASE_URL } from '../constant';

const { Text } = Typography;
const { confirm } = Modal;

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

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
];

const Analyze = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Logged out successfully');
    navigate('/login');
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();




  // Upload props
  const uploadProps = {
    name: 'image',
    multiple: false,
    accept: 'image/*',
    capture: 'environment', // This opens the camera on mobile
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);

      return false;
    },
    onRemove: () => {
      setFileList([]);
      setPreviewUrl(null);
      return true;
    },
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select an image to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('image', fileList[0], fileList[0].name);

      setUploadProgress(30);

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('You are not logged in. Please login first.');
      }

      // Ensure we don't double the Bearer prefix
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}/api/detect/skin-detection`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        },
        body: formData,
      });

      setUploadProgress(70);

      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || errorData.message || 'Authentication failed. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || errorData.message || 'Detection failed. Please try again.');
      }

      const data = await response.json();

      if (data.status) {
        setResult(data);
        message.success('Analysis complete!');
      } else {
        throw new Error(data.message || 'Detection failed');
      }

      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Failed to analyze image');
    } finally {
      setUploading(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}/api/detect/users-activity`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader
        }
      });

      const data = await response.json();
      if (data.status) {
        setHistoryData(data.data.map(item => ({
          ...item,
          key: item._id, // Antd table needs a key
          date: new Date(item.createdAt).toLocaleString(),
        })));
      } else {
        message.error(data.msg || 'Failed to fetch history');
      }
    } catch (error) {
      console.error('History fetch error:', error);
      message.error('Failed to load scan history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}/api/detect/dashboard-stats`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader
        }
      });

      const data = await response.json();
      if (data.status) {
        setDashboardStats(data.stats);
      } else {
        message.error(data.msg || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      message.error('Failed to load dashboard stats');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (activeView === 'history') {
      fetchHistory();
    } else if (activeView === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeView]);


  const handleMenuClick = ({ key }) => {
    switch (key) {
      case '1':
        setActiveView('dashboard');
        break;
      case '2':
        setActiveView('upload');
        break;
      case '3':
        setActiveView('history');
        break;
      case '4':
        setActiveView('patients');
        break;
      default:
        setActiveView('dashboard');
    }
  };

  const getSelectedKey = () => {
    switch (activeView) {
      case 'dashboard': return '1';
      case 'upload': return '2';
      case 'history': return '3';
      case 'patients': return '4';
      default: return '1';
    }
  };

  // Chart data and configurations
  const lineConfig = {
    data: dashboardStats?.monthlyScans || [],
    xField: 'month',
    yField: 'scans',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {},
    smooth: true,
    color: '#1890ff',
  };

  const pieConfig = {
    data: dashboardStats?.conditionsOverview || [],
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // Render different content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'upload':
        return (
          <div>
            <Title level={3} style={{ marginBottom: '24px' }}>Upload Skin Scan</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Upload Image" style={{ marginBottom: '24px' }}>
                  <Upload.Dragger {...uploadProps} style={{ padding: '20px' }}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">Click or drag image to this area to upload</p>
                    <p className="ant-upload-hint">
                      Support for a single image upload. File should not exceed 5MB.
                    </p>
                  </Upload.Dragger>

                  {fileList.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      {previewUrl && (
                        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            style={{
                              maxHeight: '200px',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: 'center' }}>
                        <Text strong style={{ marginRight: '8px' }}>Selected:</Text>
                        <Text ellipsis style={{ maxWidth: '200px' }}>{fileList[0].name}</Text>
                      </div>
                      <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={uploading}
                        icon={uploading ? <LoadingOutlined /> : null}
                        style={{ width: '100%' }}
                      >
                        {uploading ? 'Analyzing...' : 'Analyze Image'}
                      </Button>

                      {uploadProgress > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Progress percent={uploadProgress} status={uploading ? 'active' : 'success'} />
                          <Text type="secondary" style={{ display: 'block', marginTop: '8px', textAlign: 'center' }}>
                            {uploading ? 'Analyzing your image...' : 'Analysis complete!'}
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Analysis Results">
                  {result ? (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <CheckCircleFilled style={{ fontSize: '48px', color: '#52c41a' }} />
                        <Title level={4} style={{ marginTop: '16px' }}>Analysis Complete</Title>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <Text strong>Detected Condition:</Text>
                          <Text>{result.condition}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <Text strong>Confidence Level:</Text>
                          <Text type="success">{result.confidence}</Text>
                        </div>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <Text strong>Advice:</Text>
                        <p>{result.advice}</p>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <Text strong>Urgency:</Text>
                        <Tag color={result.urgency === 'routine' ? 'blue' : 'red'} style={{ marginLeft: '8px' }}>
                          {result.urgency?.toUpperCase()}
                        </Tag>
                      </div>

                      {result.medications && (
                        <div>
                          <Text strong>Medications:</Text>
                          <div style={{ marginTop: '8px' }}>
                            <Text italic>OTC:</Text>
                            <ul style={{ paddingLeft: '20px' }}>
                              {result.medications.otc?.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                            <Text italic>Prescription:</Text>
                            <ul style={{ paddingLeft: '20px' }}>
                              {result.medications.prescription?.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                            <Text type="warning" size="small">{result.medications.caution}</Text>
                          </div>
                        </div>
                      )}

                      <Button
                        type="primary"
                        style={{ marginTop: '16px', width: '100%' }}
                        onClick={() => {
                          // Save to history
                          message.success('Results saved to history');
                        }}
                      >
                        Save to History
                      </Button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">Upload and analyze an image to see results</Text>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        );

      case 'history':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={3}>
                <HistoryOutlined style={{ marginRight: '8px' }} />
                Scan History
              </Title>
              <Button
                type="primary"
                onClick={() => setActiveView('upload')}
              >
                New Scan
              </Button>
            </div>

            <Card>
              <Table
                columns={[
                  {
                    title: 'Date & Time',
                    dataIndex: 'date',
                    key: 'date',
                  },
                  {
                    title: 'Preview',
                    dataIndex: 'imageUrl',
                    key: 'imageUrl',
                    render: (url) => (
                      <Image
                        src={url}
                        alt="Scan preview"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ),
                  },
                  {
                    title: 'Condition',
                    dataIndex: 'condition',
                    key: 'condition',
                    render: (condition) => (
                      <Tag color={getConditionColor(condition)}>
                        {condition}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Confidence',
                    dataIndex: 'confidence',
                    key: 'confidence',
                    render: (confidence) => (
                      <Text strong style={{ color: getConfidenceColor(confidence) }}>
                        {typeof confidence === 'number' ? `${(confidence * 100).toFixed(1)}%` : confidence}
                      </Text>
                    ),
                  },
                  {
                    title: 'Urgency',
                    dataIndex: 'urgency',
                    key: 'urgency',
                    render: (urgency) => (
                      <Tag color={urgency === 'routine' ? 'blue' : 'red'}>
                        {urgency?.toUpperCase()}
                      </Tag>
                    ),
                  },

                ]}
                dataSource={historyData}
                loading={loadingHistory}
                pagination={{ pageSize: 5 }}
                locale={{
                  emptyText: 'No scan history found'
                }}
              />
            </Card>
          </div>
        );

      case 'patients':
        return (
          <div>
            <Title level={3} style={{ marginBottom: '24px' }}>Patients</Title>
            <Card>
              <Empty
                description={
                  <span>No patients found. This feature is coming soon!</span>
                }
              />
            </Card>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <>
            <Title level={3} style={{ marginBottom: '24px' }}>Skin Disease Analysis Dashboard</Title>

            {/* Stats Overview Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} md={8}>
                <Card loading={loadingStats}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '16px' }}>
                      <LineChartOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                    </div>
                    <div>
                      <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Total Scans</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardStats?.totalScans || 0}</div>
                      <div style={{ color: '#52c41a' }}>Activity tracked</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card loading={loadingStats}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '16px' }}>
                      <PieChartOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                    </div>
                    <div>
                      <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Detected Conditions</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardStats?.detectedConditions || 0}</div>
                      <div style={{ color: '#1890ff' }}>Unique conditions found</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card loading={loadingStats}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '16px' }}>
                      <BarChartOutlined style={{ fontSize: '32px', color: '#faad14' }} />
                    </div>
                    <div>
                      <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Accuracy Rate</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardStats?.accuracyRate || '0%'}</div>
                      <div style={{ color: '#52c41a' }}>Model confidence avg</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} md={12}>
                <Card title="Monthly Scans Analysis" style={{ height: '100%' }} loading={loadingStats}>
                  {dashboardStats?.monthlyScans?.length > 0 ? <Line {...lineConfig} /> : <Empty description="No monthly data" />}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Conditions Overview" style={{ height: '100%' }} loading={loadingStats}>
                  {dashboardStats?.conditionsOverview?.length > 0 ? <Pie {...pieConfig} /> : <Empty description="No condition data" />}
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  // Helper functions
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
    const percentage = typeof confidence === 'number' ? confidence * 100 : parseFloat(confidence);
    if (percentage >= 90) return '#52c41a'; // green
    if (percentage >= 70) return '#1890ff'; // blue
    return '#faad14'; // orange
  };

  const handlePreview = (record) => {
    Modal.info({
      title: `Scan Analysis: ${record.condition}`,
      width: 600,
      content: (
        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingTop: '10px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Image
              width={300}
              src={record.image}
              alt="Scan preview"
              style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Tag color={getConditionColor(record.condition)} style={{ fontSize: '14px', padding: '4px 12px' }}>
              {record.condition?.toUpperCase()}
            </Tag>
            <Tag color={getConfidenceColor(record.confidence)} style={{ fontSize: '14px', padding: '4px 12px' }}>
              {typeof record.confidence === 'number' ? `${(record.confidence * 100).toFixed(1)}%` : record.confidence} Confidence
            </Tag>
          </div>

          <p><strong>Date:</strong> {record.date}</p>
          <p><strong>Urgency:</strong> <Tag color={record.urgency === 'routine' ? 'blue' : 'red'}>{record.urgency?.toUpperCase()}</Tag></p>

          <div style={{ marginTop: '16px' }}>
            <strong>Advice:</strong>
            <p style={{ marginTop: '4px', color: 'rgba(0,0,0,0.65)' }}>{record.advice || record.result?.advice}</p>
          </div>

          {(record.medications || record.result?.medications) && (
            <div style={{ marginTop: '16px' }}>
              <strong>Medications:</strong>
              <div style={{ marginTop: '8px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
                <Text italic strong>OTC:</Text>
                <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>
                  {(record.medications?.otc || record.result?.medications?.otc)?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <Text italic strong>Prescription:</Text>
                <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>
                  {(record.medications?.prescription || record.result?.medications?.prescription)?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <Text type="warning" size="small">
                  <strong>Caution:</strong> {record.medications?.caution || record.result?.medications?.caution}
                </Text>
              </div>
            </div>
          )}
        </div>
      ),
    });
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Delete Scan Record',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this scan record?',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk() {
        message.success('Scan record deleted successfully');
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="demo-logo-vertical" style={{ height: '64px', margin: '16px', background: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px' }} />
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            {
              key: '2',
              icon: <UploadOutlined />,
              label: 'Upload Scan',
            },
            {
              key: '3',
              icon: <HistoryOutlined />,
              label: 'History',
            },
            {
              key: '4',
              icon: <TeamOutlined />,
              label: 'Patients',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: '24px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar icon={<UserOutlined />} />
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Analyze;

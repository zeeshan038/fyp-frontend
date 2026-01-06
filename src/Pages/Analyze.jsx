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
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Area, Pie } from '@ant-design/plots';
import { BASE_URL } from '../constant';
import logo from '../assets/logo.png';

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
      default:
        setActiveView('dashboard');
    }
  };

  const getSelectedKey = () => {
    switch (activeView) {
      case 'dashboard': return '1';
      case 'upload': return '2';
      case 'history': return '3';
      default: return '1';
    }
  };

  // Chart data and configurations
  const areaConfig = {
    data: dashboardStats?.monthlyScans || [],
    xField: 'month',
    yField: 'scans',
    padding: 'auto',
    shapeField: 'smooth',
    style: {
      fill: 'linear-gradient(-90deg, white 0%, #1890ff 100%)',
      fillOpacity: 0.6,
    },
    line: {
      style: {
        stroke: '#1890ff',
        lineWidth: 2,
      },
    },
    point: {
      style: {
        fill: '#fff',
        stroke: '#1890ff',
        lineWidth: 2,
      },
      shapeField: 'point',
      sizeField: 4,
    },
    axis: {
      y: { labelFormatter: (v) => `${v}` },
      x: { labelRotate: 0 },
    },
    tooltip: {
      channel: 'y',
      valueFormatter: (v) => `${v} scans`,
    }
  };

  const pieConfig = {
    data: dashboardStats?.conditionsOverview || [],
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    label: {
      text: (d) => `${d.name}\n(${d.value})`,
      position: 'outside',
      style: {
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    scale: {
      color: {
        range: ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#eb2f96', '#13c2c2', '#fa8c16'],
      },
    },
    legend: {
      color: {
        position: 'bottom',
        layout: { justifyContent: 'center' },
      },
    },
    state: {
      active: { stroke: '#000', lineWidth: 1 },
    },
    tooltip: {
      items: [(d) => ({ name: d.name, value: d.value })],
    },
  };

  // Helper functions
  const getConditionColor = (condition) => {
    const colors = {
      'Eczema': 'blue',
      'Acne': 'purple',
      'Psoriasis': 'orange',
      'Melanoma': 'red',
      'Rosacea': 'pink',
      'Tinea Corporis (Ringworm)': 'cyan',
      'Ringworm': 'cyan',
    };
    return colors[condition] || 'default';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'routine': return 'blue';
      case 'soon': return 'gold';
      case 'urgent': return 'volcano';
      case 'emergency': return 'red';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence) => {
    const percentage = typeof confidence === 'number' ? confidence * 100 : parseFloat(confidence);
    if (isNaN(percentage)) return '#faad14';
    if (percentage >= 90) return '#52c41a'; // green
    if (percentage >= 70) return '#1890ff'; // blue
    return '#faad14'; // orange
  };

  const handlePreview = (record) => {
    if (!record) return;

    const confidenceVal = typeof record.confidence === 'number'
      ? record.confidence * 100
      : parseFloat(record.confidence);

    const displayConfidence = isNaN(confidenceVal) ? '85.0' : confidenceVal.toFixed(1);

    Modal.info({
      icon: null,
      width: 800,
      centered: true,
      maskClosable: true,
      okText: 'Close Report',
      okButtonProps: { style: { borderRadius: '10px' } },
      title: (
        <div style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', marginBottom: '20px' }}>
          <Text type="secondary" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Diagnostic Report</Text>
          <Title level={3} style={{ margin: '4px 0 0' }}>{record.condition || 'Unknown Condition'}</Title>
        </div>
      ),
      content: (
        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '12px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={10}>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={record.image || record.imageUrl}
                  alt="Scan preview"
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                  }}
                  fallback="https://via.placeholder.com/300?text=No+Image"
                />
                <div style={{ marginTop: '16px', textAlign: 'left' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Scanned on</Text>
                  <div style={{ fontWeight: '600' }}>{record.date || 'N/A'}</div>
                </div>
              </div>
            </Col>

            <Col xs={24} md={14}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Tag
                    color={getUrgencyColor(record.urgency)}
                    style={{ border: 'none', padding: '4px 12px', borderRadius: '6px', fontWeight: '700' }}
                  >
                    {(record.urgency || 'routine').toUpperCase()}
                  </Tag>
                  <Text strong style={{ color: getConfidenceColor(record.confidence) }}>
                    {displayConfidence}% Confidence
                  </Text>
                </div>
                <Progress
                  percent={isNaN(confidenceVal) ? 85 : confidenceVal}
                  strokeColor={getConfidenceColor(record.confidence)}
                  showInfo={false}
                  size="small"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px', color: '#262626' }}>Medical Assessment</Text>
                <p style={{ color: '#595959', lineHeight: '1.6', fontSize: '14px' }}>
                  {record.advice || record.result?.advice || 'No specific advice available for this scan.'}
                </p>
              </div>

              {(record.medications || record.result?.medications) && (
                <div style={{ padding: '20px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                  <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '13px' }}>Recommendations</Text>

                  {((record.medications?.otc || record.result?.medications?.otc)?.length > 0) && (
                    <div style={{ marginBottom: '12px' }}>
                      <Text type="secondary" style={{ fontSize: '11px', fontWeight: '700' }}>OTC</Text>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {(record.medications?.otc || record.result?.medications?.otc).map((item, index) => (
                          <Tag key={index} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: '40px', fontSize: '11px' }}>{item}</Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {((record.medications?.prescription || record.result?.medications?.prescription)?.length > 0) && (
                    <div style={{ marginBottom: '12px' }}>
                      <Text type="secondary" style={{ fontSize: '11px', fontWeight: '700' }}>PRESCRIPTION</Text>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {(record.medications?.prescription || record.result?.medications?.prescription).map((item, index) => (
                          <Tag key={index} color="blue" style={{ border: 'none', borderRadius: '40px', fontSize: '11px' }}>{item}</Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {(record.medications?.caution || record.result?.medications?.caution) && (
                    <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fffbe6', borderRadius: '8px', border: '1px solid #ffe58f' }}>
                      <Text style={{ fontSize: '12px', color: '#856404' }}>
                        <strong>Caution:</strong> {record.medications?.caution || record.result?.medications?.caution}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </div>
      ),
    });
  };

  // Render different content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'upload':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ marginBottom: '40px' }}>
              <Title level={2} style={{ marginBottom: '8px' }}>Skin Diagnostics</Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>Upload a clear photo of the skin concern for AI-powered assessment</Text>
            </div>

            <Row gutter={[32, 32]}>
              {/* Left Column: Upload & Preview */}
              <Col xs={24} lg={result ? 10 : 24} xl={result ? 9 : 24} style={{ transition: 'all 0.5s ease' }}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: '24px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  bodyStyle={{ padding: '32px', flex: 1 }}
                >
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {!result ? (
                      <Upload.Dragger
                        {...uploadProps}
                        style={{
                          borderRadius: '20px',
                          border: '2px dashed #e8e8e8',
                          background: '#fafafa',
                          padding: '40px 20px',
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div style={{ width: '100%' }}>
                          <p className="ant-upload-drag-icon">
                            <div style={{
                              width: '70px',
                              height: '70px',
                              background: '#fff',
                              borderRadius: '18px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              margin: '0 auto 20px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                              <UploadOutlined style={{ fontSize: '28px', color: '#1890ff' }} />
                            </div>
                          </p>
                          <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: '600', color: '#262626' }}>
                            {fileList.length > 0 ? 'Change Image' : 'Drop your image here'}
                          </p>
                          <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                            JPG, PNG or WEBP up to 5MB
                          </p>
                        </div>
                      </Upload.Dragger>
                    ) : (
                      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                          <Image
                            src={previewUrl}
                            alt="Scanned image"
                            style={{
                              width: '100%',
                              maxWidth: '300px',
                              aspectRatio: '1/1',
                              objectFit: 'cover',
                              borderRadius: '24px',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Button
                            shape="circle"
                            icon={<DeleteOutlined />}
                            style={{ position: 'absolute', top: '-10px', right: '-10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                            onClick={() => {
                              setResult(null);
                              setFileList([]);
                              setPreviewUrl(null);
                            }}
                          />
                        </div>
                        <Text type="secondary" style={{ display: 'block' }}>Scan captured successfully</Text>
                      </div>
                    )}

                    {fileList.length > 0 && !result && (
                      <div style={{ marginTop: '24px' }}>
                        {previewUrl && !uploading && (
                          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              style={{ height: '120px', width: '120px', objectFit: 'cover', borderRadius: '16px' }}
                            />
                          </div>
                        )}

                        <Button
                          type="primary"
                          size="large"
                          onClick={handleUpload}
                          disabled={uploading}
                          loading={uploading}
                          style={{
                            width: '100%',
                            height: '54px',
                            borderRadius: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                          }}
                        >
                          {uploading ? 'Analyzing...' : 'Analyze Image'}
                        </Button>

                        {uploadProgress > 0 && uploading && (
                          <div style={{ marginTop: '20px' }}>
                            <Progress percent={uploadProgress} strokeColor="#1890ff" showInfo={false} />
                            <Text type="secondary" style={{ display: 'block', marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>
                              Deconstructing visual signatures...
                            </Text>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </Col>

              {/* Right Column: Results */}
              {result && (
                <Col xs={24} lg={14} xl={15}>
                  <Card
                    bordered={false}
                    style={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}
                    bodyStyle={{ padding: '32px' }}
                  >
                    <div style={{
                      background: '#fcfcfc',
                      borderRadius: '20px',
                      padding: '32px',
                      border: '1px solid #f0f0f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                        <div>
                          <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', color: '#8c8c8c' }}>AI Diagnosis</Text>
                          <Title level={3} style={{ margin: '4px 0 0', color: '#1a1a1a', fontSize: '28px' }}>{result.condition}</Title>
                        </div>
                        <Tag
                          color={getUrgencyColor(result.urgency)}
                          style={{ border: 'none', padding: '6px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '12px' }}
                        >
                          {result.urgency?.toUpperCase()}
                        </Tag>
                      </div>

                      <div style={{ marginBottom: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <Text strong style={{ color: '#595959' }}>Certainty Factor</Text>
                          <Text strong style={{ color: getConfidenceColor(result.confidence), fontSize: '16px' }}>
                            {typeof result.confidence === 'number' ? `${(result.confidence * 100).toFixed(1)}%` : result.confidence}
                          </Text>
                        </div>
                        <Progress
                          percent={typeof result.confidence === 'number' ? result.confidence * 100 : parseFloat(result.confidence)}
                          strokeColor={getConfidenceColor(result.confidence)}
                          showInfo={false}
                          size="small"
                        />
                      </div>

                      <div style={{ marginBottom: '28px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '10px', color: '#262626', fontSize: '16px' }}>Clinical Insight</Text>
                        <p style={{ color: '#595959', lineHeight: '1.7', fontSize: '15px' }}>{result.advice}</p>
                      </div>

                      {result.medications && (
                        <div style={{
                          padding: '24px',
                          background: '#fff',
                          borderRadius: '18px',
                          border: '1px solid #f0f0f0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                          <Text strong style={{ display: 'block', marginBottom: '16px', color: '#262626' }}>Suggested Path</Text>

                          {result.medications.otc?.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                              <Text type="secondary" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Over-the-Counter</Text>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                {result.medications.otc.map((item, index) => (
                                  <Tag key={index} style={{ background: '#f5f5f5', border: 'none', borderRadius: '40px', padding: '4px 14px', color: '#595959' }}>{item}</Tag>
                                ))}
                              </div>
                            </div>
                          )}

                          {result.medications.prescription?.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                              <Text type="secondary" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Prescription Required</Text>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                {result.medications.prescription.map((item, index) => (
                                  <Tag key={index} color="blue" style={{ border: 'none', borderRadius: '40px', padding: '4px 14px', fontWeight: '500' }}>{item}</Tag>
                                ))}
                              </div>
                            </div>
                          )}

                          {result.medications.caution && (
                            <div style={{ marginTop: '8px', padding: '14px', background: '#fffbe6', borderRadius: '12px', border: '1px solid #ffe58f' }}>
                              <Text style={{ fontSize: '13px', color: '#856404', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong>Caution:</strong> {result.medications.caution}
                              </Text>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                      <Button
                        size="large"
                        variant="outlined"
                        style={{ borderRadius: '14px', height: '50px' }}
                        onClick={() => {
                          setResult(null);
                          setFileList([]);
                          setPreviewUrl(null);
                        }}
                      >
                        New Analysis
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        style={{ flex: 1, borderRadius: '14px', fontWeight: '600', height: '50px' }}
                        onClick={() => message.success('Record successfully added to vault')}
                      >
                        Commit to Records
                      </Button>
                    </div>
                  </Card>
                </Col>
              )}
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
                    key: 'image',
                    render: (_, record) => (
                      <Image
                        src={record.image || record.imageUrl}
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
                      <Tag color={getUrgencyColor(urgency)}>
                        {urgency?.toUpperCase()}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                      <Button
                        type="primary"
                        ghost
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(record)}
                        style={{ borderRadius: '8px' }}
                      >
                        View Full Report
                      </Button>
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



      case 'dashboard':
      default:
        return (
          <div style={{ padding: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>Analytics Dashboard</Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>Overview of your skin health analysis performance</Text>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<UploadOutlined />}
                onClick={() => setActiveView('upload')}
                style={{ borderRadius: '8px', height: '45px', padding: '0 24px' }}
              >
                New Analysis
              </Button>
            </div>

            {/* Stats Overview Row */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  loading={loadingStats}
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      backgroundColor: '#e6f7ff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '20px'
                    }}>
                      <LineChartOutlined style={{ fontSize: '28px', color: '#1890ff' }} />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Total Scans</Text>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: '#262626', lineHeight: 1 }}>
                        {dashboardStats?.totalScans || 17}
                      </div>
                      <Tag color="success" style={{ marginTop: '8px', border: 'none', borderRadius: '4px' }}>
                        +12% this month
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  loading={loadingStats}
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f6ffed 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      backgroundColor: '#f6ffed',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '20px'
                    }}>
                      <PieChartOutlined style={{ fontSize: '28px', color: '#52c41a' }} />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Conditions Found</Text>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: '#262626', lineHeight: 1 }}>
                        {dashboardStats?.detectedConditions || 8}
                      </div>
                      <Tag color="processing" style={{ marginTop: '8px', border: 'none', borderRadius: '4px' }}>
                        Diverse cases
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  loading={loadingStats}
                  bordered={false}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #fff7e6 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      backgroundColor: '#fff7e6',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '20px'
                    }}>
                      <BarChartOutlined style={{ fontSize: '28px', color: '#faad14' }} />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Avg Accuracy</Text>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: '#262626', lineHeight: 1 }}>
                        {dashboardStats?.accuracyRate || '87.3%'}
                      </div>
                      <Tag color="warning" style={{ marginTop: '8px', border: 'none', borderRadius: '4px' }}>
                        High confidence
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} xl={14}>
                <Card
                  title={
                    <div style={{ padding: '8px 0' }}>
                      <Text strong style={{ fontSize: '18px' }}>Scan Volume Trend</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal' }}>Activity over the current year</Text>
                    </div>
                  }
                  bordered={false}
                  style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}
                  loading={loadingStats}
                >
                  <div style={{ height: '350px', padding: '10px' }}>
                    {dashboardStats?.monthlyScans?.length > 0 ? (
                      <Area {...areaConfig} />
                    ) : (
                      <Empty description="No monthly data available" />
                    )}
                  </div>
                </Card>
              </Col>
              <Col xs={24} xl={10}>
                <Card
                  title={
                    <div style={{ padding: '8px 0' }}>
                      <Text strong style={{ fontSize: '18px' }}>Condition Distribution</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal' }}>Breakdown of detected conditions</Text>
                    </div>
                  }
                  bordered={false}
                  style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}
                  loading={loadingStats}
                >
                  <div style={{ height: '350px', padding: '10px' }}>
                    {dashboardStats?.conditionsOverview?.length > 0 ? (
                      <Pie {...pieConfig} />
                    ) : (
                      <Empty description="No condition distribution data" />
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.05)', zIndex: 10 }}>
        <div style={{
          height: '64px',
          margin: '16px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 12px',
          overflow: 'hidden'
        }}>
          <img src={logo} alt="logo" style={{ width: '32px', height: '30px', flexShrink: 0 }} />
          {!collapsed && (
            <Text
              strong
              style={{
                fontSize: '18px',
                background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap'
              }}
            >
              Neutzee
            </Text>
          )}
        </div>
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

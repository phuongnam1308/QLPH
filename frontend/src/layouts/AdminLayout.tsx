import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems = [
    {
        key: 'users',
        icon: <UserOutlined />,
        label: 'Users',
    },
    {
        key: 'bookings',
        icon: <VideoCameraOutlined />,
        label: 'Bookings',
    },
    {
        key: 'rooms',
        icon: <UploadOutlined />,
        label: 'Rooms',
    },
];

const getSelectedKey = (pathname: string) => {
    const path = pathname.replace(/^\/admin\/?/, "");
    if (!path || path === "") return "users";
    const firstPart = path.split("/")[0];
    return firstPart;
};

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();
    const navigate = useNavigate();
    const selectedKey = getSelectedKey(location.pathname);

    return (
        <Layout style={{ minHeight: '100vh', padding: 0, margin: 0 }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical">
                    <h1>{collapsed ? "MT" : "MEETING"}</h1>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={({ key }) => {
                        navigate(`/admin/${key}`);
                    }}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
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
                    <ToastContainer
                        position="top-right"
                        autoClose={1500}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;

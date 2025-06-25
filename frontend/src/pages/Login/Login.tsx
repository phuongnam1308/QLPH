import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify';

type FieldType = {
username?: string;
password?: string;
remember?: string;
};

const Login: React.FC = () => {
const navigate = useNavigate();

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
    const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
        username: values.username,
        password: values.password,
        },
        {
        withCredentials: true,
        }
    );

    const { accessToken, user } = response.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    toast.success('Đăng nhập thành công');

    if (user.roles.includes('admin')) {
        navigate('/admin');
    } else {
        navigate('/');
    }
    }  catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        const msg =
            error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
        toast.error('Đăng nhập thất bại: ' + msg);
        message.error(msg);
        } else {
        toast.error('Đăng nhập thất bại');
        message.error('Đăng nhập thất bại');
        }
    }
};

return (
    <Form
    name="basic"
    className="login-form"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
    >
    <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
    >
        <Input />
    </Form.Item>

    <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
    >
        <Input.Password />
    </Form.Item>

    <Form.Item<FieldType> name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item>
        <Button type="primary" htmlType="submit">
        Đăng nhập
        </Button>
    </Form.Item>
    </Form>
);
};

export default Login;

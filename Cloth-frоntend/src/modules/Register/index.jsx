import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';

import axios from '../../axios';
import { fetchRegister } from '../../redux/slices/Auth';
import { Button } from '../../components';
import './Register.scss';

const Register = () => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(false);

    // Состояние для хранения данных формы
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        login: '',
        password: '',
        confirmation: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Введите имя';
        if (!formData.surname) newErrors.surname = 'Введите фамилию';
        if (!formData.login) newErrors.login = 'Введите логин';
        if (!formData.password) newErrors.password = 'Введите пароль';
        if (formData.password !== formData.confirmation) {
            newErrors.confirmation = 'Пароли не совпадают';
        }
        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const { confirmation, ...data } = formData;

        try {
            const response = await axios.post('/auth/checkLogin', { login: formData.login });
            if (response.data.error) {
                setErrors({ login: response.data.error });
                return;
            }

            await dispatch(fetchRegister(data)).unwrap();
            message.success('Регистрация прошла успешно!', 1.3);
            setStatus(true);
        } catch (error) {
            setErrors({ login: error.response?.data?.message || 'Ошибка при регистрации' });
        }
    };

    return (
        <div className="register">
            {status && <Navigate to="/auth/login" />}
            <h1>Регистрация</h1>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
            >
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <Form.Item
                        name="Name"
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name}
                        style={{ flex: 1 }}
                    >
                        <Input
                            id="name"
                            prefix={<UserOutlined />}
                            placeholder="Имя"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="Surname"
                        validateStatus={errors.surname ? 'error' : ''}
                        help={errors.surname}
                        style={{ flex: 1 }}
                    >
                        <Input
                            id="surname"
                            prefix={<UserOutlined />}
                            placeholder="Фамилия"
                            value={formData.surname}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    name="Login"
                    validateStatus={errors.login ? 'error' : ''}
                    help={errors.login}
                >
                    <Input
                        id="login"
                        prefix={<UserOutlined />}
                        placeholder="Придумайте логин"
                        value={formData.login}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item
                    name="Password"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password}
                >
                    <Input.Password
                        id="password"
                        prefix={<LockOutlined />}
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item
                    name="Confirmation"
                    validateStatus={errors.confirmation ? 'error' : ''}
                    help={errors.confirmation}
                >
                    <Input.Password
                        id="confirmation"
                        prefix={<LockOutlined />}
                        placeholder="Подтвердите пароль"
                        value={formData.confirmation}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        action={handleSubmit}
                        isSubmitting={false}
                        content="Зарегистрироваться"
                        padding={10}
                        borderRadius={10}
                    />
                </Form.Item>
            </Form>
            <Link to="/auth/login">Авторизоваться</Link>
        </div>
    );
};

export default Register;

import React from 'react'
import { Link } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, message } from 'antd'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'

import { fetchLogin } from '../../redux/slices/Auth'
import { Button } from '../../components'
import './Login.scss'

const Login = () => {
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        validate: values => {
            let errors = {}

            if (values.login === '') {
                errors.login = 'Пожалуйста заполните это поле'
            }
            if (values.password === '') {
                errors.password = 'Пожалуйста заполните это поле'
            }

            return errors
        },
        onSubmit: async values => {
            console.log(values)
            await (dispatch(fetchLogin(values)).unwrap().then(data => {
                message.success(`Добро пожаловать, ${data.name}!`, 1.3)

                if ('token' in data) {
                    localStorage.setItem('token', data.token)
                } else {
                    message.error('Не удалось авторизоваться', 1.3)
                }
            }).catch(error => {
                message.error(error.message, 1.3)
            }))
        }
    })

    return (
        <div className='login'>
            <h1>Авторизация</h1>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    name="Login"
                    help={formik.touched.login && formik.errors.login && formik.errors.login}
                    validateStatus={!formik.touched.login ? '' : formik.errors.login ? 'error' : 'success'}
                    rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                >
                    <Input
                        id='login'
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Логин"
                        value={formik.values.login}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item
                    name="Password"
                    help={formik.touched.password && formik.errors.password && formik.errors.password}
                    validateStatus={!formik.touched.password ? '' : formik.errors.password ? 'error' : 'success'}
                    rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                >
                    <Input.Password
                        id='password'
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Пароль"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item>
                    <Button action={formik.handleSubmit} isSubmitting={formik.isSubmitting} content='Войти' padding={10} borderRadius={10}></Button>
                </Form.Item>
            </Form>
            <Link to='/auth/register'>Зарегестрироваться</Link>
        </div>
    )
}

export default Login
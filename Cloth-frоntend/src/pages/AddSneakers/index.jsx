import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CaretLeft } from 'react-bootstrap-icons'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { Form, Upload, Input, message, Col, Row } from 'antd'
import { useFormik } from 'formik'

import { Button } from '../../components'
import { fetchAddCard } from '../../redux/slices/Card'
import './AddSneakers.scss'

const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

const dummyRequest = ({ onSuccess }) => onSuccess("ok")

const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('Можно загружать только JPG/PNG файлы!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Максильный размер изображения 2MB!')
    }
    return isJpgOrPng && isLt2M
}

const AddSneakers = () => {
    const dispatch = useDispatch()

    const [status, setStatus] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [imageUrl, setImageUrl] = React.useState()
    const [image, setImage] = React.useState()

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false)
                setImageUrl(url)
                setImage(info.file.originFileObj)
            })
        }
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: '',
        },
        validate: values => {
            let errors = {}

            if (values.title === '') {
                errors.title = 'Пожалуйста заполните это поле'
            }
            if (values.description === '') {
                errors.description = 'Пожалуйста заполните это поле'
            }
            if (values.price === '') {
                errors.price = 'Пожалуйста заполните это поле'
            }
            if (values.imageUrl === '') {
                errors.imageUrl = 'Пожалуйста заполните это поле'
            }

            return errors
        },
        onSubmit: async values => {
            const formData = new FormData()
            const { price, ...otherValues } = values
            const imageName = image.name
            formData.append('image', image)

            const data = {
                formData,
                imageName,
                price: Number(price),
                ...otherValues
            }
            await dispatch(fetchAddCard(data)).unwrap().then(() => {
                message.success('Товар успешно добавлен!', 1.3)
                setStatus(true)
            }).catch(error => {
                message.error(error.message, 1.3)
            })
        }
    })

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Добвить изображение
            </div>
        </div>
    )

    return (
        <div className='addsneakers'>
            {status && <Navigate to='/' />}
            <div className="addsneakers__header">
                <Link to='/' className='addsneakers__header--back'>
                    <CaretLeft />
                </Link>
                <h1>Добавить товар</h1>
            </div>
            <div className="addsneakers__form">
                <Form
                    name="addsneakers"
                    initialValues={{ remember: true }}
                >
                    <Row>
                        <Form.Item
                            name='Image'
                            rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                        >
                            <Upload
                                listType="picture-card"
                                className="addsneakers__form-uploader"
                                showUploadList={false}
                                customRequest={dummyRequest}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="avatar"
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>
                        <Col style={{ flex: 1 }}>
                            <Form.Item
                                name="Title"
                                style={{ marginBottom: 20 }}
                                help={formik.touched.title && formik.errors.title && formik.errors.title}
                                validateStatus={!formik.touched.title ? '' : formik.errors.title ? 'error' : 'success'}
                                rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                            >
                                <Input.TextArea
                                    id='title'
                                    autoSize
                                    style={{ width: '100%' }}
                                    placeholder="Название"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                name="Description"
                                style={{ marginBottom: 20 }}
                                help={formik.touched.description && formik.errors.description && formik.errors.description}
                                validateStatus={!formik.touched.description ? '' : formik.errors.description ? 'error' : 'success'}
                                rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                            >
                                <Input.TextArea
                                    id='description'
                                    autoSize
                                    style={{ width: '100%' }}
                                    placeholder="Осписание товара"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                name='Price'
                                help={formik.touched.price && formik.errors.price && formik.errors.price}
                                validateStatus={!formik.touched.price ? '' : formik.errors.price ? 'error' : 'success'}
                                rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                            >
                                <Input
                                    id='price'
                                    prefix='₽'
                                    style={{ width: 200 }}
                                    placeholder='Цена'
                                    formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    isSubmitting={formik.isSubmitting}
                                    action={formik.handleSubmit}
                                    content='Добавить'
                                    width={200}
                                    padding={10}
                                    borderRadius={10}
                                ></Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    )
}

export default AddSneakers
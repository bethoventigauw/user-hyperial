import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Spin, Form, Input, Button, Typography, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import './Profiles.css';

const { Title, Text } = Typography;

const Profiles = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/vendors/get-vendor/${id}`);
        setVendor(response.data.vendor);
        form.setFieldsValue(response.data.vendor);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id, form]);

  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/vendors/edit-vendor/${id}`, values);
      setVendor(response.data.vendor);
      setIsEditing(false);
      setIsEditModalVisible(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Spin size="large" className="loading" />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!vendor) {
    return <div className="not-found">Vendor tidak ditemukan</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile Vendor</h2>
      <div className="profile-summary">
        <p><strong>Nama Vendor:</strong> {vendor.VendorName}</p>
        <p><strong>Alamat:</strong> {vendor.Address}</p>
        <p><strong>Kota:</strong> {vendor.City}</p>
        <p><strong>No. Telepon:</strong> {vendor.PhoneNumber}</p>
        <Button type="link" onClick={() => setIsModalVisible(true)}>View Details</Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditModalVisible(true)}>Edit Profile</Button>
      </div>

      <Modal
        title="Detail Vendor"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={<Button onClick={() => setIsModalVisible(false)}>Close</Button>}
        className="profile-details-modal"
      >
        <p><strong>Nama Vendor:</strong> {vendor.VendorName}</p>
        <p><strong>Alamat:</strong> {vendor.Address}</p>
        <p><strong>Kota:</strong> {vendor.City}</p>
        <p><strong>Provinsi:</strong> {vendor.State}</p>
        <p><strong>Kode Pos:</strong> {vendor.ZipCode}</p>
        <p><strong>Negara:</strong> {vendor.Country}</p>
        <p><strong>No. Telepon:</strong> {vendor.PhoneNumber}</p>
        <p><strong>Email:</strong> {vendor.Email}</p>
        <p><strong>Website:</strong> {vendor.Website}</p>
        <p><strong>Kontak Person:</strong> {vendor.ContactPerson}</p>
        <p><strong>Barang/Jasa:</strong> {vendor.GoodsOrServices}</p>
        <p><strong>Metode Pembayaran:</strong> {vendor.PaymentMethod}</p>
        <p><strong>Ketentuan Pembayaran:</strong> {vendor.PaymentTerms}</p>
        <p><strong>NPWP:</strong> {vendor.NPWP}</p>
        <p><strong>Detail Bank:</strong> {vendor.BankDetails}</p>
        <p><strong>Catatan:</strong> {vendor.Notes}</p>
      </Modal>

      <Modal
        title="Edit Vendor"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null} 
      >
        <Form
          form={form}
          onFinish={handleUpdate}
          layout="vertical"
          initialValues={vendor}
          hideRequiredMark
        >
          <Form.Item label="Nama Vendor" name="VendorName" rules={[{ required: true, message: 'Nama vendor harus diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Alamat" name="Address" rules={[{ required: true, message: 'Alamat harus diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Kota" name="City" rules={[{ required: true, message: 'Kota harus diisi' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Provinsi" name="State">
            <Input />
          </Form.Item>
          <Form.Item label="Kode Pos" name="ZipCode">
            <Input />
          </Form.Item>
          <Form.Item label="Negara" name="Country">
            <Input />
          </Form.Item>
          <Form.Item label="No. Telepon" name="PhoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="Email">
            <Input />
          </Form.Item>
          <Form.Item label="Website" name="Website">
            <Input />
          </Form.Item>
          <Form.Item label="Kontak Person" name="ContactPerson">
            <Input />
          </Form.Item>
          <Form.Item label="Barang/Jasa" name="GoodsOrServices">
            <Input />
          </Form.Item>
          <Form.Item label="Metode Pembayaran" name="PaymentMethod">
            <Input />
          </Form.Item>
          <Form.Item label="Ketentuan Pembayaran" name="PaymentTerms">
            <Input />
          </Form.Item>
          <Form.Item label="NPWP" name="NPWP">
            <Input />
          </Form.Item>
          <Form.Item label="Detail Bank" name="BankDetails">
            <Input />
          </Form.Item>
          <Form.Item label="Catatan" name="Notes">
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Simpan</Button>
            <Button onClick={() => setIsEditModalVisible(false)} style={{ marginLeft: 8 }}>Batal</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profiles;
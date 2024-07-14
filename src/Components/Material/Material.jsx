import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Form, InputNumber } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import './Material.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import numeral from 'numeral';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaterialName: '',
    Description: '',
    Unit: '',
    Price: '',
    Quantity: ''
  });
  const [editMaterialId, setEditMaterialId] = useState(null);
  const { vendorId } = useParams();
  const [form] = Form.useForm();

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/vendors/get-materials/${vendorId}`);
      console.log("API Response:", response.data);
      if (response.data.success) {
        setMaterials(response.data.materials);
      } else {
        console.error("Failed to fetch materials:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchMaterials();
    }
  }, [vendorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editMaterialId) {
        await axios.put(`http://localhost:5000/vendors/edit-material/${editMaterialId}`, formData);
      } else {
        await axios.post('http://localhost:5000/vendors/add-materials', {
          VendorId: vendorId,
          ...formData
        });
      }
      console.log("Material saved");
      fetchMaterials();
      setFormData({
        MaterialName: '',
        Description: '',
        Unit: '',
        Price: '',
        Quantity: ''
      });
      setEditMaterialId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const handleEdit = (materialId, materialData) => {
    setFormData(materialData);
    setEditMaterialId(materialId);
    setShowForm(true);
  };


  const columns = [
    {
      title: 'Material Name',
      dataIndex: 'MaterialName',
      key: 'MaterialName'
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description'
    },
    {
      title: 'Unit',
      dataIndex: 'Unit',
      key: 'Unit'
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price'
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <span 
            className="edit-action"
            onClick={() => handleEdit(record.VendorMaterialId, record)}
          >
            Edit
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="material-container">
      <h2 className="material-title">Vendor Materials</h2>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => setShowForm(true)}
        style={{ marginBottom: 20 }}
      >
        Add Material
      </Button>
      <Modal
        title={editMaterialId ? 'Edit Material' : 'Add Material'}
        visible={showForm}
        onCancel={() => setShowForm(false)}
        onOk={form.submit}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={formData}
          layout="vertical"
        >
          <Form.Item
            name="MaterialName"
            label="Material Name"
            rules={[{ required: true, message: 'Please input the material name!' }]}
          >
            <Input name="MaterialName" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
            name="Description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input name="Description" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
            name="Unit"
            label="Unit"
            rules={[{ required: true, message: 'Please input the unit!' }]}
          >
            <Input name="Unit" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
            name="Price"
            label="Price"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <InputNumber
              name="Price"
              formatter={value => `Rp ${numeral(value).format('0,0')}`}
              parser={value => value.replace(/\Rp\s?|(,*)/g, '')}
              onChange={(value) => handleInputChange({ target: { name: 'Price', value } })}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="Quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please input the quantity!' }]}
          >
            <Input name="Quantity" onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={materials} rowKey="VendorMaterialId" />
    </div>
  );
}

export default Material;

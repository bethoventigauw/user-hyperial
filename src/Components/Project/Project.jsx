import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, DatePicker, Button, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';  // Import the PlusOutlined icon
import './Project.css';

const { TextArea } = Input;
const { Option } = Select;

const Project = () => {
  const [form] = Form.useForm();
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [projectManager, setProjectManager] = useState('');


  useEffect(() => {
    fetchAvailableMaterials();
  }, []);

  const fetchAvailableMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/allMaterials');
      setAvailableMaterials(response.data.materials);
    } catch (error) {
      console.error('Error fetching available materials:', error);
    }
  };

  const fetchProjectManager = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/authen/proyekManager', {
        headers: {
          'Authorization': token
        }
      });
      setProjectManager(response.data.Username);
      form.setFieldsValue({ projectManager: response.data.Username });
    } catch (error) {
      console.error('Error fetching project manager:', error);
      message.error('Error fetching project manager');
    }
  };
  
  useEffect(() => {
    fetchProjectManager();
  }, []);
  

  const handleSubmit = async (values) => {
    const token = localStorage.getItem('token');

    const validMaterials = values.materials.map(material => {
      const foundMaterial = availableMaterials.find(m => m.WarehouseMaterialID === parseInt(material.warehouseMaterialID));
      if (!foundMaterial) {
        console.error('Invalid material:', material);
        setErrorMessage('Invalid material selection. Please check the material list.');
        return null;
      }
      return {
        warehouseMaterialID: material.warehouseMaterialID,
        quantity: material.quantity,
        materialName: foundMaterial.MaterialName
      };
    }).filter(material => material !== null);

    if (validMaterials.length !== values.materials.length) {
      return;
    }

    const payload = {
      ...values,
      materials: validMaterials
    };

    try {
      const response = await axios.post('http://localhost:5000/ProjectManager/addProjectWithMaterials', payload, {
        headers: {
          'Authorization': token
        }
      });
      console.log('Project created successfully:', response.data);
      form.resetFields();
      setErrorMessage('');
    } catch (error) {
      console.error('Error creating project with materials:', error);
      setErrorMessage('Error creating project. Please try again.');
    }
  };

  return (
    <div className="project">
      <h1>Create New Project</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Project Name" name="nama_project" rules={[{ required: true, message: 'Please enter the project name' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item label="Project Manager" name="projectManager" initialValue={projectManager}>
          <Input disabled />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter the location' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please select the start date' }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: 'Please enter the project name' }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter the project name' }]}>
          <TextArea rows={4} />
        </Form.Item>

        <h2>Materials</h2>
        <Form.List name="materials">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} className="material-item">
                  <Form.Item
                    {...restField}
                    label="Material"
                    name={[name, 'warehouseMaterialID']}
                    fieldKey={[fieldKey, 'warehouseMaterialID']}
                    rules={[{ required: true, message: 'Please select a material' }]}
                  >
                    <Select placeholder="Select Material">
                      {availableMaterials.map((availableMaterial) => (
                        <Option key={availableMaterial.WarehouseMaterialID} value={availableMaterial.WarehouseMaterialID}>
                          {availableMaterial.MaterialName} (Available: {availableMaterial.Quantity})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Quantity"
                    name={[name, 'quantity']}
                    fieldKey={[fieldKey, 'quantity']}
                    rules={[{ required: true, message: 'Please enter the quantity' }]}
                  >
                    <Input type="number" />
                  </Form.Item>

                  <Button type="link" onClick={() => remove(name)} className="remove-material-button">
                    Remove
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Another Material
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Project
          </Button>
        </Form.Item>
      </Form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Project;

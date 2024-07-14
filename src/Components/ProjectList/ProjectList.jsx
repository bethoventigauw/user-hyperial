import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Tooltip, Select, Input, Progress } from 'antd';
import { PlusCircleOutlined, CheckCircleOutlined, MoreOutlined } from '@ant-design/icons';
import './ProjectList.css';

const { Option } = Select;

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newMaterials, setNewMaterials] = useState([{ warehouseMaterialID: '', quantity: '' }]);
  const [isAddMaterialModalVisible, setIsAddMaterialModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchAvailableMaterials();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/ProjectManager/getProjects', {
        headers: {
          'Authorization': token
        }
      });
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const fetchAvailableMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/allMaterials');
      setAvailableMaterials(response.data.materials);
    } catch (error) {
      console.error('Error fetching available materials:', error);
    }
  };

  const handleMaterialChange = (index, e) => {
    const newMaterialsCopy = [...newMaterials];
    newMaterialsCopy[index] = {
      ...newMaterialsCopy[index],
      [e.target.name]: e.target.value
    };
    setNewMaterials(newMaterialsCopy);
  };

  const addMaterial = () => {
    setNewMaterials([...newMaterials, { warehouseMaterialID: '', quantity: '' }]);
  };

  const handleAddMaterials = async (projectID) => {
    const token = localStorage.getItem('token');
    const validMaterials = newMaterials.map(material => {
      const foundMaterial = availableMaterials.find(m => m.WarehouseMaterialID === parseInt(material.warehouseMaterialID));
      if (!foundMaterial) {
        console.error('Invalid material:', material);
        return null;
      }
      return {
        warehouseMaterialID: material.warehouseMaterialID,
        quantity: material.quantity,
        materialName: foundMaterial.MaterialName
      };
    }).filter(material => material !== null);

    if (validMaterials.length !== newMaterials.length) {
      return;
    }

    const payload = {
      materials: validMaterials
    };

    try {
      await axios.post(`http://localhost:5000/ProjectManager/addAdditionalMaterial/${projectID}`, payload, {
        headers: {
          'Authorization': token
        }
      });
      fetchProjects();
      setSelectedProject(null);
      setIsAddMaterialModalVisible(false);
    } catch (error) {
      console.error('Error adding additional materials:', error);
    }
  };

  const completeProject = async (projectID) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:5000/ProjectManager/completeProject/${projectID}`, {}, {
        headers: {
          'Authorization': token
        }
      });
      console.log('Project marked as completed:', response.data);
      fetchProjects();
    } catch (error) {
      console.error('Error marking project as completed:', error);
    }
  };

  const showAddMaterialModal = (project) => {
    setSelectedProject(project);
    setIsAddMaterialModalVisible(true);
  };

  const getProgressStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 10;
      case 'In Progress':
        return 50;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'In Progress':
        return 'darkblue';
      case 'Completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  const showDetailModal = (project) => {
    setSelectedProject(project);
    setIsDetailModalVisible(true);
  };

  const showConfirmCompleteProject = (projectID) => {
    Modal.confirm({
      title: 'Confirm Completion',
      content: 'Are you sure you want to mark this project as complete?',
      onOk() {
        completeProject(projectID);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'nama_project',
      key: 'nama_project',
      render: (text) => <div className="project-name-column">{text}</div>,
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div className="progress-container">
          <Progress
            percent={getProgressStatus(status)}
            strokeColor={getProgressColor(status)}
            showInfo={false}
          />
          <span className="progress-text">{status}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Tooltip title="Project Details">
            <Button
              type="link"
              icon={<MoreOutlined style={{ fontSize: '20px', color: 'blue' }} />}
              onClick={() => showDetailModal(record)}
            />
          </Tooltip>
          {record.status === 'In Progress' && (
            <>
              <Tooltip title="Add Materials">
                <Button
                  type="link"
                  icon={<PlusCircleOutlined style={{ fontSize: '20px', color: 'orange' }} />}
                  onClick={() => showAddMaterialModal(record)}
                />
              </Tooltip>
              <Tooltip title="Complete Project">
                <Button
                  type="link"
                  icon={<CheckCircleOutlined style={{ fontSize: '20px', color: 'green' }} />}
                  onClick={() => showConfirmCompleteProject(record.projectID)}
                />
              </Tooltip>
            </>
          )}
        </>
      ),
    },
    {
      title: 'New Update',
      key: 'newUpdate',
      render: (text, record) => {
        const pendingMaterials = record.MaterialProyeks.filter(material => !material.approved);
        return (
          <ul className="new-materials-list">
            {pendingMaterials.map(material => (
              <li key={material.materialProyekID} className="new-material-item">
                {material.materialName} - {material.quantity} (New Material)
              </li>
            ))}
          </ul>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-list">
      <h1>Project List</h1>
      <Table dataSource={projects} columns={columns} rowKey="projectID" />
      <Modal
        title="Add Additional Materials"
        visible={isAddMaterialModalVisible}
        onCancel={() => setIsAddMaterialModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddMaterialModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleAddMaterials(selectedProject.projectID)}>
            Submit Materials
          </Button>,
        ]}
      >
        {selectedProject && (
          <>
            {newMaterials.map((material, index) => (
              <div key={index} className="material-item">
                <label>Material:</label>
                <Select
                  name="warehouseMaterialID"
                  value={material.warehouseMaterialID}
                  onChange={(value) => handleMaterialChange(index, { target: { name: 'warehouseMaterialID', value } })}
                  style={{ width: '60%' }}
                >
                  <Option value="">Select Material</Option>
                  {availableMaterials.map((availableMaterial) => (
                    <Option key={availableMaterial.WarehouseMaterialID} value={availableMaterial.WarehouseMaterialID}>
                      {availableMaterial.MaterialName} (Available: {availableMaterial.Quantity})
                    </Option>
                  ))}
                </Select>
                <label>Quantity:</label>
                <Input
                  type="number"
                  name="quantity"
                  value={material.quantity}
                  onChange={(e) => handleMaterialChange(index, e)}
                  style={{ width: '30%' }}
                />
              </div>
            ))}
            <Button onClick={addMaterial}>Add Another Material</Button>
          </>
        )}
      </Modal>
      <Modal
        title="Project Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedProject && (
          <div className="project-details">
            <p><strong>Project Name:</strong> {selectedProject.nama_project}</p>
            <p><strong>Project Manager:</strong> {selectedProject.projectManager}</p>
            <p><strong>Description:</strong> {selectedProject.description}</p>
            <p><strong>Progress:</strong></p>
            <Progress percent={getProgressStatus(selectedProject.status)} strokeColor={getProgressColor(selectedProject.status)} />
            <p><strong>Materials:</strong></p>
            <ul className="materials-list">
              {selectedProject.MaterialProyeks.filter(material => material.approved).map((material) => (
                <li key={material.materialProyekID} className="material-item">
                  {material.materialName} - {material.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectList;

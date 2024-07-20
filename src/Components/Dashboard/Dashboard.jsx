import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, message, Tag } from 'antd';
import './Dashboard.css';

const Dashboard = () => {
  const { vendorId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!vendorId) {
        console.error('Vendor ID is undefined');
        message.error('Vendor ID tidak tersedia.');
        return;
      }

      try {
        const response = await axios.get(`https://backend.hyperial.my.id/order/notifications/${vendorId}`);
        const groupedNotifications = groupNotificationsByOrderID(response.data.notifications);
        setNotifications(groupedNotifications);
      } catch (error) {
        console.error('Error fetching notifications', error);
        message.error(error.response ? error.response.data.message : 'Gagal mengambil notifikasi.');
      }
    };

    fetchNotifications();
  }, [vendorId]);

  const groupNotificationsByOrderID = (notifications) => {
    const grouped = notifications.reduce((acc, notification) => {
      const { OrderID } = notification;
      if (!acc[OrderID]) {
        acc[OrderID] = { ...notification, materials: [] };
      }
      acc[OrderID].materials.push(notification);
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`https://backend.hyperial.my.id/order/orderDetails/${orderId}`);
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        [orderId]: response.data.orderDetails
      }));
    } catch (error) {
      console.error('Error fetching order details', error);
      message.error(error.response ? error.response.data.message : 'Gagal mengambil detail order.');
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      const response = await axios.post(`https://backend.hyperial.my.id/order/notifications/${orderId}/deliver`);
      message.success(response.data.message);
      // Update notifikasi setelah delivery
      setNotifications(notifications.map(n => n.OrderID === orderId ? { ...n, Shipping: 'Delivered' } : n));
    } catch (error) {
      console.error('Error delivering order', error);
      message.error(error.response ? error.response.data.message : 'Gagal mengirim order.');
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderID',
      key: 'OrderID',
      render: (text, record) => (
        <>
          {text}
          <Button type="link" onClick={() => fetchOrderDetails(record.OrderID)}>Lihat Detail</Button>
          {orderDetails[record.OrderID] && (
            <ul>
              {orderDetails[record.OrderID].map((detail) => (
                <li key={detail.OrderLineID}>
                  {detail.VendorMaterial.MaterialName}: {detail.Quantity}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    },
    {
      title: 'Shipping',
      dataIndex: 'Shipping',
      key: 'Shipping',
      render: (text) => (
        <Tag color={text === 'Delivered' ? 'blue' : text === 'Pending' ? 'orange' : 'gray'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (text, record) => (
        record.Shipping === 'Pending' ? (
          <Button type="primary" onClick={() => handleDeliver(record.OrderID)}>Deliver</Button>
        ) : null
      ),
    },
  ];

  return (
    <div className="vendor-dashboard">
      <h2>Order Notifications</h2>
      <Table
        columns={columns}
        dataSource={notifications}
        rowKey="NotificationID"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Dashboard;

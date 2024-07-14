// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './Dashboard.css';

// const Dashboard = () => {
//   const { vendorId } = useParams(); // Mendapatkan vendorId dari URL
//   const [notifications, setNotifications] = useState([]);
//   const [message, setMessage] = useState('');
//   const [orderDetails, setOrderDetails] = useState({});

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!vendorId) {
//         console.error('Vendor ID is undefined');
//         setMessage('Vendor ID tidak tersedia.');
//         return;
//       }

//       try {
//         console.log('Fetching notifications for vendorId:', vendorId); // Logging vendorId
//         const response = await axios.get(`http://localhost:5000/order/notifications/${vendorId}`);
//         setNotifications(response.data.notifications);
//       } catch (error) {
//         console.error('Error fetching notifications', error);
//         setMessage(error.response ? error.response.data.message : 'Gagal mengambil notifikasi.');
//       }
//     };

//     fetchNotifications();
//   }, [vendorId]);

//   const fetchOrderDetails = async (orderId) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/order/orderDetails/${orderId}`);
//       setOrderDetails((prevDetails) => ({
//         ...prevDetails,
//         [orderId]: response.data.orderDetails
//       }));
//     } catch (error) {
//       console.error('Error fetching order details', error);
//       setMessage(error.response ? error.response.data.message : 'Gagal mengambil detail order.');
//     }
//   };

//   const handleDeliver = async (orderId) => {
//     try {
//       const response = await axios.post(`http://localhost:5000/order/notifications/${orderId}/deliver`);
//       setMessage(response.data.message);
//       // Update notifikasi setelah delivery
//       setNotifications(notifications.map(n => n.OrderID === orderId ? { ...n, Shipping: 'Delivered' } : n));
//     } catch (error) {
//       console.error('Error delivering order', error);
//       setMessage(error.response ? error.response.data.message : 'Gagal mengirim order.');
//     }
//   };

//   const uniqueOrderIds = new Set(); // Untuk melacak OrderID unik

//   return (
//     <div className="vendor-dashboard">
//       <h2>Dashboard Vendor</h2>
//       {message && <p>{message}</p>}
//       {notifications.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Shipping</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {notifications.map((notification) => {
//               if (uniqueOrderIds.has(notification.OrderID)) {
//                 return null; // Jika OrderID sudah ada, lewati render
//               }
//               uniqueOrderIds.add(notification.OrderID);
//               return (
//                 <React.Fragment key={notification.NotificationID}>
//                   <tr>
//                     <td>
//                       {notification.OrderID}
//                       <button onClick={() => fetchOrderDetails(notification.OrderID)}>Lihat Detail</button>
//                     </td>
//                     <td>{notification.Shipping}</td>
//                     <td>
//                       {notification.Shipping === 'Pending' && (
//                         <button onClick={() => handleDeliver(notification.OrderID)}>Deliver</button>
//                       )}
//                     </td>
//                   </tr>
//                   {orderDetails[notification.OrderID] && (
//                     <tr>
//                       <td colSpan="3">
//                         <ul>
//                           {orderDetails[notification.OrderID].map((detail) => (
//                             <li key={detail.OrderLineID}>
//                               {detail.VendorMaterial.MaterialName}: {detail.Quantity}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       ) : (
//         <p>Belum ada notifikasi.</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, message } from 'antd';
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
        const response = await axios.get(`http://localhost:5000/order/notifications/${vendorId}`);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications', error);
        message.error(error.response ? error.response.data.message : 'Gagal mengambil notifikasi.');
      }
    };

    fetchNotifications();
  }, [vendorId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/order/orderDetails/${orderId}`);
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
      const response = await axios.post(`http://localhost:5000/order/notifications/${orderId}/deliver`);
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
      <h2>Dashboard Vendor</h2>
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

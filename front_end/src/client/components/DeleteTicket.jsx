import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { db, doc, deleteDoc } from '../../server/config/FireBase'; // Đảm bảo đường dẫn đến Firebase config là đúng

const { confirm } = Modal;

const DeleteTicket = ({ ticketId, onTicketDeleted }) => {
  const [loading, setLoading] = useState(false);

  const showDeleteConfirm = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn hủy vé này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác!',
      okText: 'HủyHủy',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        setLoading(true);
        try {
          const ticketDocRef = doc(db, 'ticketData', ticketId); // 'ticketData' là tên collection vé của bạn
          await deleteDoc(ticketDocRef);
          message.success('Vé đã được hủy thành công!');
          if (onTicketDeleted) {
            onTicketDeleted(ticketId); // Gọi callback để thông báo cho component cha
          }
        } catch (error) {
          console.error('Lỗi khi hủy vé:', error);
          message.error('Đã xảy ra lỗi khi hủy vé. Vui lòng thử lại sau.');
        } finally {
          setLoading(false);
        }
      },
      onCancel() {
        console.log('Hủy');
      },
    });
  };

  if (!ticketId) {
    return null; // Hoặc hiển thị thông báo lỗi nếu không có ticketId
  }

  return (
    <Button
      type="danger"
      onClick={showDeleteConfirm}
      loading={loading}
      className="mt-4 bg-red-500 border-none"
    >
      Hủy Vé
    </Button>
  );
};

export default DeleteTicket;
import { useState, useEffect } from 'react';
import { Input, Button, Form, message } from 'antd';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../server/config/FireBase';

export default function EditProfile({ userID, onProfileUpdated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const docRef = doc(db, 'userProfiles', userID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        form.setFieldsValue(docSnap.data());
      }
    };
    fetchUserProfile();
  }, [userID, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'userProfiles', userID), values);
      message.success('Cập nhật thông tin thành công!');
      onProfileUpdated(); // gọi lại profile sau khi cập nhật
    } catch (error) {
      console.error('Update failed:', error);
      message.error('Đã xảy ra lỗi khi cập nhật!');
    }
    setLoading(false);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phone">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu thay đổi
      </Button>
    </Form>
  );
}

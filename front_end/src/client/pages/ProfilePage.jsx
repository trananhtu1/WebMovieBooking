import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button, Card, Divider, Tabs } from "antd";
import { MailOutlined, PhoneOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { db, collection, getDocs, query, where } from '../../server/config/FireBase';// Import Firebase functions
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import EditProfile from "../components/EditProfile";
import { Modal } from "antd";
import DeleteTicket from "../components/DeleteTicket";
import defaultAvt from '../../assets/images/fullStar.png';

export default function ProfilePage() {
  const [activeTickets, setActiveTickets] = useState([]);
  const [pastTickets, setPastTickets] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const auth = getAuth();
  const userID = auth.currentUser?.uid;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Lấy user info từ Firebase khi vào trang
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userID) {
        const docRef = doc(db, 'userProfiles', userID); // Sửa lỗi chính tả: userProfile
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
          } else {
            console.log("Không tìm thấy thông tin người dùng!");
            setUserInfo(null);
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setUserInfo(null);
        }
      }
    };
    if (userID) fetchUserInfo();
  }, [userID]);

  const handleTicketDeleted = (deletedTicketId) => {
    setActiveTickets(prevTickets => prevTickets.filter(ticket => ticket.orderId !== deletedTicketId && ticket.id !== deletedTicketId));
    setPastTickets(prevTickets => prevTickets.filter(ticket => ticket.orderId !== deletedTicketId && ticket.id !== deletedTicketId));
  };

  // Fetch data from Firestore
  useEffect(() => {
    const fetchTickets = async () => {
      if (userID) {
        const ticketsCollection = collection(db, "ticketData");
        const q = query(ticketsCollection, where("userId", "==", userID)); // Giả sử 'userId' là trường liên kết vé với người dùng
        try {
          const snapshot = await getDocs(q);
          const allTickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Lấy cả ID của document
          const currentDate = new Date();

          const active = allTickets.filter(ticket => new Date(ticket.date) > currentDate);
          const past = allTickets.filter(ticket => new Date(ticket.date) <= currentDate);

          setActiveTickets(active);
          setPastTickets(past);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách vé:", error);
        }
      } else {
        setActiveTickets([]);
        setPastTickets([]);
      }
    };

    fetchTickets();
  }, [userID]);

  return (
    <div className="container mx-auto py-8 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-400 min-h-screen">
      <Header />
      <Button type="link" className="mt-12 mb-4 text-gray-800 dark:text-yellow-400" icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>Quay Lại</Button>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-yellow-400">Hồ Sơ Của {userInfo?.name} </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card className="md:col-span-1 bg-yellow-100 border-yellow-200 text-gray-900 dark:text-yellow-400" title={<span className="text-blue-900">Thông tin cá nhân</span>}>
          <div className="flex flex-col items-center mb-6">
            <Avatar size={96} src={defaultAvt} />
            <h2 className="text-xl font-bold mt-2" >{userInfo?.name || "Đang tải..."}</h2> {/* Sử dụng optional chaining */}
            <Badge status="success" text="Premium Member" />
          </div>

          <Divider className="border-blue-300" />

          {userInfo ? (
            <>
              <p>Email: {userInfo.email}</p>
              <p>Phone: {userInfo.phone}</p>
              {userInfo.memberSince && <p>Member Since: {userInfo.memberSince}</p>}
              {userInfo.loyaltyPoints !== undefined && <p>Điểm thưởng: {userInfo.loyaltyPoints}</p>}

              <Divider />
            </>
          ) : (
            <p>Đang tải thông tin...</p>
          )}
          
          <Divider className="border-blue-300" />

          {userInfo?.loyaltyPoints !== undefined && (
            <div className="flex justify-between">
              <span>Loyalty Points</span>
              <span className="font-bold">{userInfo.loyaltyPoints} points</span>
            </div>
          )}

          <Button
            type="primary"
            block
            className="mt-4 bg-yellow-600 border-none"
            onClick={() => setIsEditModalVisible(true)}
          >
            Cập Nhật Thông Tin
          </Button>
          <Modal
            title="Edit Profile"
            open={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
            centered
            destroyOnClose
          >
            <EditProfile
              userID={userID}
              onProfileUpdated={() => {
                setIsEditModalVisible(false);
                // Có thể gọi lại fetchUserInfo() ở đây nếu bạn muốn load lại thông tin ngay lập tức
                fetchUserInfo();
              }}
            />
          </Modal>
        </Card>

        {/* Purchased Tickets Section */}
        <div className="md:col-span-2">
          <Tabs defaultActiveKey="1" className="bg-yellow-100 border-yellow-200 p-4 rounded-lg">
            <Tabs.TabPane tab={<span className="text-gray-900 dark:text-yellow-400">Vé Hiện Tại</span>} key="1">
              {activeTickets.map(ticket => (
                <TicketCard
                  key={ticket.id || ticket.orderId} // Sử dụng cả id (từ snapshot) và orderId (nếu có) làm key
                  ticket={ticket}
                  onTicketDeleted={handleTicketDeleted}
                />
              ))}
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span className="text-gray-900 dark:text-yellow-400">Vé Đã Hết Hạn</span>} key="2">
              {pastTickets.map(ticket => (
                <TicketCard
                  key={ticket.id || ticket.orderId} // Sử dụng cả id (từ snapshot) và orderId (nếu có) làm key
                  ticket={ticket}
                  onTicketDeleted={handleTicketDeleted}
                  isPast
                />
              ))}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, isPast = false, onTicketDeleted }) {
  return (
    <Card title={<span className="text-gray-900 dark:text-yellow-400">{ticket.movieTitle}</span>} className={`bg-yellow-100 border-yellow-200 text-blue-900 ${isPast ? "opacity-80" : ""}`}>
      <p><CalendarOutlined /> {ticket.date} at {ticket.time}</p>
      <p><UserOutlined /> Cinema: {ticket.cinema}</p>
      <p>Hall: {ticket.hall || ticket.roomID}</p> {/* Sử dụng hall hoặc roomID nếu có */}
      <p>Seats: {ticket.seatNumbers?.join(", ") || "N/A"}</p> {/* Kiểm tra seatNumbers có tồn tại không */}
      <p>Price: {ticket.amount}</p>
      {!isPast ? (
        <DeleteTicket ticketId={ticket.id || ticket.orderId} onTicketDeleted={onTicketDeleted} />
      ) : (
        <Button type="default" className="bg-yellow-600 border-none text-gray-900">View Receipt</Button>
      )}
    </Card>
  );
}
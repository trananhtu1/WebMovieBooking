import { Avatar, Badge, Button, Card, Divider, Tabs } from "antd";
import { MailOutlined, PhoneOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Header from "../components/Header";


export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 bg-white text-blue-900 min-h-screen">
      <Header/>
      <Button type="link" className="mt-12 mb-4 text-blue-600" icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>Back</Button>
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card className="md:col-span-1 bg-blue-100 border-blue-300 text-blue-900" title={<span className="text-blue-900">User Information</span>}>
          <div className="flex flex-col items-center mb-6">
            <Avatar size={96} src="/placeholder.svg?height=96&width=96" />
            <h2 className="text-xl font-bold mt-2">Nguyễn Văn A</h2>
            <Badge status="success" text="Premium Member" />
          </div>

          <Divider className="border-blue-300" />

          <div className="space-y-4">
            <p><UserOutlined /> Account ID: <strong>USER12345</strong></p>
            <p><MailOutlined /> Email: <strong>nguyenvana@example.com</strong></p>
            <p><PhoneOutlined /> Phone: <strong>+84 123 456 789</strong></p>
            <p><CalendarOutlined /> Member Since: <strong>January 15, 2023</strong></p>
          </div>

          <Divider className="border-blue-300" />

          <div className="flex justify-between">
            <span>Loyalty Points</span>
            <span className="font-bold">250 points</span>
          </div>

          <Button type="primary" block className="mt-4 bg-blue-600 border-none">Edit Profile</Button>
        </Card>

        {/* Purchased Tickets Section */}
        <div className="md:col-span-2">
          <Tabs defaultActiveKey="1" className="bg-blue-100 p-4 rounded-lg">
            <Tabs.TabPane tab={<span className="text-blue-900">Active Tickets</span>} key="1">
              <TicketCard title="Dune: Part Two" date="March 25, 2024" time="7:30 PM" cinema="Beta Cinema - Thảo Điền" hall="Hall 3" seats={["G12", "G13"]} price="320,000 VND" />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span className="text-blue-900">Past Tickets</span>} key="2">
              <TicketCard title="The Batman" date="March 15, 2024" time="8:00 PM" cinema="Beta Cinema - Thảo Điền" hall="Hall 2" seats={["F8", "F9", "F10"]} price="300,000 VND" isPast />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ title, date, time, cinema, hall, seats, price, isPast = false }) {
  return (
    <Card title={<span className="text-blue-900">{title}</span>} className={`bg-blue-100 border-blue-300 text-blue-900 ${isPast ? "opacity-80" : ""}`}>
      <p><CalendarOutlined /> {date} at {time}</p>
      <p><UserOutlined /> Cinema: {cinema}</p>
      <p>Hall: {hall}</p>
      <p>Seats: {seats.join(", ")}</p>
      <p>Price: {price}</p>
      {isPast ? (
        <Button type="default" className="bg-blue-400 border-none text-white">View Receipt</Button>
      ) : (
        <Button type="danger" className="bg-red-600 border-none">Cancel Booking</Button>
      )}
    </Card>
  );
}
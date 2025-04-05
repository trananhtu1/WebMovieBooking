import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "antd";
import { Button, Dropdown, Menu } from "antd";
import { UseAuth } from '../../client/hook/UseAuth';

export function Profile() {
  const navigate = useNavigate();
  const { logout } = UseAuth();

    const handleLogout = async () => {
      try {
        await logout(navigate);
        navigate('/welcome');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        <User className="mr-2 h-6 w-6" /> Profile
      </Menu.Item>
      <Menu.Item key="tickets" onClick={() => navigate("/profile/tickets")}>
        <CreditCard className="mr-2 h-6 w-6" /> My Tickets
      </Menu.Item>
      <Menu.Item key="settings" onClick={() => navigate("/profile/settings")}>
        <Settings className="mr-2 h-6 w-6" /> Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogOut className="mr-2 h-6 w-6" /> Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <Button shape="circle" className="relative h-8 w-8 rounded-full">
        <Avatar src="/placeholder.svg?height=32&width=32" alt="@user" size={32} />
      </Button>
    </Dropdown>
  );
}

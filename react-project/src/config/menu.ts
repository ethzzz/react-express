import { UploadOutlined, UserOutlined, VideoCameraOutlined, RobotFilled } from '@ant-design/icons';
import React from 'react';

const menuItems = [
  {
    key: '/home',
    icon: React.createElement(UserOutlined),
    label: '主页',
    name: 'Home',
  },
  {
    key: '/test',
    icon: React.createElement(VideoCameraOutlined),
    label: '测试',
    name: 'Test',
  },
  {
    key: '/game',
    icon: React.createElement(RobotFilled),
    label: '游戏',
    name: 'Game',
  },
  {
    // key: '/websocket',
    key: '/websocket',
    icon: React.createElement(RobotFilled),
    label: 'WebSocket',
    name: 'WebSocket',
    children: [
      {
        key: '/websocket-item',
        icon: React.createElement(RobotFilled),
        label: 'WebSocket',
        name: 'WebSocket',
      },
      {
        key: '/chatroom',
        icon: React.createElement(RobotFilled),
        label: '聊天室',
        name: 'chatroom',
      }
    ]
  },
  {
    key: "/upload-file",
    icon: React.createElement(UploadOutlined),
    label: "上传",
    name: "Upload",
  },
  {
    key: '/system',
    icon: React.createElement(RobotFilled),
    label: '系统配置',
    name: 'System',
    children: [
      {
        key: '/system/role',
        icon: React.createElement(RobotFilled),
        label: '角色',
        name: 'Role',
      }
    ]
  }
]

export default menuItems
// pages/MRDashboard/Notifications.jsx
import React, { useState } from 'react';
import {
  Card,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Container,
  Separator,
  Tabs,
  Switch,
  Dialog
} from '@radix-ui/themes';
import {
  BellIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  PaperPlaneIcon,
  EyeOpenIcon,
  TrashIcon,
  CheckIcon,
  GearIcon,
  ArchiveIcon,
  EnvelopeClosedIcon
} from '@radix-ui/react-icons';
import Navigation from '../../components/Navigation';
import './Notifications.css';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'submission',
      title: 'Weekly Progress Report submitted',
      description: 'Ethio Telecom Network Upgrade submitted their weekly progress report',
      project: 'Ethio Telecom Network Upgrade',
      projectId: '1',
      timestamp: '2024-01-15T10:30:00',
      read: false,
      important: true
    },
    {
      id: 2,
      type: 'overdue',
      title: 'Site Inspection Form overdue',
      description: 'Addis Ababa Smart City has not submitted the site inspection form',
      project: 'Addis Ababa Smart City',
      projectId: '2',
      timestamp: '2024-01-14T14:20:00',
      read: false,
      important: true
    },
    {
      id: 3,
      type: 'pending',
      title: 'Material Delivery Checklist pending',
      description: 'OMO II Hydroelectric has pending submissions for material delivery',
      project: 'OMO II Hydroelectric',
      projectId: '3',
      timestamp: '2024-01-15T09:15:00',
      read: true,
      important: false
    },
    {
      id: 4,
      type: 'submission',
      title: 'Quality Assurance Form submitted',
      description: 'Hawassa Textile Factory submitted quality assurance form',
      project: 'Hawassa Textile Factory',
      projectId: '5',
      timestamp: '2024-01-13T16:45:00',
      read: true,
      important: false
    },
    {
      id: 5,
      type: 'overdue',
      title: 'Safety Compliance Report overdue',
      description: 'Dire Dawa Industrial Park has overdue safety compliance report',
      project: 'Dire Dawa Industrial Park',
      projectId: '4',
      timestamp: '2024-01-12T11:20:00',
      read: false,
      important: true
    },
    {
      id: 6,
      type: 'pending',
      title: 'Weekly Progress Report pending',
      description: 'Bahir Dar University Expansion has pending weekly report',
      project: 'Bahir Dar University Expansion',
      projectId: '6',
      timestamp: '2024-01-15T08:45:00',
      read: true,
      important: false
    },
    {
      id: 7,
      type: 'submission',
      title: 'Equipment Maintenance Log submitted',
      description: 'Gondar Hospital Construction submitted equipment maintenance log',
      project: 'Gondar Hospital Construction',
      projectId: '8',
      timestamp: '2024-01-14T13:30:00',
      read: true,
      important: false
    },
    {
      id: 8,
      type: 'system',
      title: 'Form assignment successful',
      description: 'Site Inspection Form has been assigned to 3 projects',
      timestamp: '2024-01-13T10:15:00',
      read: true,
      important: false
    },
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    overdueAlerts: true,
    submissionAlerts: true,
    pendingReminders: true,
    weeklyDigest: false
  });

  const [showSettings, setShowSettings] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'important') return notification.important;
    if (activeTab === 'submissions') return notification.type === 'submission';
    if (activeTab === 'overdue') return notification.type === 'overdue';
    if (activeTab === 'pending') return notification.type === 'pending';
    return true;
  });

  // Mark as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter(notif => !notif.read));
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'submission':
        return <CheckCircledIcon className="icon submission" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="icon overdue" />;
      case 'pending':
        return <ClockIcon className="icon pending" />;
      case 'system':
        return <BellIcon className="icon system" />;
      default:
        return <BellIcon className="icon default" />;
    }
  };

  // Get notification type label
  const getNotificationType = (type) => {
    switch (type) {
      case 'submission': return 'Submission';
      case 'overdue': return 'Overdue';
      case 'pending': return 'Pending';
      case 'system': return 'System';
      default: return 'Notification';
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  // Statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    important: notifications.filter(n => n.important).length,
    submissions: notifications.filter(n => n.type === 'submission').length,
    overdue: notifications.filter(n => n.type === 'overdue').length,
    pending: notifications.filter(n => n.type === 'pending').length,
  };

  return (
    <Navigation>
      <Container size="3" className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <Flex align="center" gap="3">
            <div className="header-icon">
              <BellIcon />
            </div>
            <div>
              <Heading size="7">Notifications</Heading>
              <Text size="2" color="gray">Stay informed about form submissions and alerts</Text>
            </div>
          </Flex>
          
          <Flex gap="3">
            <Button 
              variant="soft"
              onClick={() => setShowSettings(true)}
            >
              <GearIcon /> Settings
            </Button>
            <Button 
              variant="soft"
              onClick={markAllAsRead}
              disabled={stats.unread === 0}
            >
              <CheckIcon /> Mark all as read
            </Button>
          </Flex>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <BellIcon />
                <Text size="2" color="gray">Total Notifications</Text>
              </Flex>
              <Heading size="6">{stats.total}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <EnvelopeClosedIcon />
                <Text size="2" color="gray">Unread</Text>
              </Flex>
              <Heading size="6" color="blue">{stats.unread}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <ExclamationTriangleIcon color="amber" />
                <Text size="2" color="gray">Important</Text>
              </Flex>
              <Heading size="6" color="amber">{stats.important}</Heading>
            </Flex>
          </Card>
          
          <Card className="stat-card">
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <PaperPlaneIcon />
                <Text size="2" color="gray">Submissions Today</Text>
              </Flex>
              <Heading size="6" color="green">{stats.submissions}</Heading>
            </Flex>
          </Card>
        </div>

        <Separator size="4" />

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="notifications-tabs">
          <Tabs.List>
            <Tabs.Trigger value="all">
              All ({stats.total})
            </Tabs.Trigger>
            <Tabs.Trigger value="unread">
              Unread ({stats.unread})
            </Tabs.Trigger>
            <Tabs.Trigger value="important">
              Important ({stats.important})
            </Tabs.Trigger>
            <Tabs.Trigger value="submissions">
              Submissions ({stats.submissions})
            </Tabs.Trigger>
            <Tabs.Trigger value="overdue">
              Overdue ({stats.overdue})
            </Tabs.Trigger>
            <Tabs.Trigger value="pending">
              Pending ({stats.pending})
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        {/* Notifications List */}
        <Card className="notifications-card">
          {filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.important ? 'important' : ''}`}
                >
                  <div className="notification-content">
                    <Flex gap="3">
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="notification-details">
                        <Flex justify="between" align="start">
                          <div>
                            <Text weight="medium">{notification.title}</Text>
                            <Text size="2" color="gray" mt="1">
                              {notification.description}
                            </Text>
                            {notification.project && (
                              <Badge variant="soft" className="project-badge" mt="2">
                                {notification.project}
                              </Badge>
                            )}
                          </div>
                          
                          <Flex gap="2" align="center">
                            <Text size="1" color="gray">
                              {formatTime(notification.timestamp)}
                            </Text>
                            <Badge variant="soft" className="type-badge">
                              {getNotificationType(notification.type)}
                            </Badge>
                          </Flex>
                        </Flex>
                      </div>
                    </Flex>
                    
                    <Flex gap="2" mt="3" className="notification-actions">
                      {!notification.read && (
                        <Button
                          size="1"
                          variant="soft"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckIcon /> Mark as read
                        </Button>
                      )}
                      
                      <Button
                        size="1"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <TrashIcon /> Delete
                      </Button>
                      
                      {notification.type === 'submission' && notification.project && (
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => {
                            console.log('View submission for:', notification.project);
                          }}
                        >
                          <EyeOpenIcon /> View
                        </Button>
                      )}
                      
                      {notification.type === 'overdue' && notification.project && (
                        <Button
                          size="1"
                          variant="ghost"
                          onClick={() => {
                            console.log('Send reminder for:', notification.project);
                          }}
                        >
                          <PaperPlaneIcon /> Send Reminder
                        </Button>
                      )}
                    </Flex>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-notifications">
              <BellIcon size="48" />
              <Heading size="4" mt="4">No notifications</Heading>
              <Text size="2" color="gray" mt="2">
                {activeTab === 'unread' 
                  ? 'All notifications are read' 
                  : activeTab === 'important'
                  ? 'No important notifications'
                  : 'No notifications found'}
              </Text>
            </div>
          )}
          
          {filteredNotifications.length > 0 && (
            <Flex justify="end" mt="4" pt="4" className="list-actions">
              <Button
                variant="soft"
                onClick={deleteAllRead}
                disabled={stats.unread === stats.total}
              >
                <ArchiveIcon /> Clear Read Notifications
              </Button>
            </Flex>
          )}
        </Card>

        {/* Alert Summary */}
        <Card className="alert-summary-card">
          <Heading size="4" mb="4">Alert Summary</Heading>
          <div className="alert-summary">
            <div className="alert-item overdue">
              <Flex align="center" justify="between">
                <Flex align="center" gap="3">
                  <ExclamationTriangleIcon />
                  <div>
                    <Text weight="medium">Overdue Forms</Text>
                    <Text size="2" color="gray">Forms past their deadline</Text>
                  </div>
                </Flex>
                <Badge color="red" variant="soft">
                  {stats.overdue} alerts
                </Badge>
              </Flex>
            </div>
            
            <div className="alert-item pending">
              <Flex align="center" justify="between">
                <Flex align="center" gap="3">
                  <ClockIcon />
                  <div>
                    <Text weight="medium">Pending Submissions</Text>
                    <Text size="2" color="gray">Forms awaiting submission</Text>
                  </div>
                </Flex>
                <Badge color="amber" variant="soft">
                  {stats.pending} alerts
                </Badge>
              </Flex>
            </div>
            
            <div className="alert-item submission">
              <Flex align="center" justify="between">
                <Flex align="center" gap="3">
                  <CheckCircledIcon />
                  <div>
                    <Text weight="medium">Recent Submissions</Text>
                    <Text size="2" color="gray">Forms submitted today</Text>
                  </div>
                </Flex>
                <Badge color="green" variant="soft">
                  {stats.submissions} alerts
                </Badge>
              </Flex>
            </div>
          </div>
        </Card>
      </Container>

      {/* Settings Dialog */}
      <Dialog.Root open={showSettings} onOpenChange={setShowSettings}>
        <Dialog.Content className="settings-dialog">
          <Dialog.Title>
            <Flex align="center" gap="2">
              <GearIcon />
              Notification Settings
            </Flex>
          </Dialog.Title>
          
          <Dialog.Description>
            <div className="settings-content">
              <Heading size="4" mb="4">Notification Preferences</Heading>
              
              <div className="settings-list">
                <div className="setting-item">
                  <Flex justify="between" align="center">
                    <div>
                      <Text weight="medium">Email Notifications</Text>
                      <Text size="2" color="gray">Receive notifications via email</Text>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        emailNotifications: checked
                      })}
                    />
                  </Flex>
                </div>
                
                <div className="setting-item">
                  <Flex justify="between" align="center">
                    <div>
                      <Text weight="medium">Push Notifications</Text>
                      <Text size="2" color="gray">Show desktop notifications</Text>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        pushNotifications: checked
                      })}
                    />
                  </Flex>
                </div>
                
                <Separator />
                
                <div className="setting-item">
                  <Flex justify="between" align="center">
                    <div>
                      <Text weight="medium">Overdue Alerts</Text>
                      <Text size="2" color="gray">Get notified about overdue forms</Text>
                    </div>
                    <Switch
                      checked={settings.overdueAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        overdueAlerts: checked
                      })}
                    />
                  </Flex>
                </div>
                
                <div className="setting-item">
                  <Flex justify="between" align="center">
                    <div>
                      <Text weight="medium">Submission Alerts</Text>
                      <Text size="2" color="gray">Notify when forms are submitted</Text>
                    </div>
                    <Switch
                      checked={settings.submissionAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        submissionAlerts: checked
                      })}
                    />
                  </Flex>
                </div>
                
                <div className="setting-item">
                  <Flex justify="between" align="center">
                    <div>
                      <Text weight="medium">Pending Reminders</Text>
                      <Text size="2" color="gray">Reminders for pending submissions</Text>
                    </div>
                    <Switch
                      checked={settings.pendingReminders}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        pendingReminders: checked
                      })}
                    />
                  </Flex>
                </div>
                
                <Separator />
                
                <div className="setting-item">
                  <Flex justify="between" align="center">
                    <div>
                      <Text weight="medium">Weekly Digest</Text>
                      <Text size="2" color="gray">Weekly summary of all activities</Text>
                    </div>
                    <Switch
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        weeklyDigest: checked
                      })}
                    />
                  </Flex>
                </div>
              </div>
              
              <Flex gap="3" mt="6" justify="end">
                <Dialog.Close>
                  <Button variant="soft">Cancel</Button>
                </Dialog.Close>
                <Button onClick={() => {
                  alert('Settings saved!');
                  setShowSettings(false);
                }}>
                  Save Settings
                </Button>
              </Flex>
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
    </Navigation>
  );
};

export default Notifications;
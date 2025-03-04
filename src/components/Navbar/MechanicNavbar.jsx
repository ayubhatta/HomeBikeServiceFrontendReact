import {
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

// AppBar Component
export const AppBarComponent = ({ handleDrawerToggle }) => (
  <MuiAppBar
    position='fixed'
    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <IconButton
        color='inherit'
        edge='start'
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}>
        <MenuIcon />
      </IconButton>
      <BuildIcon sx={{ mr: 1 }} />
      <Typography
        variant='h6'
        component='div'
        sx={{ flexGrow: 1 }}>
        Mechanic Dashboard
      </Typography>
    </Toolbar>
  </MuiAppBar>
);

// Sidebar Component (includes both permanent and mobile drawers)
export const SidebarComponent = ({ drawerOpen, handleDrawerClose }) => {
  const theme = useTheme();

  return (
    <>
      {/* Permanent Sidebar */}
      <Drawer
        variant='permanent'
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', mt: 8 },
        }}>
        <SidebarContent />
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant='temporary'
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}>
        <Toolbar />
        <SidebarContent onItemClick={handleDrawerClose} />
      </Drawer>
    </>
  );
};

// Shared content for both sidebars
export const SidebarContent = ({ onItemClick }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <List>
      <ListItem
        button
        selected
        onClick={onItemClick}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem
        button
        onClick={onItemClick}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary='Tasks' />
      </ListItem>
      <ListItem
        button
        onClick={onItemClick}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary='Profile' />
      </ListItem>
      <ListItem
        button
        onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary='Logout' />
      </ListItem>
    </List>
  );
};

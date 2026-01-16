/**
 * Main Layout Component
 * Wraps pages with header and footer using UI library layout
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout as UIMainLayout } from '@sakhlaqi/ui';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
  return (
    <UIMainLayout header={<Header />} footer={<Footer />}>
      <Outlet />
    </UIMainLayout>
  );
};

export default MainLayout;

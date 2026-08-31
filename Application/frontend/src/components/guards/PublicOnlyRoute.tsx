import React from 'react';

export interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  // Always render authentication screens (login/register) to allow users to sign in or register
  return <>{children}</>;
};

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /**
   * fullHeight: true  → fills the remaining viewport height (split-pane pages like LabExecution)
   * fullHeight: false → standard scrollable padded page (default)
   */
  fullHeight?: boolean;
}

/**
 * PageWrapper centralises the page-level padding & scroll behaviour.
 * All pages inside AppLayout must be wrapped in this instead of relying
 * on the layout's outer container.
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  fullHeight = false,
}) => {
  if (fullHeight) {
    return (
      <div className={`flex flex-col flex-1 h-full overflow-hidden ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`flex-1 overflow-y-auto px-4 py-6 lg:px-8 max-w-[1400px] w-full mx-auto pb-12 ${className}`}
    >
      {children}
    </div>
  );
};

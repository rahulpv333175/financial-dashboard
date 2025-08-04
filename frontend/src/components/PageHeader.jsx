import React from 'react';

const PageHeader = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
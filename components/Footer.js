import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 mt-8 text-center bg-gray-100">
      <div className="container mx-auto">
        <p className="text-sm text-gray-600">
          Created by{' '}
          <a
            href="https://www.pgappstudios.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            PG App Studios
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 
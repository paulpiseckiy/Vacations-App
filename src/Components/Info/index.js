import React from 'react';
import './index.css';

export const Sort = ({
  sortKey,
  onSort,
  className,
  children
}) => (
  <button 
    className={`${className} edit-btn`}
    onClick={() =>
      onSort(sortKey)
  }>
    {children}
  </button>
);

const Info = ({ 
  onSortEmp
}) => (
  <header>
    <div
      className="logo"
    >
      Vacations App
    </div>
    <nav>
      <Sort
        className="info-title"
        sortKey={'NAME'}
        onSort={onSortEmp}
      >
        Person:
      </Sort>
      <Sort
        className="info-title"
        sortKey={'POSITION'}
        onSort={onSortEmp}
      >
        Position:
      </Sort>
    </nav>
  </header>
);

export default Info;
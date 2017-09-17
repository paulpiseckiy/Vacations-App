import React from 'react';
import './index.css';

import List from './List';

import  { checkReversed } from '../../functions/checking';
import { EMPSORTS } from '../../functions/sorting';
import { Sort } from '../Info';


const Table = ({ 
  employees,
  onToggleEdit,
  onFinishEdit,
  onDelete, 
  onVacationAdd,
  onVacationRemove, 
  onToggleAddV, 
  sortEmpKey,
  sortVacKey,                 
  isEmpSortReverse,
  isVacSortReverse,
  onSortVac
}) => {
  const reverseSortedEmpList = checkReversed(
    sortEmpKey,
    employees,
    isEmpSortReverse, 
    EMPSORTS
  );

  return (
    <div>
    {
    reverseSortedEmpList.map(e => (
      <main 
        key={e.id}
        className="table-container"
      >
        <span className="table-text"
        >
          {e.person}
        </span>
        <span className="table-text"
        >
          {e.position}
        </span>
        <Sort
          className="table-vacations"
          sortKey={'DATE'}
          onSort={onSortVac}
        >
          Employee's vacations:
        </Sort>
        <List 
          sortVacKey={sortVacKey} 
          isVacSortReverse={isVacSortReverse}
          onFinishEdit={onFinishEdit}
          onToggleEdit={onToggleEdit}
          onVacationRemove={onVacationRemove}
          e={e} vacations={e.vacations}
        />
        {e.isAddingVac 
        ? <AddVacation 
            employee={e}
            onVacationAdd={onVacationAdd}
            onToggleAddV={onToggleAddV}
          />
        : <button 
            className="table-add-btn add-btn"
            onClick={() => 
              onToggleAddV(e.id)
          }>
            Add
          </button>
        }
        <button 
          className="table-del-btn"
          onClick={() =>
            onDelete(e.id)
        }>
          Delete Employee
        </button>
      </main>
    ))}
    </div>
  )
};

const AddVacation = ({
  employee,
  onVacationAdd,
  onToggleAddV
}) => {
  let from, to;

  return (
    <div className="table-vac-container">
      <label>
        <input type="date" 
          ref={node =>
          from = node
        }/>
        {` `}
        -
        {` `}
        <input type="date"
          ref={node =>
          to = node
        }/>
      </label>
      <button 
        className="list-vac-ok-btn add-btn"
        onClick={() => 
        onVacationAdd(
          employee.id,
          from.value,
          to.value
      )}>
        Ok
      </button>
      <button 
        className="list-vac-x-btn remove-btn"
        onClick={() => (
        onToggleAddV(
          employee.id
        ))
      }>
        X
      </button>
    </div>
  )
}


export default Table;
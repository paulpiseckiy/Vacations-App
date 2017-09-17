import React from 'react';
import moment from 'moment';
import './index.css';

import { checkReversed } from '../../../functions/checking';
import { VACSORTS } from '../../../functions/sorting';

const List = ({
  sortVacKey,
  isVacSortReverse,
  onFinishEdit,
  onToggleEdit,
  onVacationRemove,
  e, vacations
}) => {
  return (
    <ul className="list-table">
    {
      checkReversed(
        sortVacKey,
        vacations,
        isVacSortReverse,
        VACSORTS
      ).map(v => {
        const display = v.isEditing ?
          (
            <EditingList
              key={v.id}
              onFinishEdit={onFinishEdit}
              onToggleEdit={onToggleEdit}
              e={e} v={v}
            />
          )
            : 
          (
            <DisplayingList 
              key={v.id}
              onToggleEdit={onToggleEdit}
              onVacationRemove={onVacationRemove}
              e={e} v={v}
            />
          );
        return display;
      })}
    </ul>
  )
}

const DisplayingList = ({
  onToggleEdit,
  onVacationRemove,
  e, v
}) => {
  let borderColor;

  if (moment(v.from) < moment() 
    && moment(v.to) > moment()
  ) {
    borderColor = 'orange';
  } else if (moment(v.to) > moment()) {
    borderColor = 'green';
  } else {
    borderColor = 'red';
  }

  return (
    <div key={v.id}>
      <li
        style={{
          borderColor
        }}
        className="list-disp-vacations"
      >{`${v.from} - ${v.to}`}</li>
      {
        v.isCorrect
        ? null 
        : <div
            style={{
              color: 'orangered'
            }}
          >
            incorrect
          </div>
      }<div>
        {moment(v.to) > moment()
        ? <span>
            <button
              className="list-disp-edit edit-btn" 
              onClick={() =>
                onToggleEdit(e.id, v.id)
            }>
              Edit
            </button>
          </span> 
        : <div>
            expired
          </div>
        }
        <button 
          className="list-disp-remove remove-btn"
          onClick={() => 
          onVacationRemove(
            e.id, 
            v.id
        )}>
            Remove
        </button>
      </div>
    </div>
  )
}

const EditingList = ({
  onFinishEdit,
  onToggleEdit,
  e, v
}) => {
  let from, to;
  return (
    <div className="list-edit-container">
      <input 
        type="date"
        ref={node => 
          from = node
      }/>
      - 
      <input
        type="date"
        ref={node =>
          to = node
      }/>
      <span className="list-edit-btns">
        <button 
          className="add-btn"
          onClick={() => 
          onFinishEdit(
            e.id,
            v.id,
            from.value,
            to.value
        )}>
          Save
        </button>
        <button 
          className="edit-btn"
          onClick={() =>
          onToggleEdit(
            e.id, 
            v.id
          )
        }>
          Cancel
        </button>
      </span>
    </div>
  )
}

export default List;
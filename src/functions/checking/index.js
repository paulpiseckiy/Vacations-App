import moment from 'moment';
import swal from 'sweetalert';

import { VACSORTS } from '../sorting';

function checkReversed(
  sortKey,
  arr,
  isReversed,
  SORT
) {
  const sortedList = SORT[sortKey](arr);
  const reverseSortedList = isReversed ?
    sortedList.reverse() :
    sortedList;
  return reverseSortedList;
}

function checkEmployees(arr, id) {
  const employee = arr.find(e => e.id === id);
  const count = arr.filter(e => e.position === employee.position);

  if (count.filter(e => e.vacations.length === 0).length < count.length / 2) {
    swal('Oops!', '- only 50% of employees position can have vacations', 'error');
    return false;
  }

  return true;
}

function checkInputErrors(from, to) {
  let errorlog = '';

  if (!from || !to) {
    errorlog = '- complete all fields';
  } 
  
  if (moment(to).diff(moment(from), 'days') < 2) {
    errorlog = '- your vacation duration is less than 2';
  } 

  if (moment(to).diff(moment(from), 'days') > 15) {
    errorlog = '- your vacation duration is more than 15';
  } 
  
  if (moment(from).isAfter(moment(to))) {
    errorlog = '- input correct date'; 
  } 
  
  if (errorlog) {
    swal('Oops!', errorlog, 'error');
    return false;
  }
  
  return true;
}

function checkDates(originArr, isCorrect = true) {
  if (!isCorrect) {
    return originArr.map(v => ({
      ...v,
      isCorrect: false
    })) 
  }

  let ids = [];
  const array = VACSORTS.DATE(originArr);

  for (let i = 0; i <= array.length - 2; i++) {
    let duration = moment(array[i].to).diff(moment(array[i].from), 'days');
    
    if (moment(array[i+1].from).isBefore(moment(array[i].to).add(duration, 'days'))) {
      ids.push(array[i+1].id);  
    }
  }

  const updatedArr = originArr.map(v => {
    if (!ids.find(id => id === v.id)) {
      return {
        ...v,
        isCorrect: true
      };
    }
    
    swal('Look!', '- incorrect range between vacations', 'warning');
    return {
      ...v,
      isCorrect: false
    }
  });

  return updatedArr;
}

export {
  checkDates,
  checkReversed,
  checkEmployees,
  checkInputErrors
};
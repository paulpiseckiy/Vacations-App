import moment from 'moment';
import swal from 'sweetalert';

function updateYearLimit(from, to, prevData, id) {
  if (moment(from).format('YYYY') === moment(to).format('YYYY')) {  
    const prevYear = prevData.find(b => b.year === moment(from).format('YYYY'));

    const counter = prevYear ? 
      prevYear.duration += moment(to).diff(moment(from), 'days') :
      moment(to).diff(moment(from), 'days');
      
    if (counter > 24) {
      swal('Oops!','- over year vacation duration limit', 'error');
      prevYear.duration -= moment(to).diff(moment(from), 'days');
      return false;
    }
    
    if (prevYear) {
      prevData = prevData.filter(b => b.year !== prevYear.year);
    }
      
    return [
      ...prevData,
      {
        id,
        year: moment(from).format('YYYY'),
        duration: counter
      }
    ]
  } else {
    const prevFromYear = prevData.find(b => b.year === moment(from).format('YYYY'));
    const prevToYear = prevData.find(b => b.year === moment(to).format('YYYY'));

    const fromCounter = prevFromYear ?
    prevFromYear.duration += moment(`${moment(from).format('YYYY')}-12-31`).diff(moment(from), 'days') :
    moment(`${moment(from).format('YYYY')}-12-31`).diff(moment(from), 'days');
    
    const toCounter = prevToYear ?
    prevToYear.duration += moment(to).diff(moment(`${moment(to).format('YYYY')}-01-01`), 'days') + 1 :
    moment(to).diff(moment(`${moment(to).format('YYYY')}-01-01`), 'days') + 1;
    
    if (fromCounter > 24 || toCounter > 24 ) {
      swal('Oops!','- over year vacation duration limit', 'error');
      return false;
    }
    
    if (prevFromYear) {
      prevData = prevData.filter(b => b.year !== prevFromYear.year)
    }

    if (prevToYear) {
      prevData = prevData.filter(b => b.year !== prevToYear.year)
    }


    return [
      ...prevData,
      {
        id,
        year: moment(from).format('YYYY'),
        duration: fromCounter
      },
      {
        id,
        year: moment(to).format('YYYY'),
        duration: toCounter
      }
    ];
  }
}

function removeYearLimit(from, to, prevData, id) {
  if (moment(from).format('YYYY') === moment(to).format('YYYY')) {  
    const prevYear = prevData.find(b => b.year === moment(from).format('YYYY'));
    prevData = prevData.filter(b => b.year !== prevYear.year);
  
    const counter = prevYear.duration -= moment(to).diff(moment(from), 'days') 
    
    if (counter <= 0 ) {
      return prevData;
    }
      
    return [
      ...prevData,
      {
        id,
        year: moment(from).format('YYYY'),
        duration: counter
      }
    ]
  } else {
    const prevFromYear = prevData.find(b => b.year === moment(from).format('YYYY'));
    const prevToYear = prevData.find(b => b.year === moment(to).format('YYYY'));

    const fromCounter = prevFromYear.duration -= moment(`${moment(from).format('YYYY')}-12-31`).diff(moment(from), 'days');
    const toCounter = prevToYear.duration -= moment(to).diff(moment(`${moment(to).format('YYYY')}-01-01`), 'days') + 1;

    const updated = [
      ...prevData,
      {
        id,
        year: moment(from).format('YYYY'),
        duration: fromCounter
      },
      {
        id,
        year: moment(to).format('YYYY'),
        duration: toCounter
      }
    ];

    return updated.filter(b => b.duration !== 0);
  }
}

export {
  updateYearLimit,
  removeYearLimit
};
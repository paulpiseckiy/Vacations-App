import React, { Component } from 'react';
import swal from 'sweetalert';
import './App.css';

import {
  checkDates,
  checkEmployees,
  checkInputErrors
} from './functions/checking';
import {
  updateYearLimit,
  removeYearLimit,
} from './functions/updating';

import Info from './Components/Info';
import Table from './Components/Table';
import Form from './Components/Form';

let id = 0;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      sortEmpKey: 'NONE',
      sortVacKey: 'NONE',
      isEmpSortReverse: false,
      isVacSortReverse: false,
    }

    this.onAddEmployee = this.onAddEmployee.bind(this);
    this.onToggleEdit = this.onToggleEdit.bind(this);
    this.onFinishEdit = this.onFinishEdit.bind(this);
    this.onVacationAdd = this.onVacationAdd.bind(this);
    this.onVacationRemove = this.onVacationRemove.bind(this);
    this.onToggleAddV = this.onToggleAddV.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSortEmp = this.onSortEmp.bind(this); 
    this.onSortVac = this.onSortVac.bind(this); 
  }

  onSortEmp(sortEmpKey) {
    const isEmpSortReverse = this.state.sortEmpKey === sortEmpKey && !this.state.isEmpSortReverse;
    isEmpSortReverse 
    ? swal({
      title: `Sorting employees by ${sortEmpKey}`,
      text: '- reversed',
      icon: 'warning',
      timer: 1500,
      buttons: false
    })
    : swal({
      title: `Sorting employees by ${sortEmpKey}`,
      icon: 'warning',
      timer: 1500,
      buttons: false
    })

    this.setState({ sortEmpKey, isEmpSortReverse });
  }

  onSortVac(sortVacKey) {
    const isVacSortReverse = this.state.sortVacKey === sortVacKey && !this.state.isVacSortReverse;
    isVacSortReverse 
    ? swal({
      title: `Sorting vacations by ${sortVacKey}`,
      text: '- reversed',
      icon: 'warning',
      timer: 1500,
      buttons: false
    })
    : swal({
      title: `Sorting vacations by ${sortVacKey}`,
      icon: 'warning',
      timer: 1500,
      buttons: false
    })

    this.setState({ sortVacKey, isVacSortReverse });
  }

  onToggleAddV(id) {
    const updated = this.state.employees.map(e => {
      if (e.id !== id) {
        return {
          ...e,
          isAddingVac: false
        };
      }
      
      return {
        ...e,
        isAddingVac: !e.isAddingVac
      }
    })

    this.setState({
      employees: updated
    })
  }

  onToggleEdit(id, vId) {
    const updated = this.state.employees.map(employee => {
      if (employee.id !== id) {
        return employee;
      }
      
      const updatedVacations = employee.vacations.map(v => {
        if (v.id !== vId) {
          return v;
        }
       
        return {
          ...v,
          isEditing: !v.isEditing
        }
      })

      return {
        ...employee,
        vacations: updatedVacations
      }
    });

    this.setState({
      employees: updated
    });
  }

  onVacationAdd(id, from, to) {  
    if (!checkInputErrors(from, to)) {
      return;
    } 

    const oId = id;
    const updated = this.state.employees.map(employee => {
      if (employee.id !== oId) {
        return employee;
      }
     
      const prevVacations = employee.vacations;
        id = prevVacations.length + 1;

      let prevData = employee.businessData;

      const businessData = updateYearLimit(from, to, prevData, id); 
      if (!businessData) {
        return employee;
      }

      const vacation = {
          id,
          from,
          to,
          isCorrect: true,
          isEditing: false
      };

      let vacations = [
        ...prevVacations,
        vacation
      ];

      vacations = checkDates(vacations);
      
      return {
        ...employee,
        businessData,
        vacations,
        isAddingVac: false,
        from,
        to
      }
    });

    if (!checkEmployees(updated, oId)) {
      return;
    }

    this.setState({
      employees: updated
    })
  }

  onVacationRemove(eId, vId) {
    const updated = this.state.employees.map(employee => {
      if (employee.id !== eId) {
        return employee;
      }
      
      const vacation = employee.vacations.find(v => v.id === vId);
      const businessData = removeYearLimit(vacation.from, vacation.to, employee.businessData, vId);

      let vacations = employee.vacations.filter(v => v.id !== vId);
        vacations = checkDates(vacations);
      
      return {
        ...employee,
        businessData,
        vacations
      }
    });

    if (!checkEmployees(updated, eId)) {
      return;
    }

    this.setState({
      employees: updated
    })
  }

  onFinishEdit(id, vId, from, to) {
    if (!checkInputErrors(from, to)) {
      return;
    }

    const updated = this.state.employees.map(employee => {
      if (employee.id !== id) {
        return employee;
      }
    
      const prevVacation = employee.vacations.find(v => v.id === vId);

      let businessData = removeYearLimit(prevVacation.from, prevVacation.to, employee.businessData, vId);
        businessData = updateYearLimit(from, to, employee.businessData, vId);

      let prevVacations = employee.vacations.filter(v => v.id !== vId);
        prevVacations = checkDates(prevVacations)

      const vacation = {
        id: vId,
        isCorrect: true,
        isEditing: false,
        from,
        to
      };

      let vacations = [
        ...prevVacations,
        vacation
      ];

      vacations = checkDates(vacations);

      return {
        ...employee,
        businessData,
        vacations,
        from,
        to
      }
    });

    if (!checkEmployees(updated, id)) {
      return;
    }

    this.setState({
      employees: updated
    });
  }

  onDelete(id) {
    const updated = this.state.employees.filter(e => e.id !== id);
    const deleted = this.state.employees.find(e => e.id === id);

    const count = updated.filter(em => em.position === deleted.position);
    let errorMessage = '';
    
    const employees = updated.map(e => {
      if (e.position !== deleted.position ||
        !e.vacations.length) {
        return e;
      }

      if (count && count.filter(e => e.vacations.length === 0).length  < count.length / 2) {
        errorMessage = '- only 50% of employees position can have vacations';
        return {
          ...e,
          vacations: checkDates(e.vacations, false),
        };
      } else {  
        errorMessage = '- incorrect range between vacations';
        return {
          ...e,
          vacations: checkDates(e.vacations)
        };
    }});

    if (errorMessage) {
      swal('Look!', errorMessage, 'warning');
    } else {
      swal({
        title: 'Success!',
        text: '- removed an employee',
        icon: 'success',
        timer: 1500,
        buttons: false
      })
    }

    this.setState({
      employees
    });
  }

  onAddEmployee(person, position, event) {
    if(!person || !position) {
      swal('Oops!', '- fields are not completed', 'error');
      event.preventDefault();

      return false;
    }

    let employees = [
      ...this.state.employees,
      {
        id: id++,
        person,
        position,
        businessData: [],
        isAddingVac: false,
        vacations: []
      }
    ];

    const count = employees.filter(em => em.position === position);

    employees = employees.map(e => {
      if (e.position !== position) {
        return e;
      }

      if (count && count.filter(e => e.vacations.length === 0).length  < count.length / 2) {
      return {
        ...e,
        vacations: checkDates(e.vacations, false),
      };
    } else {  
      return {
        ...e,
        vacations: checkDates(e.vacations)
      };
    }});
    
    
    this.setState({employees});
  
    swal({
      title: 'Success!',
      text: '- added an employee',
      icon: 'success',
      buttons: false,
      timer: 1500,
    })

    event.preventDefault();
    return true;
  }
  
  render() {
    const {
      employees,
      sortEmpKey,
      sortVacKey,
      isEmpSortReverse,
      isVacSortReverse
    } = this.state;

    return (
      <div> 
        <Info 
          onSortEmp={this.onSortEmp}
        />
        <Table 
          employees={employees}
          sortEmpKey={sortEmpKey}
          sortVacKey={sortVacKey}
          isEmpSortReverse={isEmpSortReverse}
          isVacSortReverse={isVacSortReverse}
          onFinishEdit={this.onFinishEdit}          
          onVacationAdd={this.onVacationAdd}        
          onVacationRemove={this.onVacationRemove}   
          onToggleAddV={this.onToggleAddV}         
          onToggleEdit={this.onToggleEdit}
          onSortVac={this.onSortVac}
          onDelete={this.onDelete}
        />
        <Form 
          onAddEmployee={this.onAddEmployee}
        />
      </div>
    );
  }
}

export default App;
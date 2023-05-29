window.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.querySelector('#expense-form');
    const expenseTableBody = document.querySelector('#expense-table tbody');
    const searchInput = document.querySelector('#search-input');
    const filterField = document.querySelector('#filter-field');
    const totalExpenses = document.querySelector('#total-expenses');
    const consumptionChart = document.querySelector('#consumption-chart');
  
    // Armazena as despesas
    let expenses = [];
  
    // Adiciona uma nova despesa
function addExpense(e) {
    e.preventDefault();
  
    // Obtém os valores do formulário
    const descricao = document.querySelector('#descricao').value;
    const valor = parseFloat(document.querySelector('#valor').value);
  
    // Validação dos valores do formulário
    if (descricao.trim() === '' || isNaN(valor) || valor <= 0) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
  
    // Cria um objeto com a despesa
    const expense = {
      descricao,
      valor
    };
  
    // Adiciona a despesa 
    expenses.push(expense);
  
    // Salva as despesas
    saveExpenses();
  
    // Limpa os campos do formulário
    document.querySelector('#descricao').value = '';
    document.querySelector('#valor').value = '';
  
    updateExpenseTable();
    updateTotalExpenses();
    updateConsumptionChart();
  }
  
  
    // Atualiza a tabela de despesas
    function updateExpenseTable(filteredExpenses) {
      expenseTableBody.innerHTML = '';
  
      const expensesToRender = filteredExpenses || expenses;
  
      expensesToRender.forEach(function (expense, index) {
        const row = document.createElement('tr');
  
        const descricaoCell = document.createElement('td');
        descricaoCell.textContent = expense.descricao;
        row.appendChild(descricaoCell);
  
        const valorCell = document.createElement('td');
        valorCell.textContent = expense.valor.toFixed(2);
        row.appendChild(valorCell);
  
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('actions-button');
        deleteButton.addEventListener('click', function () {
          deleteExpense(index);
        });
        actionsCell.appendChild(deleteButton);
  
        row.appendChild(actionsCell);
  
        expenseTableBody.appendChild(row);
      });
    }
  
    // Excluir uma despesa
    function deleteExpense(index) {
      expenses.splice(index, 1);
      saveExpenses();
      updateExpenseTable();
      updateTotalExpenses();
      updateConsumptionChart();
    }
  
    // Salvar as despesas 
    function saveExpenses() {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  
    // Função para carregar as despesas
    function loadExpenses() {
      const savedExpenses = localStorage.getItem('expenses');
      if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        updateExpenseTable();
        updateTotalExpenses();
        updateConsumptionChart();
      }
    }
  
    // Função para atualizar o total de despesas
    function updateTotalExpenses() {
      const total = expenses.reduce((acc, expense) => acc + expense.valor, 0);
      totalExpenses.textContent = total.toFixed(2);
    }
  
    // Função para atualizar a análise de consumo
    function updateConsumptionChart() {
      const chartLabels = expenses.map((expense, index) => `Despesa ${index + 1}`);
      const chartData = expenses.map(expense => expense.valor);
  
      const chartConfig = {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Valor',
            data: chartData,
            backgroundColor: '#007BFF',
            borderColor: '#007BFF',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };
  
      new Chart(consumptionChart, chartConfig);
    }
  
    // Função para filtrar as despesas
    function filterExpenses() {
      const searchValue = searchInput.value.toLowerCase();
      const filterFieldSelected = filterField.value;
  
      const filteredExpenses = expenses.filter(expense => {
        const expenseFieldValue = expense[filterFieldSelected].toString().toLowerCase();
        return expenseFieldValue.includes(searchValue);
      });
  
      updateExpenseTable(filteredExpenses);
    }
  
    expenseForm.addEventListener('submit', addExpense);
    searchInput.addEventListener('input', filterExpenses);
    filterField.addEventListener('change', filterExpenses);
  
    loadExpenses();
  });
  
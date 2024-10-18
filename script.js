document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Simulate successful login (replace with actual authentication logic)
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === 'san' && password === '123') { 
                window.location.href = 'home.html'; // Redirect to home page on successful login
            } 
            if (username === 'suriya' && password === '123') { 
                window.location.href = 'home.html';
            }
            if (username === 'vicky' && password === '123') {
                window.location.href = 'home.html';
            }
            if (username === 'mani' && password === '123') { 
                window.location.href = 'home.html';
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        });
    }
});



// Save Expense to Firebase
function saveExpense(type, expense) {
    const db = firebase.database();
    const expensesRef = db.ref("expenses");

    // Save expense under 'group' or 'private' type
    expensesRef.push({
        type: type,
        ...expense
    });
}

// Retrieve Expenses from Firebase
function displayExpenseHistory() {
    const db = firebase.database();
    const expensesRef = db.ref("expenses");
    const expenseHistoryContainer = document.getElementById("expense-history-container");

    expensesRef.once("value", (snapshot) => {
        const expenses = snapshot.val();
        expenseHistoryContainer.innerHTML = ""; // Clear any previous data

        if (!expenses) {
            expenseHistoryContainer.innerHTML = "<p>No expenses recorded yet.</p>";
            return;
        }

        const historyList = document.createElement("ul");
        historyList.style.listStyleType = "none";
        historyList.style.padding = "0";

        Object.values(expenses).forEach((expense) => {
            const listItem = document.createElement("li");
            listItem.style.borderBottom = "1px solid #ccc";
            listItem.style.padding = "10px";

            listItem.innerHTML = `
                <strong>${expense.type === "group" ? "Group Expense" : "Private Expense"}</strong><br>
                ${expense.groupName ? `<span>Group: ${expense.groupName}</span><br>` : ""}
                Amount: ${expense.amount}<br>
                Description: ${expense.description || "N/A"}<br>
                Date: ${expense.date}
            `;

            historyList.appendChild(listItem);
        });

        expenseHistoryContainer.appendChild(historyList);
    });
}

// Attach Event Listeners (Use Firebase Functions)
document.addEventListener("DOMContentLoaded", () => {
    const groupExpenseForm = document.getElementById("group-expense-form");
    const privateExpenseForm = document.getElementById("private-expense-form");
    const expenseHistoryButton = document.getElementById("expense-history");

    groupExpenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const groupName = document.getElementById("group-name").value;
        const groupAmount = document.getElementById("group-amount").value;
        const groupDescription = document.getElementById("group-description").value;
    
        const expense = {
            groupName,
            amount: groupAmount,
            description: groupDescription,
            date: new Date().toLocaleDateString(),
        };
    
        try {
            await saveExpense("group", expense); // Assuming saveExpense is async
            alert("Group expense added successfully!");
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    
        groupExpenseForm.reset();
    });
    

    // Event listener for private expense form submission
    privateExpenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const privateAmount = document.getElementById("private-amount").value;
        const privateDescription = document.getElementById("private-description").value;

        const expense = {
            amount: privateAmount,
            description: privateDescription,
            date: new Date().toLocaleDateString(),
        };

        saveExpense("private", expense);
        alert("Private expense added successfully!");
        privateExpenseForm.reset();
    });

    // Event listener for expense history button click
    expenseHistoryButton.addEventListener("click", displayExpenseHistory);
});

3
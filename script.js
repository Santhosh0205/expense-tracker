// Save Expense to Firebase
function saveExpense(type, expense) {
    if (!currentUser) {
        alert("User is not logged in. Please log in again.");
        return; // Exit the function if currentUser is not set
    }

    let expensesRef = firebase.database().ref("expenses");

    if (type === "group") {
        expense.username = currentUser;
        expensesRef.child("group").push(expense);
    } else if (type === "private") {
        expensesRef.child("private").child(currentUser).push(expense);
    }
}
// Store user
// localStorage.setItem('currentUser', username);

// // Retrieve user on other pages
// const currentUser = localStorage.getItem('currentUser');

// Update currentUser when user logs in
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'san' && password === '123') { 
                currentUser = 'san';
                window.location.href = 'home.html';
            } else if (username === 'suriya' && password === '123') {
                currentUser = 'suriya';
                window.location.href = 'home.html';
            } else if (username === 'vicky' && password === '123') {
                currentUser = 'vicky';
                window.location.href = 'home.html';
            } else if (username === 'mani' && password === '123') {
                currentUser = 'mani';
                window.location.href = 'home.html';
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        });
    }
});


// Retrieve Expenses from Firebase
function displayExpenseHistory() {
    const expenseHistoryContainer = document.getElementById("expense-history-container");
    expenseHistoryContainer.innerHTML = ""; // Clear previous data
    let expensesRef = firebase.database().ref("expenses");

    // Fetch Group Expenses (Visible to All)
    expensesRef.child("group").once("value", (snapshot) => {
        const expenses = snapshot.val();
        if (expenses) {
            const historyList = document.createElement("ul");
            historyList.style.listStyleType = "none";
            historyList.style.padding = "0";

            Object.values(expenses).forEach((expense) => {
                const listItem = document.createElement("li");
                listItem.style.borderBottom = "1px solid #ccc";
                listItem.style.padding = "10px";

                listItem.innerHTML = `
                    <strong>Group Expense</strong><br>
                    Username: ${expense.username}<br>
                    Group: ${expense.groupName}<br>
                    Amount: ${expense.amount}<br>
                    Description: ${expense.description || "N/A"}<br>
                    Date: ${expense.date}
                `;

                historyList.appendChild(listItem);
            });

            expenseHistoryContainer.appendChild(historyList);
        }
    });

    // Fetch Private Expenses (Only Visible to Current User)
    expensesRef.child("private").child(currentUser).once("value", (snapshot) => {
        const privateExpenses = snapshot.val();
        if (privateExpenses) {
            const privateList = document.createElement("ul");
            privateList.style.listStyleType = "none";
            privateList.style.padding = "0";

            Object.values(privateExpenses).forEach((expense) => {
                const listItem = document.createElement("li");
                listItem.style.borderBottom = "1px solid #ccc";
                listItem.style.padding = "10px";

                listItem.innerHTML = `
                    <strong>Private Expense</strong><br>
                    Amount: ${expense.amount}<br>
                    Description: ${expense.description || "N/A"}<br>
                    Date: ${expense.date}
                `;

                privateList.appendChild(listItem);
            });

            expenseHistoryContainer.appendChild(privateList);
        }
    });
}

// Attach Event Listeners
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
            await saveExpense("group", expense);
            alert("Group expense added successfully!");
        } catch (error) {
            console.error("Error adding expense:", error);
        }

        groupExpenseForm.reset();
    });

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

    expenseHistoryButton.addEventListener("click", displayExpenseHistory);
});

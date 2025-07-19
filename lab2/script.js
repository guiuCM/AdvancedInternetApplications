function addRow() {
    let table = document.getElementById("table").getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="Name"></td>
        <td><input type="number" placeholder="Price" min="0" step="0.01" oninput="validateNumber(this)"></td>
        <td><input type="text" placeholder="Type"></td>
        <td>
            <button onclick="saveRow(this)">Save</button>
            <button onclick="removeRow(this)">Remove</button>
        </td>`;
}

function validateNumber(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
}

function saveRow(button) {
    let row = button.parentElement.parentElement;
    let name = row.cells[0].querySelector('input').value;
    let price = row.cells[1].querySelector('input').value;
    let found = true;
    let type = row.cells[2].querySelector('input').value;

    if (!name) {
        alert("You must put the name of the game.");
        return;
    }

    if(price == '') found = false;

    if (price < 0 && found) {
        alert("Price must be a valid number greater than 0, or 0 if it is free.");
        return;
    }

    if (price > 0 && found) {
        row.innerHTML = `
        <td>${name}</td>
        <td>${price}</td>
        <td>${type}</td>
        <td>
            <button onclick="editRow(this)">Edit</button>
            <button onclick="removeRow(this)">Remove</button>
        </td>`;
    }
    else if(price == 0 && found){
        row.innerHTML = `
        <td>${name}</td>
        <td>${'Free'}</td>
        <td>${type}</td>
        <td>
            <button onclick="editRow(this)">Edit</button>
            <button onclick="removeRow(this)">Remove</button>
        </td>`;
    }
    else{
        row.innerHTML = `
        <td>${name}</td>
        <td>${'You missed the price?'}</td>
        <td>${type}</td>
        <td>
            <button onclick="editRow(this)">Edit</button>
            <button onclick="removeRow(this)">Remove</button>
        </td>`;
    }
    
}

function editRow(button) {
    let row = button.parentElement.parentElement;
    let name = row.cells[0].innerText;
    let price = row.cells[1].innerText;
    let type = row.cells[2].innerText;

    row.innerHTML = `
        <td><input type="text" value="${name}"></td>
        <td><input type="number" value="${price}" min="0" step="0.01" oninput="validateNumber(this)"></td>
        <td><input type="text" value="${type}"></td>
        <td>
            <button onclick="saveRow(this)">Save</button>
            <button onclick="removeRow(this)">Remove</button>
        </td>`;
}

function removeRow(button) {
    let row = button.parentElement.parentElement;
    row.remove();
}

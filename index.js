const port = process.env.PORT || 5000
document.addEventListener('DOMContentLoaded',function() {
    fetch(`http://localhost:${port}/getAll`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

});
document.querySelector('table tbody').addEventListener('click', function(event){
   if(event.target.className=== 'delete-row-btn'){
    deleteRowById(event.target.dataset.id);
   }
   if(event.target.className==='edit-row-btn'){
    handleEditRow(event.target.dataset.id)
   }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');    
searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch(`http://localhost:${port}/search/` + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


function deleteRowById(id) {
    fetch(`http://localhost:${port}/delete/` + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}
function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');


    console.log(updateNameInput);

    fetch(`http://localhost:${port}/update`, {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}

const addBtn=document.querySelector('#add-name-btn')
const deleteBtn=document.querySelector('.delete-row-btn')
addBtn.onclick  = function(){
    const nameInput= document.querySelector('#name-input')
    const name= nameInput.value;
    nameInput.value= "";

    fetch(`http://localhost:${port}/insert`,{
    headers:{
        'Content-type':'application/json'},
        method:'POST',
        body: JSON.stringify({name : name})
    })
    .then(response=>response.json())
    .then(data=> insertRowIntoTable(data['data']))
    ;
}
function insertRowIntoTable(data){
    
    const table = document.querySelector('table tbody');
    const isTableData= table.querySelector('.no-data');
    let tableHTML='<tr>';

    // for(var key in data){
    //     if(data.hasOwnProperty(key)){
    //         if(key==='dateAdded'){
    //             data[key]= new Date(data[key]).toLocaleString();
    //         }
            
            tableHTML += `<td>${data.name}</td>`;
            
            
            // tableHTML += `<td hidden>${data.name}</td>`;
        // }
    // }
    tableHTML+= `<td><button class='delete-row-btn' data-id=${data.id}>Delete</button></td>`;
    tableHTML+= `<td><button class='edit-row-btn' data-id=${data.id}>Edit</button></td>`;

    tableHTML+='</tr>'

    if(isTableData){
        table.innerHTML=tableHTML;
    }
    else{
        const newRow=table.insertRow();
        newRow.innerHTML=tableHTML;
    }
}

function loadHTMLTable(data){
    const table=document.querySelector('table tbody');
   
    if(data.length === 0 ){
        table.innerHTML ='<tr><td class = "no-data" colspan="5">No Data</td></tr>';
        return;
    } 
    let tableHTML =''
    data.forEach(function({id, name,date_added}){
        tableHTML+= '<tr>';
        tableHTML+= `<td hidden >${id}</td>`;
        tableHTML+= `<td>${name}</td>`;
        tableHTML+= `<td hidden >${new Date(date_added).toLocaleString()}</td>`;
        tableHTML+= `<td><button class='delete-row-btn' data-id=${id}>Delete</button></td>`;
        tableHTML+= `<td><button class='edit-row-btn' data-id=${id}>Edit</button></td>`;
        tableHTML+='</tr>'
    })
    table.innerHTML=tableHTML;
}
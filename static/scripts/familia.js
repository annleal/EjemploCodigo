function filter(page = 1) {
    var IdFamilia = document.getElementById('IdFamilia').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    // Exibe a barra de loading
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_familia?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            IdFamilia: IdFamilia,
            Descripcion: Descripcion
        })
    })
        .then(response => response.json())
        .then(data => {
            // Limpa a tabela atual
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }


            // Adiciona as linhas com os dados do select na tabela
            data.results.forEach((row, index) => {
                var tr = document.createElement('tr');
                tr.setAttribute("data-index", index);
                tr.setAttribute('data-id', row.IdFamilia);
                tr.innerHTML = `
              
            <td>${row.IdFamilia}</td>
            <td>${row.Descripcion}</td>
            <td>${row.Servicio}</td>
            <td>${row.CodTipo}</td>
            <td><a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
                <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a></td>
           
        `;
                tbody.appendChild(tr);
                console.log(row); // Exibir informações de linha no console

            });

            // Adiciona o dropdown de paginação
            var paginationDiv = document.getElementById('paginationDiv');
            if (paginationDiv.firstChild) {
                paginationDiv.removeChild(paginationDiv.firstChild);
            }

            if (data.num_pages > 1) {
                var pagination = document.createElement('select');
                pagination.id = 'pagination';
                for (var i = 1; i <= data.num_pages; i++) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.text = `Pagina ${i}`;
                    if (i == data.page) {
                        option.selected = true;
                    }
                    pagination.appendChild(option);
                }
                pagination.addEventListener('change', event => {
                    filter(event.target.value);
                });
                paginationDiv.appendChild(pagination);
            }
            // Oculta a barra de loading
            loading.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
}

// Chame a função filter quando a página for carregada
filter();

// Exibir popup de configuração
function showConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "block";
}

// Esconder popup de configuração
function hideConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "none";
}

// Guardar
function GuardarConfig() {
    
    // Obter valores dos campos
    var IdFamilia = document.getElementById("configIdFamilia").value;
    var Descripcion = document.getElementById("configDescripcion").value;
    var Servicio = document.getElementById("configidServicio").value;
    var CodTipo = document.getElementById("configCodTipo").value;

    // Chamar endpoint do servidor Python para Guardar e processar o insert
    fetch("/insert_familia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdFamilia: IdFamilia,
            Descripcion: Descripcion,
            Servicio: Servicio,
            CodTipo: CodTipo,
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Inforación guardad con exito!");
                // Esconder popup de configuração
                hideConfig();

                // Chamar a função filter() após o tratamento da requisição AJAX
                filter();
            } else {
                alert("Erro al guardar los dados.");
            }

        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
            // Esconder popup de configuração
            hideConfig();

            
        });
}


function showEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "block";
}

function editRow(index) {
    // Encontrar a linha na tabela com o ID correspondente
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);

    // Verificar se a linha foi encontrada
    if (row) {
        // Obter os valores dos campos na linha
        var IdFamilia = row.querySelector('td:nth-child(1)').innerText;
        var Descripcion = row.querySelector('td:nth-child(2)').innerText;
        var Servicio = row.querySelector('td:nth-child(3)').innerText;
        var CodTipo = row.querySelector('td:nth-child(4)').innerText;


        // Preencher os campos do popup de edição com os valores da linha
        document.getElementById("editIdFamilia").value = IdFamilia;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editServicio").value = Servicio;
        document.getElementById("editCodTipo").value = CodTipo;


        // Definir atributos data-old-value para armazenar valores antigos
        document.getElementById("editIdFamilia").setAttribute("data-old-value", IdFamilia);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editServicio").setAttribute("data-old-value", Servicio);
        document.getElementById("editCodTipo").setAttribute("data-old-value", CodTipo);


        // Mostrar o popup de edição
        showEdit();
    } else {
        alert(`Linha com ID ${index} não encontrada.`);
        console.error(`Linha com ID ${index} não encontrada.`);
        return;
    }
}


// Esconder popup de edição
function hideEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "none";
}


function updateRow() {
    // Obter valores dos campos
    var oldIdFamilia = document.getElementById("editIdFamilia").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldServicio = document.getElementById("editServicio").getAttribute("data-old-value");
    var oldCodTipo = document.getElementById("editCodTipo").getAttribute("data-old-value");


    var newIdFamilia = document.getElementById("editIdFamilia").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newServicio = document.getElementById("editServicio").value;
    var newCodTipo = document.getElementById("editCodTipo").value;


    // Chamar endpoint do servidor Python para atualizar e processar os dados atualizados
    fetch("/update_familia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldIdFamilia: oldIdFamilia,
            oldDescripcion: oldDescripcion,
            oldServicio: oldServicio,
            oldCodTipo: oldCodTipo,
            newIdFamilia: newIdFamilia,
            newDescripcion: newDescripcion,
            newServicio: newServicio,
            newCodTipo: newCodTipo,

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Actualizado con exito!");
            } else {
                alert("Error al actualizar los dados.");
            }
            // Esconder popup de configuração
            hideEdit();
            filter();
        })
        .catch((error) => {
            console.error(error);
            alert("Se produció un erro de sistema.");
            // Esconder popup de configuração
            hideEdit();
            filter();
        });
}
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);
    // Obter os valores dos campos da linha
    var delIdFamilia = row.querySelector('td:nth-child(1)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(2)').innerText;
    var delServicio = row.querySelector('td:nth-child(3)').innerText;
    var delCodTipo = row.querySelector('td:nth-child(4)').innerText;


    // Adicionar um alerta de confirmação para o usuário
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        // Chamar endpoint do servidor Python para atualizar e processar os dados
        fetch("/delete_familia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delIdFamilia: delIdFamilia,
                delDescripcion: delDescripcion,
                delServicio: delServicio,
                delCodTipo: delCodTipo,

            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Fila borrada con éxito!");
                } else {
                    alert("Erro al borrar la fila.");
                }
                // Esconder popup
                hideEdit();
                filter();
            });
    }
}

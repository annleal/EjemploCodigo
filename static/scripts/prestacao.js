function filter(page = 1) {
    var idPrestacion = document.getElementById('idPrestacion').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';
    fetch(`/search_prestacao?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idPrestacion: idPrestacion,
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
                tr.innerHTML = `
                    <td>${row.tipo}</td>
                    <td>${row.CodTipo}</td>
                    <td>${row.CodigoFamilia}</td>
                    <td>${row.Familia}</td>
                    <td>${row.CodigoSubFamilia}</td>
                    <td>${row.SubFamilia}</td>
                    <td>${row.CodigoPrestacion}</td>
                    <td>${row.prestacion}</td>
                    <td>${row.UnidadMedida}</td>
                    <td>${row.Duracion}</td>
                    <td>
                        <a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
                        <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a>
                    </td>
                `;
                tbody.appendChild(tr);
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
                    option.text = `Página ${i}`;
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
function GudarConfig() {
    // Obter valores dos campos
    var IdCatalogo = document.getElementById("ConfigIdCatalogo").value;
    var IdPrestacion = document.getElementById("ConfigIdPrestacion").value;
    var IdFamilia = document.getElementById("configIdFamilia").value;
      var IdSubFamilia = document.getElementById("configIdSubFamilia").value;
    var Descripcion = document.getElementById("ConfigDescripcion").value;
    var UnidadMedida = document.getElementById("ConfigUnidadMedida").value;
    var Duracion = document.getElementById("ConfigDuracion").value;
  


    // Chamar endpoint do servidor Python para Guardar e processar o insert
    fetch("/insert_prestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdCatalogo: IdCatalogo,
            IdPrestacion: IdPrestacion,
            IdFamilia: IdFamilia,
            IdSubFamilia: IdSubFamilia,
            Descripcion: Descripcion,
            UnidadMedida: UnidadMedida,
            Duracion: Duracion,
           

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                console.log({ "IdCatalogo": IdCatalogo, "IdPrestacion": IdPrestacion, "IdFamilia": IdFamilia, "IdSubFamilia": IdSubFamilia,"Descripcion":Descripcion,"UnidadMedida":UnidadMedida,"Duracion":Duracion });
                alert("Dados inseridos com sucesso!");
            } else {
                alert("Erro ao inserir os dados.");
            }
            // Esconder popup de configuração
            hideConfig();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
            console.log({ "IdCatalogo": IdCatalogo, "IdPrestacion": IdPrestacion, "IdFamilia": IdFamilia, "IdSubFamilia": IdSubFamilia,"Descripcion":Descripcion,"UnidadMedida":UnidadMedida,"Duracion":Duracion });
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
        var IdPrestacion = row.querySelector('td:nth-child(7)').innerText;
        var IdFamilia = row.querySelector('td:nth-child(3)').innerText;
        var IdSubFamilia = row.querySelector('td:nth-child(5)').innerText;
        var Descripcion = row.querySelector('td:nth-child(8)').innerText;
        var UnidadMedida = row.querySelector('td:nth-child(9)').innerText;
        var Duracion = row.querySelector('td:nth-child(10)').innerText;

        // Preencher os campos do popup de edição com os valores da linha
        document.getElementById("editIdFamilia").value = IdFamilia;
        document.getElementById("editDescripcion").value = Descripcion;
       // document.getElementById("editServicio").value = Servicio;
       // document.getElementById("editCodTipo").value = CodTipo;


        // Definir atributos data-old-value para armazenar valores antigos
        document.getElementById("editIdFamilia").setAttribute("data-old-value", IdFamilia);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
       // document.getElementById("editServicio").setAttribute("data-old-value", Servicio);
       // document.getElementById("editCodTipo").setAttribute("data-old-value", CodTipo);


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
                alert("Dados atualizados com sucesso!");
            } else {
                alert("Erro ao atualizar os dados.");
            }
            // Esconder popup de edição
            hideEdit();
        });
}
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);
    // Obter os valores dos campos da linha
    var delPrestacion = row.querySelector('td:nth-child(7)').innerText;
    var delFamilia = row.querySelector('td:nth-child(3)').innerText;
    var delSubFamilia = row.querySelector('td:nth-child(5)').innerText;
    


    // Adicionar um alerta de confirmação para o usuário
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        // Chamar endpoint do servidor Python para atualizar e processar os dados
        fetch("/delete_familia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delPrestacion: delPrestacion,
                delFamilia: delFamilia,
                delSubFamilia: delSubFamilia,
              
            }),
        })
        console.log (delPrestacion,delFamilia,delSubFamilia)
            .then((response) => {
                if (response.status === 200) {
                    alert("Fila borrada con éxito!");
                } else {
                    alert("Erro al borrar la fila.");
                    console.log (delPrestacion,delFamilia,delSubFamilia)
                }
                // Esconder popup
                hideEdit();
            });
    }
}

function showImportPopup() {
    document.getElementById("importPopup").style.display = "block";
  }
  
  function hideImport() {
    document.getElementById("importPopup").style.display = "none";
  }
  
  $(document).ready(function() {
    // Função para lidar com a importação de dados
    $("form#importForm").on("submit", function(e) {
      e.preventDefault();
  
      var formData = new FormData(this);
  
      $.ajax({
        url: "/carga_prestacion",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
          $("#loading").show();
        },
        success: function(response) {
          // Sucesso na importação dos dados
          console.log(response);
          alert('Dados importados con exito!');
          hideImport();
          // Atualizar a tabela ou realizar outras ações necessárias
        },
        error: function(xhr, status, error) {
          // Erro na importação dos dados
          console.log("Error en carga los dados: " + error);
          alert('Error al importar los datos.Consulte el log.');
          // Exibir mensagem de erro ou realizar outras ações necessárias
        },
        complete: function() {
          $("#loading").hide();
        }
      });
    });
  });
  


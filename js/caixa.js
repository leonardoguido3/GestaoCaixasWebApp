var urlBaseApi = "https://localhost:44394/";
var tabelaCaixa;
var cardCliente;

// Função principal do index para listar caixas
$(document).ready(function () {
    ListarCaixas();
});

// Chamada API para listar caixas
function ListarCaixas() {
    var rotaApi = "caixa";

    $.ajax({
        url: urlBaseApi + rotaApi,
        method: 'GET',
        dataType: 'json',
        // beforeSend: function (xhr){
        //     xhr.setRequestHeader('Authorization', 'Bearer' + localStorage.getItem('bearer'));
        // }
    }).done(function (conteudoApi) {
        ConstruirTabelaCaixa(conteudoApi);
    });
}

// Chamada API para listar caixa especifica
function ListarCaixaEspecifica(id) {
    var rotaApi = "caixa/" + id;

    $.ajax({
        url: urlBaseApi + rotaApi,
        method: 'GET',
        dataType: 'json'
    }).done(function (conteudoCaixa) {
        MontarCardsVisualizacao(conteudoCaixa);
    });
}

// Construção da tabela de caixas cadastradas
function ConstruirTabelaCaixa(caixas) {

    var caixaTabelaHtml = "";

    $(caixas).each(function (index, caixa) {
        caixaTabelaHtml = caixaTabelaHtml + `<tr id="visualiza" data-id="${caixa.id}"><th>${caixa.nome}</th><td>${caixa.referencia}</td><td>${caixa.rua}</td><td>${caixa.bairro}</td><td>${caixa.cidade}</td><th>${caixa.clientes}</th></tr>`;
    });

    $("#tabelaCaixa tbody").html(caixaTabelaHtml);
    if (tabelaCaixa == undefined) {
        tabelaCaixa = $('#tabelaCaixa').DataTable();
    }

    // Seleciona todas as células com id "visualiza"
    var celulas = document.querySelectorAll("#tabelaCaixa tbody tr#visualiza");

    // Itera sobre cada célula e adiciona os eventos de mouseover e mouseout
    celulas.forEach(function (celula) {
        celula.addEventListener("mouseover", function () {
            celula.style.backgroundColor = "rgba(0, 120, 0, 0.484)";
            celula.style.color = "white";
            celula.style.cursor = "pointer";
        });
        celula.addEventListener("mouseout", function () {
            celula.style.backgroundColor = "white";
            celula.style.color = "#858796";
            celula.style.cursor = "default";
        });
    });
    $(".preloading").hide();

    // Adiciona manipulador de eventos de clique para cada linha da tabela
    $("#tabelaCaixa tbody").on("click", "tr", function () {
        // Obtém o ID da caixa da linha clicada
        var id = $(this).attr("data-id");
        // enviando id para montar card
        ListarCaixaEspecifica(id);

    });
}

// Visualizacao dos clientes cadastrados na caixa
function MontarCardsVisualizacao(conteudoCaixa) {

    $("#containerCards").empty();
    $.get("/caixas/visualizacao.html", function (data) {

        // Monta os cards
        $(conteudoCaixa).each (function (index, cliente) {
            if (cliente != null) {
                var cardHtml = `
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-success shadow h-100 py-2">
                            <div class="card-body" id="cardCaixa">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2 content-card">
                                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">${cliente.nome}</div>
                                        <div class="h5 mb-0 font-weight-bold text-gray-800">${cliente.conta}</div>
                                        <div class="h6 mb-0 font-weight-bold text-gray-500">${cliente.caixa}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                $("#containerCards").append(cardHtml);    
            }
        });
    })
}

// Capturando os valores para POST API
function ObterValoresFormulario() {
    var nome = $("#inputNome").val();
    var referencia = $("#inputReferencia").val();
    var rua = $("#inputRua").val();
    var bairro = $("#inputBairro").val();
    var cidade = $("#inputCidade").val();

    var objeto = {
        nome: nome,
        referencia: referencia,
        rua: rua,
        bairro: bairro,
        cidade: cidade
    };

    return objeto;
}

// Enviando o formulário de cadastro para API
function EnviarFormularioParaApi() {
    $(".preloading").show();

    var rotaApi = 'caixa';

    var objeto = ObterValoresFormulario();
    var json = JSON.stringify(objeto);

    $.ajax({
        url: urlBaseApi + rotaApi,
        method: 'POST',
        data: json,
        contentType: 'application/json'
    }).done(function () {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Caixa adicionada com sucesso.',
            showConfirmButton: false,
            timer: 1500
        });

        setTimeout(function () {
            RedirecionarListagem();
        }, 1500);
    });
}

// Funcao validadora do formulario e chamada para funcao de Enviar
function SubmeterFormulario() {
    var isValido = $('#formCaixa');
    if (isValido) {
        EnviarFormularioParaApi();
    }
}

// lendo o documento e inserindo as mascaras
$(document).ready(function () {
    setTimeout(function () {
        $(".preloading").hide();
    }, 100);

    $.ajaxSetup({
        headers: { 'Authorization': 'Bearer' + localStorage.getItem('bearer') },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 400) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: jqXHR.response.Text,
                })
            } else if (jqXHR.status == 401) {
                Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: 'A sua sessão expirou, faça o login novamente!'
                }).then((result) => {
                    window.location.href = 'index.html';
                });
            } else if (jqXHR.status == 403) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Acesso negado!',
                    text: 'Você não tem permissão para acecssar essa funcionalidade!'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: jqXHR.responseText
                });
            }
            $(".preloading").hide();
        }
    });
})

function RedirecionaNovaCaixa() {
    window.location.href = "/caixas/adicionar.html";
}


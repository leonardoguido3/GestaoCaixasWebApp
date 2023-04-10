var urlBaseApi = "https://localhost:44394/";
var tabelaCaixa;
var cardCliente;

// LISTAR CAIXAS
$(document).ready(function () {
    ListarCaixas();
});

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

// CONSTRUCAO DE TABELAS
function ConstruirTabelaCaixa(linhas) {

    var htm = "";

    $(linhas).each(function (index, linha) {
        htm = htm + `<tr id="visualiza" onclick="VisualizarCaixa(${linha.id})"><th>${linha.nome}</th><td>${linha.referencia}
        </td><td>${linha.rua}</td><td>${linha.bairro}</td><td>${linha.cidade}</td><th>${linha.clientes}</th></tr>`;
    });

    $("#tabelaCaixa tbody").html(htm);
    if (tabelaCaixa == undefined) {
        tabelaCaixa = $('#tabelaCaixa').DataTable();
    }
    $(".preloading").hide();
    var celula = document.getElementsById("visualiza");
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
}

// CAPTURANDO VALORES PARA POST
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

function SubmeterFormulario() {
    var isValido = $('#formCaixa');
    if (isValido) {
        EnviarFormularioParaApi();
    }
}
function RedirecionarListagem() {
    window.location.href = "/caixas/index.html";
}


function VisualizarCaixa(linha) {
    window.location.href = "/caixas/visualizacao.html";
    ListarCaixaId(id);
}

function ListarCaixaId(id) {
    var rotaApi = "caixa/";

    $.ajax({
        url: urlBaseApi + rotaApi + id,
        method: 'GET',
        dataType: 'json',
        // beforeSend: function (xhr){
        //     xhr.setRequestHeader('Authorization', 'Bearer' + localStorage.getItem('bearer'));
        // }
    }).done(function (conteudoApi) {
        ConstruirCardCaixa(conteudoApi);
    });
}

function ConstruirCardCaixa(linhas) {
    var htm = "";

    $(linhas).each(function (index, linha) {
        htm = htm + `<div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                            ATIVO</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">${linha.nome}</div>
                        <div class="h6 mb-0 font-weight-bold text-gray-500">${linha.referencia}</div>
                        <div class="h6 mb-0 font-weight-bold text-gray-500">${linha.rua}</div>
                    </div>
                </div>
            </div>
        </div>`;
    });

    $("#cardCaixa div").html(htm);
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


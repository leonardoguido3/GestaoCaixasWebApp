// lendo o documento e inserindo as mascaras
$(document).ready(function () {
    setTimeout(function(){
        $(".preloading").hide();
    }, 100);

    $.ajaxSetup({
        headers: { 'Authorization': 'Bearer' + localStorage.getItem('bearer')},
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

var celula = document.getElementById("visualizarCaixa");
    celula.addEventListener("mouseover", function() {
      celula.style.backgroundColor = "rgba(0, 120, 0, 0.484)";
      celula.style.color = "white";
      celula.style.cursor = "pointer";
    });
    celula.addEventListener("mouseout", function() {
      celula.style.backgroundColor = "white";
      celula.style.color = "#858796";
      celula.style.cursor = "default";
    });



function RedirecionaNovaCaixa() {
    window.location.href = "/caixas/adicionar.html";
}

function VisualizarCaixa(){
    window.location.href = "/caixas/visualizacao.html";
}



// FUNÇÕES PARA ADICIONAR NOVA CAIXA

// criei uma variavel contendo a string da minha url base onde estão minhas APIs
var urlBaseApi = "https://localhost:44394/";

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
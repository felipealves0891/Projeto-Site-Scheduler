$(document).ready(function(){
    
    $("#btnHome").click(function(){
        alterImage("app/_imagens/casa.png");
        alterSource("app/_pages/home.html");
        alterSelected(this.id);
    });

    $("#btnAgendador").click(function(){
        alterImage("app/_imagens/agenda.png");
        alterSource("app/_pages/scheduler.html");
        alterSelected(this.id);
    });

    $("#btnSobre").click(function(){
        alterImage("app/_imagens/simbolo-escuro-de-informacao.png");
        alterSelected(this.id);
    });

    $("#btnContato").click(function(){
        alterImage("app/_imagens/contato-telefonico.png");
        alterSelected(this.id);
    });
});

function alterImage(pathOfImage){
    $("#img-page").attr("src", pathOfImage);
}

function alterSource(urlOfPage){
    $("#window").attr("src",urlOfPage);
}

function alterSelected(id){
    $(".list-inline-item").removeClass("selected");
    $("#" + id).addClass("selected");
}
// CÓDIGO COPIA E COLA DO BOTÃO DE PIX
if(document.querySelector('.button[title="COPIAR CÓDIGO"]')){
    document.querySelector('.button[title="COPIAR CÓDIGO"]').addEventListener('click', function() {
    // Cria um elemento textarea temporário
    var textArea = document.createElement("textarea");
    
    // Define o valor do textarea para o conteúdo do span
    textArea.value = document.querySelector('#pixCode').textContent;
    
    // Adiciona o textarea ao DOM
    document.body.appendChild(textArea);
    
    // Seleciona o conteúdo do textarea
    textArea.select();
    
    // Copia o texto selecionado para a área de transferência
    document.execCommand('copy');
    
    // Remove o textarea do DOM
    document.body.removeChild(textArea);
    
    // (Opcional) Mostra uma mensagem para o usuário
    alert('Código copiado com sucesso!');
});
}


function copiarCodigoPixSuitPayNew(){
    // Cria um elemento textarea temporário
    var textArea = document.createElement("textarea");
    
    // Define o valor do textarea para o conteúdo do span
    textArea.value = document.querySelector('#pixCode').textContent;
    
    // Adiciona o textarea ao DOM
    document.body.appendChild(textArea);
    
    // Seleciona o conteúdo do textarea
    textArea.select();
    
    // Copia o texto selecionado para a área de transferência
    document.execCommand('copy');
    
    // Remove o textarea do DOM
    document.body.removeChild(textArea);
    
    // (Opcional) Mostra uma mensagem para o usuário
    alert('Código copiado com sucesso!');
}


// CONFIRMAR O PAGAMENTO
function confirmarPagamentoPIXSuitPay(codigo_referencia,order_id){

    jQuery("#btnConsultaOperacaoPix").html(`PROCESSANDO...`);

    const homeUrl = jQuery("#suitpay_homeurl").val();

    var params = "action=confirmar_pagamento_pix_suitpay&codigo_ref="+codigo_referencia+"&order_id="+order_id;

                        // ENVIAR PARA CONSULTA
                        jQuery.ajax({
                            url: homeUrl+"/wp-admin/admin-ajax.php",
                            type: "POST",
                            dataType: "json",
                            data: params,
                            success: function(data){

                                console.log("RETORNO SOBRE O PAGAMENTO:");
                                console.log(data);
                                
                                // A APOSTA DEU CERTO (O ENVIO)
                                if(data.sucesso==200){

                                    //console.log("RETORNO RECEBIDO COM SUCESSO!");

                                    // STATUS DO PAGAMENTO
                                    if(data.status_pagamento=="PAID"){

                                        var b = jQuery.confirm({
                                            title: 'Pagamento Confirmado',
                                            type: 'green',
                                            content: 'Seu pagamento foi confirmado com sucesso! Obrigado.',
                                            buttons: {
                                                heyThere: {
                                                    text: 'Ok', 
                                                    action: function () {
                                                        b.close();
                                                    }
                                                }
                                            }
                                        });

                                        jQuery("#btnConsultaOperacaoPix").html(`PAGAMENTO CONFIRMADO!`);
                                        jQuery("#btnConsultaOperacaoPix").attr("disabled", true);

                                        //return true;

                                    }else{

                                        var b = jQuery.confirm({
                                            title: 'Pagamento não identificado',
                                            type: 'red',
                                            content: 'Seu pagamento ainda não foi identificado. Confirme se já o realizou e tente novamente em alguns minutos.',
                                            buttons: {
                                                heyThere: {
                                                    text: 'Ok, entendi', 
                                                    action: function () {
                                                        b.close();
                                                    }
                                                }
                                            }
                                        });

                                        jQuery("#btnConsultaOperacaoPix").html(`CONFIRMAR O PAGAMENTO`);

                                        //return false;

                                    }
                                    
                                }

                            }
                        });


}



function primepagInit(valorMin,valorMax){

    var valorDeposito = jQuery("#saldo_add").val();

    // VALOR INVALIDO
    if(parseFloat(valorDeposito) < parseFloat(valorMin) && 
       parseFloat(valorDeposito) > parseFloat(valorMax)){

            var b = $.confirm({
                title: 'Oops! Valor incorreto.',
                theme: 'supervan',
                content: 'O valor de depósito precisa ser maior que o valor mínimo e menor que o valor máximo. Observe as informações inseridas e tente novamente.',
                buttons: {
                    heyThere: {
                        text: 'Ok, entendi', 
                        action: function () {
                            b.close();
                        }
                    }
                }
            });

            return;

    }

    // TUDO OK, GERAR PIX
    var carregandoPix = $.confirm({
        title: 'Gerando seu PIX',
        content: `

            <div id="retornoPix">
                <p style="text-align:center;font-size:13px;">
                    <img src="${homeUrl}/wp-content/plugins/plugin-betwp/images/loading.gif" style="display: block;width: 25px;margin-left: auto;margin-right: auto;margin-top: 20px;margin-bottom: 20px;" />
                    carregando... Aguarde...
                </p>
            </div>
        
        `,
        buttons: {
            heyThere: {
                text: 'Fechar', 
                action: function () {
                    carregandoPix.close();
                }
            }
        }
    });

    // CHAMAR A FUNÇÃO AJAX PARA DEPOIS DE 3 SEGUNDOS
    setTimeout(function(){
        criarPixPrimepag(valorDeposito);
    }, 3000);


}

var jaPaguei;

function criarPixPrimepag(valorDeposito){

            var talvezAfiliado = 0;

            if(sessionStorage.getItem("vendedor_afiliado")){
                talvezAfiliado = sessionStorage.getItem("vendedor_afiliado");
                console.log("Match Afiliado");
            }

            var params = "action=solicitar_pix_suitpay_ajax&valor_deposito="+valorDeposito+"&talvezAfiliado="+talvezAfiliado;

            // ENVIAR PARA COMPRA
            jQuery.ajax({
                url: homeUrl+"/wp-admin/admin-ajax.php",
                type: "POST",
                dataType: "json",
                data: params,
                success: function(data){
                    console.log("RETORNO SOBRE PIX SUITPAY:");
                    console.log(data);
                    // A APOSTA DEU CERTO (O ENVIO)
                    if(data.status==200){

                        if(data.text_content){

                            jQuery("#retornoPix").html(`
                                    
                                    <p style="font-size:13px;text-align:center">
                                        QRCODE PIX para o pagamento:
                                    </p>
                                    <img src="${data.image_content}" style="width:260px;margin-left:auto;margin-right:auto;display:block;margin-bottom:20px;margin-top: 20px;padding: 20px;background: #f2f2f2;border-radius: 8px;" />

                                    <div class="form-group">
                                        <label style="font-size:13px;text-align:center;">Código "copia e cola":</label>
                                        <textarea class="form-control" rows="5" style="font-size:13px;" readonly>${data.text_content}</textarea>
                                    </div>
                                    <span id="pixCode" style="display:none;">${data.text_content}</span>

                                    <p style="text-align:center">
                                        <a 
                                            href="javascript:void(0)" 
                                            class="button button-confirmar-primepag-pix" 
                                            onclick="copiarCodigoPixSuitPayNew()"
                                            style="font-size: 13px;background: #666 !important;width: fit-content;margin-bottom: 22px;padding:5px;display:block;color: #fff !important;margin-left: auto;margin-right: auto;">
                                            COPIAR CÓDIGO
                                        </a>
                                    </p> 

                                    <p style="font-size:13px;text-align:center">
                                        Aguardando confirmação do seu pagamento... Quando ele for identificado, seu saldo será atualizado automaticamente.
                                    </p>
                                                                
                            `);

                            // CONSULTAR SE O PAGAMENTO FOI CONFIRMADO, 1 VEZ A CADA 3 SEGUNDOS
                            //jaPaguei = setInterval(function(){
                            //    consultarPagamentoTefWay(data.resultado.data.transactionId);
                            //}, 3000);

                        }
                        

                       // OK

                    }else{

                       // DEU RUIM

                    }

                }
            });


}


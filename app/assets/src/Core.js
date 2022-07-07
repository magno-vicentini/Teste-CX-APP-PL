let client = ZAFClient.init();

const fetchCEP = async () => {
  const { value } = document.getElementById('text-ticket-cep')
  const urlCEP = `https://viacep.com.br/ws/${value}/json/`

  const response = await fetch(urlCEP)
  const { bairro, cep, localidade, logradouro, uf, complemento, ddd } = await response.json()
  const commentCep = `CEP: ${cep}, Estado: ${uf}, Cidade: ${localidade}, Bairro: ${bairro}, Logradouro: ${logradouro} Complemento: ${complemento}, DDD: ${ddd}`
  return commentCep

};

const updateCEP = () => {
  const buttonUpdateCEP = document.getElementById('update-ticket-cep')

  buttonUpdateCEP.addEventListener('click', async () => {
    const cep = JSON.stringify({
      ticket: {
        comment: {
          body: await fetchCEP(),
          public: true
        }, 
        status: "Solved"
      }
    })

    const ticketId = await client.get('ticket.id').then((response) => {
      return response['ticket.id'];
    });

    console.log(ticketId)

    client
      .request({
        url: `/api/v2/tickets/${ticketId}`,
        cors: false,
        contentType: 'application/json',
        data: cep,
        dataType: 'text',
        httpCompleteResponse: true,
        type: 'PUT',
      })
      .then(() => console.log('ticket updated'))
      .catch(() => console.log('ticket failed to update'));
  });
  
}

const Core = {
  updateCEP,
};

export default Core;

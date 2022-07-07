let client = ZAFClient.init();

const fetchCEP = async () => {
  const { value } = document.getElementById('text-ticket-cep')
  const urlCEP = `https://viacep.com.br/ws/${value}/json/`

  const response = await fetch(urlCEP)
  const { bairro, cep, localidade, logradouro, uf, complemento, ddd } = await response.json()

  const commentCep = `CEP: ${cep}, Estado: ${uf}, Cidade: ${localidade || 'Não possue localidade'}, Bairro: ${bairro || 'Não possue bairro'}, Logradouro: ${logradouro || 'Não possue logradouro'} Complemento: ${complemento || 'Não possue complemento'}, DDD: ${ddd}`
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

const listTickets = () => {
  const buttonListTickets = document.getElementById('list-tickets')
  const listTickets = document.getElementById('container-tickets')

  buttonListTickets.addEventListener('click', () => {
    client
        .request({
          url: `/api/v2/tickets/recent`,
          cors: false,
          contentType: 'application/json',
          httpCompleteResponse: true,
          type: 'GET',
        })
        .then(({responseJSON}) => {
          responseJSON.tickets.map((ticket, index) => {
            console.log(ticket)
            const liTicket = document.createElement('li')
            liTicket.innerHTML = `${index} - ${ticket.raw_subject}`
            listTickets.appendChild(liTicket) 
            buttonListTickets.disabled = true
            buttonListTickets.style.backgroundColor = 'rgb(71, 195, 71)'
            buttonListTickets.style.color = 'black'
            buttonListTickets.style.cursor = 'default'
            buttonListTickets.innerHTML = 'Tickets Listados'
          })
        })
        .catch(() => console.log('fail to find recent tickets'));

  })
}

const Core = {
  updateCEP,
  listTickets,
};

export default Core;

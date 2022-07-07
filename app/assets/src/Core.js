let client = ZAFClient.init();

const fetchCEP = async () => {
  const { value } = document.getElementById('text-ticket-cep')

  console.log(value)
  const urlCEP = `https://viacep.com.br/ws/${value}/json/`

  const response = await fetch(urlCEP)
  const data = await response.json()
  console.log(data)

  return data.bairro

};

const updateCEP = () => {
  const buttonUpdateCEP = document.getElementById('update-ticket-cep')

  buttonUpdateCEP.addEventListener('click', async () => {
    const cep = JSON.stringify({
      ticket: {
        comment: {
          body: await fetchCEP(),
          public: true
        }
      }
    })

    const ticketId = await client.get('ticket.id').then((response) => {
      return response['ticket.id'];
    });

    console.log(ticketId)
    console.log(client)

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

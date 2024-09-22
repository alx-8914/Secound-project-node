// Importa o framework Express para criar o servidor HTTP
const express = require('express');

// Importa o módulo UUID para gerar IDs únicos para cada projeto/usuário
const uuid = require('uuid');
// Importa o módulo de banco de dados



// Define a porta na qual o servidor vai rodar
const port = 3003;

// Inicializa a aplicação Express
const app = express();

app.use(express.json());

app.use(cors());

// Inicializa um array vazio para armazenar os projetos/usuários cadastrados
const newProject = [];
// Middleware para permitir que o servidor entenda requisições com JSON no corpo
const checkUsersId = (request, response, next) => {
  const { id } = request.params; // Extrai o ID da URL (parâmetro de rota)

  // Encontra o índice do projeto/usuário a ser atualizado no array 'newProject'
  const index = newProject.findIndex(user => user.id === id);
  // Se o ID não for encontrado, retorna erro 404 (Não Encontrado)
  if (index < 0) {
    return response.status(404).json({ error: '🚨User not found.' });
  }

  request.userIndex = index
  request.userId = id

  next()
}

/* // Define o middleware para verificar se o projeto/usuário existe antes de realizar a operação
  const myFirtsMiddleware = (request, response, next) => {
  console.log('Fui chamado');

  next();

  console.log('Finilizamos');

  app.use(myFirtsMiddleware)
}*/


// Rota GET para listar todos os projetos/usuários cadastrados
// Quando acessada, retorna o array 'newProject' com todos os registros
app.get('/project/', (request, response) => {
  return response.json(newProject);
});

// Rota POST para criar um novo projeto/usuário
// O nome e idade são recebidos no corpo da requisição
// Um ID único é gerado e o projeto/usuário é adicionado ao array 'newProject'
app.post('/project/', (request, response) => {
  // Extrai 'name' e 'age' do corpo da requisição
  const { name, age } = request.body;

  // Cria um novo objeto de projeto/usuário com um ID único
  const project = { id: uuid.v4(), name, age };

  // Adiciona o novo projeto/usuário ao array 'newProject'
  newProject.push(project);

  // Retorna o novo projeto/usuário criado com status 201 (Criado)
  return response.status(201).json(project);
});

// Rota PUT para atualizar um projeto/usuário existente
// O ID do projeto/usuário a ser atualizado é passado como parâmetro de rota
// O nome e idade são recebidos no corpo da requisição
app.put('/project/:id', checkUsersId, (request, response) => {
  // Extrai 'name' e 'age' do corpo da requisição
  const { name, age } = request.body;
  const index = request.userIndex
  const id = request.userId
  // Cria um objeto atualizado com os novos dados
  const updateProject = { id, name, age };
  // Atualiza o projeto/usuário no array na posição encontrada
  newProject[index] = updateProject;

  // Retorna o projeto/usuário atualizado
  return response.json(updateProject);
});

// Rota DELETE para remover um projeto/usuário existente
// O ID do projeto/usuário a ser removido é passado como parâmetro de rota
app.delete('/project/:id', checkUsersId, (request, response) => {
  const index = request.userIndex
  // Remove o projeto/usuário do array
  newProject.splice(index, 1);

  // Retorna uma resposta com status 204 (Nenhum Conteúdo) e uma mensagem de sucesso
  return response.status(204).json({ message: '🗑️Usuário Deletado com Sucesso.' });
});

// Inicia o servidor na porta definida e exibe uma mensagem no console
app.listen(port, () => {
  console.log(`🚀😎💻 Server is running on port ${port}`);
});

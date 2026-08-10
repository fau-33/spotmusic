# 🎵 Spotmusic - CRUD com Spring Boot

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Aplicação Web Full Stack desenvolvida para gerenciar Playlists e Músicas. Este projeto foi construído para aplicar conceitos sólidos de desenvolvimento back-end com Java e Spring Framework, incluindo persistência de dados, roteamento MVC e deploy na nuvem.

🔗 **Acesse a aplicação rodando ao vivo:** [Spotmusic na Nuvem](https://spotmusic-flavio.onrender.com/)

## 🚀 Funcionalidades

- **Gerenciamento de Playlists:** Criar, listar, editar e excluir playlists.
- **Gerenciamento de Músicas:** Adicionar músicas específicas dentro de uma playlist, com validação de dados (ex: notas de 0 a 10).
- **Relacionamento de Banco de Dados:** Mapeamento One-to-Many entre Playlists e Músicas utilizando Hibernate/JPA.
- **Interface Responsiva:** Telas estilizadas com Bootstrap 5 e Thymeleaf, incluindo Modais de confirmação para exclusão.

## 🛠️ Tecnologias Utilizadas

- **Back-end:** Java 17, Spring Boot, Spring MVC, Spring Data JPA, Hibernate.
- **Front-end:** HTML5, Thymeleaf, Bootstrap 5.
- **Banco de Dados:** MySQL (Hospedado no Aiven).
- **Deploy & Infraestrutura:** Docker, Render (PaaS), Maven.

## ⚙️ Como executar localmente

1. Clone este repositório:
   ```bash
   git clone [https://github.com/fau-33/spotmusic.git](https://github.com/fau-33/spotmusic.git)
   ```
2. Entre na pasta do projeto:
   ```bash
   cd spotmusic
   ```
3. Configure as credenciais do seu banco de dados MySQL local no arquivo `src/main/resources/application.properties`.
4. Execute o projeto usando o Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
5. Acesse no navegador: `http://localhost:8080/`

## 👨‍💻 Autor

**Flávio Félix**  
Desenvolvedor Full Stack / Java
# Car Rental - SAET 2025

Este é o projeto para a Semana Acadêmica (SAET) de 2025 da Universidade Tecnológica Federal do Paraná (UTFPR) - Campus Toledo, focado no desenvolvimento de um sistema de aluguel de veículos.

Este projeto utiliza o framework Laravel (PHP) e Laravext (Adapter de React)

## Requisitos

**Recomenda-se o uso do Laravel Herd (disponível para Windows e MacOS) para facilitar a configuração do ambiente de desenvolvimento, que pode ser baixado [aqui](https://herd.laravel.com/).**

Instale as seguintes ferramentas para rodar o projeto (caso tenha optado por usar o Laravel Herd, todas essas ferramentas já estarão instaladas):
- PHP 8.2 ou superior
- Composer
- Node.js 18 ou superior
- NPM ou Yarn

Caso esteja usando Linux, pode seguir as instruções de instalação dos componentes acima na documentação do Laravel Herd [aqui](https://laravel.com/docs/12.x/installation#installing-php).

## Como rodar o projeto

Recomenda-se rodar os comandos a seguir no diretório do Laravel Herd, que pode variar dependendo do sistema operacional. No macOS, o diretório padrão é `~/Herd`. No Windows, o diretório padrão é `%USERPROFILE%\Herd`.

Instale-o usando o comando:

```bash
laravel new laravext-template --using=arthurydalgo/laravext-template
```

(Ele pode perguntar "Would you like to run npm install and npm run build?", aperte Enter para aceitar).

Caso esteja usando Laravel Herd, navegue até o diretório do projeto, e execute (ele pode pedir para instalar o concurrently, aceite):

```bash
composer run dev
```

Esse comando irá automaticamente iniciar as filas, rodar `npm run dev` e exibir logs. 

Caso contrário, execute (ele pode pedir para instalar o concurrently, aceite):

```bash
composer run dev-with-server
```

Ele irá realizar as mesmas operações do comando anterior, mas também irá rodar `php artisan serve` para iniciar o servidor embutido do Laravel.

## Seedando o banco de dados

Para popular o banco de dados com dados iniciais, execute:

```bash
php artisan db:seed
```
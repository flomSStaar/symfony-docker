# 🐳 Symfony and Docker

XXX is a powerful tool designed to streamline the configuration process of Symfony projects with Docker.
With XXX, developers can automatically generate the necessary configuration files to run Symfony projects with Docker.
This tool simplifies the setup process and allows for easy integration of additional modules to enhance Docker execution.

## Getting started

### Prerequisites

> TODO

### Installation

> TODO

### Usage

```bash
XXX COMMAND
# runs the command
XXX --help
# outputs help
```

## Commands

- [init](commands/init.md)
- [add](commands/add.md)
- [rm](commands/rm.md)
- [delete](commands/delete.md)
- [local-env](commands/local-env.md)

## Modules

XXX provides a variety of modules that can be easily integrated into your Symfony project's Docker configuration. These modules enhance Docker execution and provide additional functionalities. Here's an overview of the available modules:

- [PHP](modules/php.md)
- [MariaDB](modules/mariadb.md)
- [Node](modules/node.md)
- [MailHog](modules/mailhog.md)
- [Minio (S3)](modules/minio.md)
- [InfluxDB](modules/influxdb.md)
- [Gotenberg (PDF)](modules/gotenberg.md)

### Adding a Module

To add a module to your Symfony project's Docker configuration, follow these steps:

Run the command below
```shell
XXX add
```

A list of available modules will be displayed. Select the module you want to add from the list, and the configuration will be updated accordingly.

> You can see more details on this command [here](commands/add.md).

### Removing a Module
To remove a module from your Symfony project's Docker configuration, follow these steps:

Run the command below

```shell
XXX rm
```

A list of currently added modules will be displayed. Select the module you want to remove from the list, and the configuration will be updated accordingly.

> You can see more details on this command [here](commands/rm.md).

## Roadmap

- [ ] commands
  - [ ] create
  - [x] init
  - [x] add
  - [x] rm
  - [x] delete
- [ ] modules
  - [x] PHP
  - [x] MariaDB
  - [ ] Postgres
  - [ ] MongoDB
  - [x] Node
  - [x] MailHog
  - [ ] MailPit
  - [x] Minio (S3)
  - [x] InfluxDB
  - [x] Gotenberg

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you want to report a bug or request a new feature, feel free to open a [new issue](#).

If you want to contribute on this project, please fork the repo and create a [pull request](#).

## License

This project is [MIT](../../LICENSE.MD) licensed.

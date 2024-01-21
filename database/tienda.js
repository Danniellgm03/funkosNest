db.createUser({
  user: 'admin',
  pwd: 'adminPassword123',
  roles: [
    {
      role: 'readWrite',
      db: 'funkos',
    },
  ],
})

db = db.getSiblingDB('funkos')

db.createCollection('pedidos')

db.pedidos.insertMany([
  {
    _id: ObjectId('6536518de9b0d305f193b5ef'),
    idUsuario: 1,
    cliente: {
      nombreCompleto: 'Juan Perez',
      email: 'juanperez@gmail.com',
      telefono: '+34123456789',
      direccion: {
        calle: 'Calle Mayor',
        numero: '10',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        pais: 'España',
        codigoPostal: '28001',
      },
    },
    lineasPedido: [
      {
        idProducto: 2,
        precioProducto: 19.99,
        cantidad: 1,
        total: 19.99,
      },
      {
        idProducto: 3,
        precioProducto: 15.99,
        cantidad: 2,
        total: 31.98,
      },
    ],
    createdAt: '2023-10-23T12:57:17.3411925',
    updatedAt: '2023-10-23T12:57:17.3411925',
    isDeleted: false,
    totalItems: 3,
    total: 51.97,
    _class: 'Pedido',
  },
  {
    _id: ObjectId('6536518de9b0d305f193b5ef'),
    idUsuario: 1,
    cliente: {
      nombreCompleto: 'Juan Perez',
      email: 'juanperez@gmail.com',
      telefono: '+34123456789',
      direccion: {
        calle: 'Calle Mayor',
        numero: '10',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        pais: 'España',
        codigoPostal: '28001',
      },
    },
    lineasPedido: [
      {
        idProducto: 2,
        precioProducto: 19.99,
        cantidad: 1,
        total: 19.99,
      },
      {
        idProducto: 3,
        precioProducto: 15.99,
        cantidad: 2,
        total: 31.98,
      },
    ],
    createdAt: '2023-10-23T12:57:17.3411925',
    updatedAt: '2023-10-23T12:57:17.3411925',
    isDeleted: false,
    totalItems: 3,
    total: 51.97,
    _class: 'Pedido',
  },
  {
    _id: ObjectId('656787ba85f90e48e1e76fd4'),
    idUser: 2,
    client: {
      nombreCompleto: 'Daniel Prueba pedido 22222222222222',
      email: 'daniel@gmail.com',
      telefono: '644441297',
      direccion: {
        calle: 'Osiris',
        numero: '19',
        ciudad: 'Humaanes',
        provincia: 'Madrid',
        pais: 'España',
        codigoPostal: '28970',
      },
    },
    lineasPedido: [
      {
        cantidad: 4,
        idProducto: 2,
        precioProducto: 20,
        total: 80,
      },
    ],
    totalProductos: 1,
    totalPedido: 80,
    createdAt: '2023-10-23T12:57:17.3411925',
    updatedAt: '2023-10-23T12:57:17.3411925',
    isDeleted: false,
    _class: 'Pedido',
  },
])

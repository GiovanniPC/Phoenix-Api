const mongoose = require('mongoose');
const Stores = require('./models/company');

const dbtitle = 'phoenix-api';
mongoose.connect(`mongodb://localhost/${dbtitle}`);
Stores.collection.drop();

const stores = [
  {
    name: 'Mussum Repairs',
    address: 'Alameda Jau',
    razaosocial: '1301',
    location: {
      type: 'Point',
      coordinates: ['-46.6623271', '-23.5617326'],
    },
    speciality: 'Tablet',
    cnpj: '2023149012',
    phone: '01420-001',
    email: 'something@test.com',
  },
  {
    name: 'Mussum Fix',
    address: 'Av. Paulista',
    razaosocial: '2034',
    location: {
      type: 'Point',
      coordinates: ['-46.6615105', '-23.5585757'],
    },
    speciality: 'Mobile',
    cnpj: '41203102',
    phone: '01310-200',
    email: 'something@test.com',
  },
  {
    name: 'Mussum Repair',
    address: 'R. Augusta',
    razaosocial: '1856',
    location: {
      type: 'Point',
      coordinates: ['-46.6634952', '-23.558779'],
    },
    speciality: 'Laptop',
    cnpj: '3124125',
    phone: '01412-000',
    email: 'something@test.com',
  },
  {
    name: 'Mussum MasterBuilder',
    address: 'R. Pamplona',
    razaosocial: '734',
    location: {
      type: 'Point',
      coordinates: ['-46.6547006', '-23.5643488'],
    },
    speciality: 'Tablet',
    cnpj: '31251231',
    phone: '01405-001',
    email: 'something@test.com',
  },
  {
    name: 'Mussum Repair',
    address: 'Av. Goias',
    razaosocial: '1805',
    location: {
      type: 'Point',
      coordinates: ['-46.5581647', '-23.6163362'],
    },
    speciality: 'Console',
    cnpj: '31245123',
    phone: '09550-050',
    email: 'something@test.com',
  },
  {
    name: 'Mussum Fix It',
    address: 'R. Mal. Deodoro',
    razaosocial: '1332',
    location: {
      type: 'Point',
      coordinates: ['-46.6230304', '-23.6309083'],
    },
    speciality: "TV's",
    cnpj: '4125234',
    phone: '09710-002',
    email: 'something@test.com',
  },
  {
    name: 'Biritis faz tudo',
    address: 'R. Aurora Soares Barbosa',
    razaosocial: '775',
    location: {
      type: 'Point',
      coordinates: ['-46.7719213', '-23.5464799'],
    },
    speciality: "TV's",
    cnpj: '1231415',
    phone: '06032-010',
    email: 'something@test.com',
  },
  {
    name: 'FixITmussuM',
    address: 'R. Waldir de Azevedo',
    razaosocial: '20',
    location: {
      type: 'Point',
      coordinates: ['-46.7805996', '-23.5916636'],
    },
    speciality: "TV's",
    cnpj: '41231512',
    phone: '07122-170',
    email: 'something@test.com',
  },
  {
    name: 'Mussivis',
    address: 'R. Sebastião Pereira',
    razaosocial: '245',
    location: {
      type: 'Point',
      coordinates: ['-46.6490426', '-23.5396795'],
    },
    speciality: 'Audio',
    cnpj: '43252312',
    phone: '01225-020',
    email: 'something@test.com',
  },
  {
    name: 'MasterFix do Mussum',
    address: 'Av. Rui Barbosa',
    razaosocial: '409',
    location: {
      type: 'Point',
      coordinates: ['-46.644993', '-23.559155'],
    },
    speciality: 'Audio',
    cnpj: '4125123',
    phone: '06311-000',
    email: 'something@test.com',
  },
  {
    name: "Mussum'O'Matic",
    address: 'Av. Antonio Piranga',
    razaosocial: '171',
    location: {
      type: 'Point',
      coordinates: ['-46.622707', '-23.686251'],
    },
    speciality: 'Laptop',
    cnpj: '4123512',
    phone: '09911-160',
    email: 'something@test.com',
  },
  {
    name: 'Mussivis',
    address: 'Av. Vital Brasil',
    razaosocial: '1133',
    location: {
      type: 'Point',
      coordinates: ['-46.7151041', '-23.5694623'],
    },
    speciality: 'Laptop',
    cnpj: '23124123',
    phone: '05503-001',
    email: 'something@test.com',
  },
  {
    name: 'Murgusum',
    address: 'Av. Alcantara Machado',
    razaosocial: '576',
    location: {
      type: 'Point',
      coordinates: ['-46.6193709', '-23.5530546'],
    },
    speciality: 'Laptop',
    cnpj: '4123512',
    phone: '03102-000',
    email: 'something@test.com',
  },
  {
    name: 'Massivis Mussum',
    address: 'Av. Imirim',
    razaosocial: '1217',
    location: {
      type: 'Point',
      coordinates: ['-46.6462815', '-23.4944008'],
    },
    speciality: 'Mobile',
    cnpj: '31241251',
    phone: '02465-100',
    email: 'something@test.com',
  },
  {
    name: 'Sr Biritis',
    address: 'Av. Roque Petroni Junior',
    razaosocial: '1089',
    location: {
      type: 'Point',
      coordinates: ['-46.6980466', '-23.6215123'],
    },
    speciality: 'Mobile',
    cnpj: '31241512',
    phone: '04707-000',
    email: 'something@test.com',
  },
];


Stores.create(stores, (err) => {
  if (err) { throw (err) }
  console.log(`Created ${stores.length} entries in the stores database`);
  mongoose.connection.close();
});